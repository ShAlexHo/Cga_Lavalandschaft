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
uniform int   u_ball_count;
uniform float u_isolation;
uniform vec3  u_effect_position;
uniform float u_effect_scale;
uniform vec3  u_box_half_extent;
uniform vec3  u_box_center;
uniform int   u_raymarch_steps;
uniform float u_normal_epsilon;
uniform mat4  u_projection_matrix;

in vec3 v_local_position;

out vec4 out_color;

float metaballField(vec3 local_position) {
    float field = 0.0;
    for (int i = 0; i < u_ball_count; i++) {
        if (u_ball_strength[i] <= 0.0) continue;
        vec3 offset = local_position - u_ball_center[i];
        float distance_squared = max(dot(offset, offset), 0.0001);
        field += max(0.0, 4.0 * u_ball_strength[i] / distance_squared - u_ball_subtract[i]);
    }
    return field;
}

float safeStepDistance(vec3 march_position) {
    float nearest = 1.0e6;
    for (int i = 0; i < u_ball_count; i++) {
        if (u_ball_strength[i] <= 0.0) continue;
        float local_radius = 2.0 * sqrt(u_ball_strength[i] / (u_isolation + u_ball_subtract[i]));
        nearest = min(nearest, length(march_position - u_ball_center[i]) - local_radius);
    }
    return nearest;
}

vec3 heatCoordinate(vec3 world_position) {
    return world_position * 0.7 + vec3(0.0, -u_time * 0.012, u_time * 0.005);
}

float crustColdness(vec3 world_position) {
    float heat_proxy = normalizedFractalBrownianMotion(heatCoordinate(world_position));
    return 1.0 - smoothstep(0.15, 0.65, heat_proxy);
}

void main() {
    vec3 local_camera_position = (cameraPosition - u_effect_position) / u_effect_scale;
    vec3 ray_direction = normalize(v_local_position - local_camera_position);

    vec3 box_minimum = u_box_center - u_box_half_extent;
    vec3 box_maximum = u_box_center + u_box_half_extent;
    vec3 inverse_direction = 1.0 / ray_direction;
    vec3 minimum_slab_distances = (box_minimum - local_camera_position) * inverse_direction;
    vec3 maximum_slab_distances = (box_maximum - local_camera_position) * inverse_direction;
    vec3 near_slab_distances = min(minimum_slab_distances, maximum_slab_distances);
    vec3 far_slab_distances = max(minimum_slab_distances, maximum_slab_distances);
    float box_entry_distance = max(max(max(near_slab_distances.x, near_slab_distances.y), near_slab_distances.z), 0.0);
    float box_exit_distance = min(min(far_slab_distances.x, far_slab_distances.y), far_slab_distances.z);
    if (box_exit_distance < box_entry_distance) discard;

    const float SURFACE_EPSILON = 0.0005;
    const float STEP_SAFETY = 0.8;
    const float MINIMUM_STEP = 0.001;
    const int BISECTION_STEPS = 6;

    float ray_distance = box_entry_distance;
    bool did_hit = false;
    float previous_ray_distance = box_entry_distance;

    for (int i = 0; i < METABALL_RAYMARCH_MAX_STEPS; i++) {
        if (i >= u_raymarch_steps || ray_distance > box_exit_distance) break;
        vec3 march_position = local_camera_position + ray_direction * ray_distance;

        if (metaballField(march_position) >= u_isolation) {
            float outside_distance = previous_ray_distance;
            float inside_distance = ray_distance;
            for (int j = 0; j < BISECTION_STEPS; j++) {
                float middle_distance = 0.5 * (outside_distance + inside_distance);
                if (metaballField(local_camera_position + ray_direction * middle_distance) >= u_isolation) inside_distance = middle_distance; else outside_distance = middle_distance;
            }
            ray_distance = inside_distance;
            did_hit = true;
            break;
        }

        float distance_to_surface = safeStepDistance(march_position);
        if (u_displacement > 0.0) {
            vec3 probe_world_position = u_effect_position + u_effect_scale * march_position;
            distance_to_surface -= crustColdness(probe_world_position) * u_displacement;
            if (distance_to_surface < SURFACE_EPSILON) {
                did_hit = true;
                break;
            }
        }

        previous_ray_distance = ray_distance;
        ray_distance += max(distance_to_surface * STEP_SAFETY, MINIMUM_STEP);
    }

    if (!did_hit) discard;

    vec3 hit_local_position = local_camera_position + ray_direction * ray_distance;

    vec3 gradient = vec3(
        metaballField(hit_local_position + vec3(u_normal_epsilon, 0.0, 0.0)) - metaballField(hit_local_position - vec3(u_normal_epsilon, 0.0, 0.0)),
        metaballField(hit_local_position + vec3(0.0, u_normal_epsilon, 0.0)) - metaballField(hit_local_position - vec3(0.0, u_normal_epsilon, 0.0)),
        metaballField(hit_local_position + vec3(0.0, 0.0, u_normal_epsilon)) - metaballField(hit_local_position - vec3(0.0, 0.0, u_normal_epsilon))
    );
    vec3 local_normal = normalize(-gradient);

    vec3 world_position = u_effect_position + u_effect_scale * hit_local_position;

    vec3 view_position = (viewMatrix * vec4(world_position, 1.0)).xyz;
    vec3 normal = normalize(mat3(viewMatrix) * local_normal);

    if (u_bump_enabled > 0.5) {
        vec3 bump = bumpOffset(world_position, 3.5);
        vec3 bump_coordinate_2 = world_position * 8.5;
        vec3 bump_2 = vec3(
            simplexNoise(bump_coordinate_2 + vec3(0.0, 0.0, 2.3)),
            simplexNoise(bump_coordinate_2 + vec3(2.1, 0.0, 0.0)),
            simplexNoise(bump_coordinate_2 + vec3(0.0, 3.7, 0.0))
        );
        normal = normalize(normal + bump * 0.20 + bump_2 * 0.10);
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
