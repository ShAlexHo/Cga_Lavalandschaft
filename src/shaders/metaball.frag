uniform vec3  u_light_position;
uniform vec3  u_color_hot;
uniform vec3  u_color_cool;
uniform float u_time;
uniform float u_glow_enabled;
uniform vec3  u_glow_color;
uniform float u_noise_enabled;
uniform vec3  u_noise_color_1;
uniform vec3  u_noise_color_2;

varying vec3 v_normal;
varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    vec3 light_dir = normalize(u_light_position - v_view_position);
    vec3 view_dir = normalize(-v_view_position);
    vec3 halfway_dir = normalize(light_dir + view_dir);

    float diffuse  = max(dot(normal, light_dir), 0.0);
    float specular = pow(max(dot(normal, halfway_dir), 0.0), 64.0);
    float rim = pow(1.0 - max(dot(view_dir, normal), 0.0), 7.0);

    float fast_pulse = 0.5 + 0.5 * sin(u_time * 2.0);
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.6 + 1.3);
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);

    float heat;
    if (u_noise_enabled > 0.5) {
        vec3 noise_coord = v_world_position * 1.1 + vec3(0.0, -u_time * 0.12, u_time * 0.05);
        float n = fractal_brownian_motion(noise_coord) * 0.5 + 0.5;

        vec3 warped = noise_coord + 0.7 * vec3(
            simplex_noise(noise_coord + vec3(1.7, 9.2, 0.0)),
            simplex_noise(noise_coord + vec3(8.3, 2.8, 0.0)),
            simplex_noise(noise_coord + vec3(0.0, 5.1, 3.4))
        );
        float n2 = fractal_brownian_motion(warped) * 0.5 + 0.5;
        // smoothstep for sharp crust/glow contrast
        heat = smoothstep(0.20, 0.78, mix(n, n2, 0.5));
    } else {
        heat = clamp(diffuse * 0.85 + 0.25, 0.0, 1.0);
    }

    vec3 base_dark = (u_noise_enabled > 0.5) ? u_noise_color_1 : u_color_cool;
    vec3 color = mix(base_dark, u_color_hot, heat);

    if (u_noise_enabled > 0.5) {
        // second noise layer at different scale/speed for orange hot spots
        vec3 orange_coord = v_world_position * 1.8 + vec3(u_time * 0.07, -u_time * 0.18, 0.0);
        float orange_n = fractal_brownian_motion(orange_coord) * 0.5 + 0.5;
        float orange_mask = smoothstep(0.6, 0.85, orange_n);
        color = mix(color, u_noise_color_2, orange_mask * 0.75);
    }

    color += vec3(1.0, 0.5, 0.4) * specular;
    color += glow_color * rim * (0.20 + 0.30 * slow_pulse) * u_glow_enabled;

    gl_FragColor = vec4(color, 1.0);
}
