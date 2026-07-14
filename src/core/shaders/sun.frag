uniform vec3  u_color_core;
uniform vec3  u_color_edge;
uniform vec3  u_color_blood_orange;
uniform float u_time;

varying vec3 v_normal;
varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 view_direction = normalize(-v_view_position);

    // Layered, animated turbulence (same recipe as the lava crust, via normalizedFractalBrownianMotion/
    // warpedFractalBrownianMotion in noise.glsl) instead of a flat single color, so the disc reads as a
    // churning plasma surface.
    vec3 noise_coordinate = v_world_position * 0.4 + vec3(u_time * 0.05, -u_time * 0.08, u_time * 0.03);
    float base_noise = normalizedFractalBrownianMotion(noise_coordinate);
    float warped_noise = warpedFractalBrownianMotion(noise_coordinate, 0.7);
    float turbulence = smoothstep(0.3, 0.7, mix(base_noise, warped_noise, 0.5));

    vec3 color = mix(u_color_edge, u_color_core, turbulence);

    // Second, independently-animated noise layer (different scale/speed/offset) for
    // extra blood-orange patches on top of the base blend, so the surface reads as
    // several overlapping layers of turbulence instead of one single pattern.
    vec3 orange_coordinate = v_world_position * 0.7 + vec3(-u_time * 0.06, u_time * 0.09, u_time * 0.04);
    float orange_noise = normalizedFractalBrownianMotion(orange_coordinate);
    float orange_mask = smoothstep(0.55, 0.85, orange_noise);
    color = mix(color, u_color_blood_orange, orange_mask * 0.5);

    // Pulsing corona: brightens the grazing edge so the disc has a glowing rim instead
    // of a hard silhouette.
    float pulse = 0.5 + 0.5 * sin(u_time * 1.4);
    float rim = pow(1.0 - max(dot(view_direction, normal), 0.0), 2.5);
    color += u_color_core * rim * (0.5 + 0.5 * pulse);

    gl_FragColor = vec4(color, 1.0);
}
