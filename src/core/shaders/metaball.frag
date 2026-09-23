uniform vec3  u_light_position;
uniform vec3  u_color_hot;
uniform vec3  u_color_cool;
uniform float u_time;
uniform float u_glow_enabled;
uniform vec3  u_glow_color;
uniform float u_noise_enabled;
uniform vec3  u_noise_color_1;
uniform vec3  u_noise_color_2;
uniform float u_bump_enabled;
uniform float u_displacement;

uniform vec3  u_ball_center[METABALL_GPU_MAX_BALLS];
uniform float u_ball_strength[METABALL_GPU_MAX_BALLS];
uniform float u_ball_subtract[METABALL_GPU_MAX_BALLS];
uniform float u_isolation;
uniform vec3  u_effect_position;
uniform float u_effect_scale;
uniform vec3  u_box_half_extent;
uniform vec3  u_box_center;
uniform int   u_raymarch_steps;
uniform float u_normal_epsilon;
uniform mat4  u_projection_matrix; // projectionMatrix isn't declared in fragment shaders - synced from the camera in updateMetaballLight

in vec3 v_local_position;

out vec4 out_color;

// Must match isOnLava()'s formula (interaction_animation.js) - local (2*field-1) space, where
// each ball's contribution is 4*strength/dist^2 - subtract.
float metaballField(vec3 local_position) {
    float field = 0.0;
    for (int i = 0; i < METABALL_GPU_MAX_BALLS; i++) {
        if (u_ball_strength[i] <= 0.0) continue;
        vec3 offset = local_position - u_ball_center[i];
        float distance_squared = max(dot(offset, offset), 0.0001);
        field += max(0.0, 4.0 * u_ball_strength[i] / distance_squared - u_ball_subtract[i]);
    }
    return field;
}

// Distance to the nearest ball's own isosurface - a safe (if conservative) march stride while the
// combined field below hasn't crossed the isolation threshold yet.
float safeStepDistance(vec3 march_position) {
    float nearest = 1.0e6;
    for (int i = 0; i < METABALL_GPU_MAX_BALLS; i++) {
        if (u_ball_strength[i] <= 0.0) continue;
        float local_radius = 2.0 * sqrt(u_ball_strength[i] / (u_isolation + u_ball_subtract[i]));
        nearest = min(nearest, length(march_position - u_ball_center[i]) - local_radius);
    }
    return nearest;
}

// Shared by crustColdness() and the heat computation below, so the crust bulge stays aligned
// with the same regions the final color reads as "cold".
vec3 heatCoordinate(vec3 world_position) {
    return world_position * 0.7 + vec3(0.0, -u_time * 0.012, u_time * 0.005);
}

// Cheap single-octave proxy for the full heat noise below - affordable on every march step.
float crustColdness(vec3 world_position) {
    float heat_proxy = normalizedFractalBrownianMotion(heatCoordinate(world_position));
    return 1.0 - smoothstep(0.15, 0.65, heat_proxy);
}

