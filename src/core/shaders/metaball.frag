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

varying vec3 v_normal;
varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    if (u_bump_enabled > 0.5) {
        vec3 bump_coord = v_world_position * 3.5;
        vec3 bump = vec3(
            simplex_noise(bump_coord + vec3(0.0, 0.0, 1.7)),
            simplex_noise(bump_coord + vec3(1.3, 0.0, 0.0)),
            simplex_noise(bump_coord + vec3(0.0, 2.1, 0.0))
        );
        vec3 bump_coord2 = v_world_position * 8.5;
        vec3 bump2 = vec3(
            simplex_noise(bump_coord2 + vec3(0.0, 0.0, 2.3)),
            simplex_noise(bump_coord2 + vec3(2.1, 0.0, 0.0)),
            simplex_noise(bump_coord2 + vec3(0.0, 3.7, 0.0))
        );
        normal = normalize(normal + bump * 0.20 + bump2 * 0.10);
    }

    vec3 light_dir = normalize(u_light_position - v_view_position);
    vec3 view_dir = normalize(-v_view_position);
    vec3 halfway_dir = normalize(light_dir + view_dir);

    float diffuse  = max(dot(normal, light_dir), 0.0);
    float specular = pow(max(dot(normal, halfway_dir), 0.0), 8.0);
    float rim = pow(1.0 - max(dot(view_dir, normal), 0.0), 7.0);

    float fast_pulse = 0.5 + 0.5 * sin(u_time * 2.0);
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.6 + 1.3);
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);

    float heat;
    if (u_noise_enabled > 0.5) {
        vec3 noise_coord = v_world_position * 0.7 + vec3(0.0, -u_time * 0.12, u_time * 0.05);
        float n = normalized_fractal_brownian_motion(noise_coord);
        float n2 = warped_fractal_brownian_motion(noise_coord, 0.4);
        // smoothstep for sharp crust/glow contrast
        heat = smoothstep(0.15, 0.65, mix(n, n2, 0.5));
    } else {
        heat = clamp(diffuse * 0.85 + 0.25, 0.0, 1.0);
    }

    vec3 base_dark = (u_noise_enabled > 0.5) ? mix(u_color_cool, u_noise_color_1, 0.6) : u_color_cool;
    vec3 color = mix(base_dark, u_color_hot, heat);

    if (u_noise_enabled > 0.5) {
        // second noise layer at different scale/speed for orange hot spots
        vec3 orange_coord = v_world_position * 1.2 + vec3(u_time * 0.07, -u_time * 0.18, 0.0);
        float orange_n = normalized_fractal_brownian_motion(orange_coord);
        float orange_mask = smoothstep(0.6, 0.85, orange_n);
        color = mix(color, u_noise_color_2, orange_mask * 0.40);
    }

    float self_illumination = pow(heat, 1.5) * 0.90;
    color += u_color_hot * self_illumination;

    float molten_core = pow(heat, 3.5) * 0.70;
    color += vec3(1.0, 0.75, 0.25) * molten_core;

    color += vec3(0.08, 0.04, 0.03) * specular;
    float rim_wide = pow(1.0 - max(dot(view_dir, normal), 0.0), 4.5);
    color += glow_color * rim_wide * (0.65 + 0.70 * slow_pulse) * u_glow_enabled;

    gl_FragColor = vec4(color, 1.0);
}
