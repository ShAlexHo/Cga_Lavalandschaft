uniform float u_time;
uniform float u_displacement;

varying vec3 v_normal;
varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 world_position = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 noise_coordinate = world_position * 1.1 + vec3(0.0, -u_time * 0.12, u_time * 0.05);
    float base_noise = normalizedFractalBrownianMotion(noise_coordinate);
    float warped_noise = warpedFractalBrownianMotion(noise_coordinate, 0.7);
    float crust_mask = 1.0 - smoothstep(0.15, 0.65, mix(base_noise, warped_noise, 0.5));

    vec3 displacement_coordinate = world_position * 0.7 + vec3(u_time * 0.006, -u_time * 0.009, u_time * 0.004);
    float displacement = normalizedFractalBrownianMotion(displacement_coordinate);
    vec3 displaced = position + normal * displacement * u_displacement * crust_mask;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