void main() {
    vec3 local_camera = (cameraPosition - u_effect_position) / u_effect_scale;
    vec3 ray_direction = normalize(v_local_position - local_camera);

    // Slab ray-AABB test against the proxy box, in the same local space as the field above.
    vec3 box_min = u_box_center - u_box_half_extent;
    vec3 box_max = u_box_center + u_box_half_extent;
    vec3 inverse_direction = 1.0 / ray_direction;
    vec3 t_lower = (box_min - local_camera) * inverse_direction;
    vec3 t_upper = (box_max - local_camera) * inverse_direction;
    vec3 t_min = min(t_lower, t_upper);
    vec3 t_max = max(t_lower, t_upper);
    float t_enter = max(max(max(t_min.x, t_min.y), t_min.z), 0.0);
    float t_exit = min(min(t_max.x, t_max.y), t_max.z);
    if (t_exit < t_enter) discard;

    const float SURFACE_EPSILON = 0.0005;
    const float STEP_SAFETY = 0.8; // shrinks each stride so overlapping balls can't be stepped over
    const float MIN_STEP = 0.001; // floor stride so tracing still advances where the field is nearly flat
    const int BISECTION_STEPS = 6; // refines the crossing point found below to sub-stride precision

    float t = t_enter;
    bool did_hit = false;
    float previous_t = t_enter;

    for (int i = 0; i < METABALL_RAYMARCH_MAX_STEPS; i++) {
        if (i >= u_raymarch_steps || t > t_exit) break;
        vec3 march_position = local_camera + ray_direction * t;

        // The combined field (not just the nearest ball's own isosurface) is what actually decides
        // the hit, so two nearby-but-not-yet-overlapping balls bulge into a shared surface between
        // them instead of only ever reading as a plain union of separate spheres.
        if (metaballField(march_position) >= u_isolation) {
            float lo = previous_t, hi = t;
            for (int b = 0; b < BISECTION_STEPS; b++) {
                float mid = 0.5 * (lo + hi);
                if (metaballField(local_camera + ray_direction * mid) >= u_isolation) hi = mid; else lo = mid;
            }
            t = hi;
            did_hit = true;
            break;
        }

        float distance_to_surface = safeStepDistance(march_position);
        // Biases the safe distance itself, so a bulged crust can still trigger a hit slightly early.
        if (u_displacement > 0.0) {
            vec3 probe_world_position = u_effect_position + u_effect_scale * march_position;
            distance_to_surface -= crustColdness(probe_world_position) * u_displacement;
            if (distance_to_surface < SURFACE_EPSILON) {
                did_hit = true;
                break;
            }
        }

        previous_t = t;
        t += max(distance_to_surface * STEP_SAFETY, MIN_STEP);
    }

    if (!did_hit) discard;

    vec3 hit_local = local_camera + ray_direction * t;

    // The field decreases outward, so its negative gradient is the surface normal.
    vec3 gradient = vec3(
        metaballField(hit_local + vec3(u_normal_epsilon, 0.0, 0.0)) - metaballField(hit_local - vec3(u_normal_epsilon, 0.0, 0.0)),
        metaballField(hit_local + vec3(0.0, u_normal_epsilon, 0.0)) - metaballField(hit_local - vec3(0.0, u_normal_epsilon, 0.0)),
        metaballField(hit_local + vec3(0.0, 0.0, u_normal_epsilon)) - metaballField(hit_local - vec3(0.0, 0.0, u_normal_epsilon))
    );
    vec3 local_normal = normalize(-gradient);

    vec3 world_position = u_effect_position + u_effect_scale * hit_local;

    vec3 view_position = (viewMatrix * vec4(world_position, 1.0)).xyz;
    // normalMatrix isn't declared in fragment shaders; with no rotation and uniform scale here,
    // mat3(viewMatrix) differs from it only by a positive scalar that normalize() below removes.
    vec3 normal = normalize(mat3(viewMatrix) * local_normal);

    if (u_bump_enabled > 0.5) {
        vec3 bump = bumpOffset(world_position, 3.5);
        vec3 bump_coordinate_2 = world_position * 8.5;
        vec3 bump2 = vec3(
            simplexNoise(bump_coordinate_2 + vec3(0.0, 0.0, 2.3)),
            simplexNoise(bump_coordinate_2 + vec3(2.1, 0.0, 0.0)),
            simplexNoise(bump_coordinate_2 + vec3(0.0, 3.7, 0.0))
        );
        normal = normalize(normal + bump * 0.20 + bump2 * 0.10);
    }

    vec3 light_direction = normalize(u_light_position - view_position);
    vec3 view_direction = normalize(-view_position);
    vec3 halfway_direction = normalize(light_direction + view_direction);

    float diffuse  = max(dot(normal, light_direction), 0.0);
    float specular = pow(max(dot(normal, halfway_direction), 0.0), 8.0);

    float fast_pulse = 0.5 + 0.5 * sin(u_time * 1.0);
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.3 + 1.3);
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);

    float heat;
    if (u_noise_enabled > 0.5) {
        vec3 heat_coordinate = heatCoordinate(world_position);
        float heat_base_noise = normalizedFractalBrownianMotion(heat_coordinate);
        float heat_warped_noise = warpedFractalBrownianMotion(heat_coordinate, 0.4);
        heat = smoothstep(0.15, 0.65, mix(heat_base_noise, heat_warped_noise, 0.5));
    } else {
        heat = clamp(diffuse * 0.85 + 0.25, 0.0, 1.0);
    }

    vec3 base_dark = (u_noise_enabled > 0.5) ? mix(u_color_cool, u_noise_color_1, 0.6) : u_color_cool;
    vec3 color = mix(base_dark, u_color_hot, heat);

    if (u_noise_enabled > 0.5) {
        vec3 orange_coordinate = world_position * 1.2 + vec3(u_time * 0.007, -u_time * 0.018, 0.0);
        float orange_noise = normalizedFractalBrownianMotion(orange_coordinate);
        float orange_mask = smoothstep(0.6, 0.85, orange_noise);
        color = mix(color, u_noise_color_2, orange_mask * 0.40);
    }

    float self_illumination = pow(heat, 1.5) * 0.90;
    color += u_color_hot * self_illumination;

    float molten_core = pow(heat, 3.5) * 0.70;
    color += vec3(1.0, 0.75, 0.25) * molten_core;

    color += vec3(0.08, 0.04, 0.03) * specular;
    float rim_wide = pow(1.0 - max(dot(view_direction, normal), 0.0), 4.5);
    color += glow_color * rim_wide * (0.65 + 0.70 * slow_pulse) * u_glow_enabled;

    vec4 clip_position = u_projection_matrix * viewMatrix * vec4(world_position, 1.0);
    gl_FragDepth = clip_position.z / clip_position.w * 0.5 + 0.5;
    out_color = vec4(color, 1.0);
}
