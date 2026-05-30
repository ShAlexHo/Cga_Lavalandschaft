uniform float u_time;
uniform float u_displacement;

varying vec3 v_normal;
varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 world_pos = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 noise_coord = world_pos * 1.1 + vec3(0.0, -u_time * 0.12, u_time * 0.05);
    float n = fractal_brownian_motion(noise_coord) * 0.5 + 0.5;
    vec3 warped = noise_coord + 0.7 * vec3(
        simplex_noise(noise_coord + vec3(1.7, 9.2, 0.0)),
        simplex_noise(noise_coord + vec3(8.3, 2.8, 0.0)),
        simplex_noise(noise_coord + vec3(0.0, 5.1, 3.4))
    );
    float n2 = fractal_brownian_motion(warped) * 0.5 + 0.5;
    float crust_mask = 1.0 - smoothstep(0.15, 0.65, mix(n, n2, 0.5));

    vec3 disp_coord = world_pos * 0.7 + vec3(u_time * 0.006, -u_time * 0.009, u_time * 0.004);
    float disp = fractal_brownian_motion(disp_coord) * 0.5 + 0.5;
    vec3 displaced = position + normal * disp * u_displacement * crust_mask;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
