#define MAX_BALLS 24

// three.js only auto-declares viewMatrix/cameraPosition in fragment shaders (modelMatrix and
// projectionMatrix are vertex-only built-ins) - redeclared here so the renderer still finds and
// binds them by name for this stage.
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

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
uniform float u_isolation;
uniform mat4  u_inverse_model_matrix;
uniform int   u_ball_count;
uniform vec3  u_ball_position[MAX_BALLS];
uniform float u_ball_strength[MAX_BALLS];
uniform float u_ball_subtract[MAX_BALLS];
uniform float u_ball_radius2[MAX_BALLS];

varying vec3 v_world_position;

out vec4 out_color;

// Sum of the balls' inverse-square-falloff potentials (matches three.js MarchingCubes.addBall's
// field function) minus the isolation threshold - positive inside the blob. `position` is in the
// effect mesh's own local space, matching u_ball_position (see metaball_material.js for the
// field-space -> local-space remap and the strength x4 compensation).
float metaballPotential(vec3 position) {
    float total = 0.0;
    for (int i = 0; i < MAX_BALLS; i++) {
        if (i >= u_ball_count) break;
        vec3 delta = position - u_ball_position[i];
        float dist_sq = dot(delta, delta);
        // Cheap reject before the division below - outside its own radius (radius^2 =
        // strength/subtract) a ball contributes exactly 0 anyway.
        if (dist_sq >= u_ball_radius2[i]) continue;
        total += u_ball_strength[i] / (0.0001 + dist_sq) - u_ball_subtract[i];
    }
    return total - u_isolation;
}

// Gradient of metaballPotential points inward (toward denser ball centers); negate for an
// outward-facing surface normal.
vec3 metaballNormal(vec3 position) {
    const float EPSILON = 0.01;
    vec2 e = vec2(EPSILON, 0.0);
    vec3 gradient = vec3(
        metaballPotential(position + e.xyy) - metaballPotential(position - e.xyy),
        metaballPotential(position + e.yxy) - metaballPotential(position - e.yxy),
        metaballPotential(position + e.yyx) - metaballPotential(position - e.yyx)
    );
    return normalize(-gradient);
}

void main() {
    vec3 ray_origin = (u_inverse_model_matrix * vec4(cameraPosition, 1.0)).xyz;
    vec3 ray_through = (u_inverse_model_matrix * vec4(v_world_position, 1.0)).xyz;
    vec3 ray_direction = normalize(ray_through - ray_origin);

    // Analytic ray/bounding-sphere hit (sphere at the local origin, same radius the effect mesh's
    // geometry is built from) so marching starts exactly at the sphere surface - or at the camera,
    // if it's already inside - instead of wasting steps outside the effect entirely.
    const float BOUNDING_RADIUS = 1.2;
    float b = dot(ray_origin, ray_direction);
    float c = dot(ray_origin, ray_origin) - BOUNDING_RADIUS * BOUNDING_RADIUS;
    float discriminant = b * b - c;
    if (discriminant < 0.0) discard;
    float sqrt_discriminant = sqrt(discriminant);
    float t_near = max(-b - sqrt_discriminant, 0.0);
    float t_far = -b + sqrt_discriminant;
    if (t_far <= t_near) discard;

    const int STEPS = 64;
    float step_size = (t_far - t_near) / float(STEPS);
    float previous_t = t_near;
    float previous_value = metaballPotential(ray_origin + ray_direction * t_near);
    float hit_t = -1.0;

    for (int i = 1; i <= STEPS; i++) {
        float t = t_near + float(i) * step_size;
        float value = metaballPotential(ray_origin + ray_direction * t);
        if (value >= 0.0 && previous_value < 0.0) {
            hit_t = t;
            break;
        }
        previous_t = t;
        previous_value = value;
    }

    if (hit_t < 0.0) discard;

    // Bisect between the last two samples to refine the crossing point.
    float lo = previous_t;
    float hi = hit_t;
    for (int i = 0; i < 5; i++) {
        float mid = 0.5 * (lo + hi);
        if (metaballPotential(ray_origin + ray_direction * mid) >= 0.0) hi = mid; else lo = mid;
    }

    vec3 hit_local = ray_origin + ray_direction * hi;
    vec3 world_position = (modelMatrix * vec4(hit_local, 1.0)).xyz;
    vec4 clip_position = projectionMatrix * viewMatrix * vec4(world_position, 1.0);
    gl_FragDepth = (clip_position.z / clip_position.w) * 0.5 + 0.5;

    vec3 normal = normalize((modelMatrix * vec4(metaballNormal(hit_local), 0.0)).xyz);
    vec3 view_position = (viewMatrix * vec4(world_position, 1.0)).xyz;

    if (u_bump_enabled > 0.5) {
        vec3 bump = bumpOffset(world_position, 3.5);
        vec3 bump_coordinate_2 = world_position * 8.5;
        vec3 bump2 = vec3(
            simplexNoise(bump_coordinate_2 + vec3(0.0, 0.0, 2.3)),
            simplexNoise(bump_coordinate_2 + vec3(2.1, 0.0, 0.0)),
            simplexNoise(bump_coordinate_2 + vec3(0.0, 3.7, 0.0))
        );
        // u_displacement no longer physically displaces the (raymarched) surface - folded into the
        // bump strength instead, so the GUI control still visibly roughens the crust.
        float displacement_bump = u_displacement * 4000.0;
        normal = normalize(normal + bump * (0.20 + displacement_bump) + bump2 * (0.10 + displacement_bump * 0.5));
    }

    vec3 light_direction = normalize(u_light_position - view_position);
    vec3 view_direction = normalize(-view_position);
    vec3 halfway_direction = normalize(light_direction + view_direction);

    float diffuse  = max(dot(normal, light_direction), 0.0);
    float specular = pow(max(dot(normal, halfway_direction), 0.0), 8.0);

    float fast_pulse = 0.5 + 0.5 * sin(u_time * 2.0);
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.6 + 1.3);
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);

    float heat;
    if (u_noise_enabled > 0.5) {
        vec3 noise_coordinate = world_position * 0.7 + vec3(0.0, -u_time * 0.12, u_time * 0.05);
        float base_noise = normalizedFractalBrownianMotion(noise_coordinate);
        float warped_noise = warpedFractalBrownianMotion(noise_coordinate, 0.4);
        // smoothstep for sharp crust/glow contrast
        heat = smoothstep(0.15, 0.65, mix(base_noise, warped_noise, 0.5));
    } else {
        heat = clamp(diffuse * 0.85 + 0.25, 0.0, 1.0);
    }

    vec3 base_dark = (u_noise_enabled > 0.5) ? mix(u_color_cool, u_noise_color_1, 0.6) : u_color_cool;
    vec3 color = mix(base_dark, u_color_hot, heat);

    if (u_noise_enabled > 0.5) {
        // second noise layer at different scale/speed for orange hot spots
        vec3 orange_coordinate = world_position * 1.2 + vec3(u_time * 0.07, -u_time * 0.18, 0.0);
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

    out_color = vec4(color, 1.0);
}
