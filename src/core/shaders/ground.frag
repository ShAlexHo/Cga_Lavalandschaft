uniform vec3  u_light_position;
uniform float u_crack_freq;
uniform float u_crack_softness;
uniform vec3  u_rock_color;
uniform vec3  u_crack_color;
uniform vec3  u_crack_color_2;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 N = normalize(v_normal);
    if (!gl_FrontFacing) N = -N;

    // Perturb the otherwise-flat shading normal, so the displaced terrain's bumps actually show under lighting.
    vec3 bump = vec3(
        simplex_noise(v_world_position * 3.0 + vec3(0.0, 0.0, 1.7)),
        simplex_noise(v_world_position * 3.0 + vec3(1.3, 0.0, 0.0)),
        simplex_noise(v_world_position * 3.0 + vec3(0.0, 2.1, 0.0))
    );
    N = normalize(N + bump * 0.35);

    vec3 view_dir = normalize(-v_view_position);
    float diffuse = max(dot(N, normalize(u_light_position - v_view_position)), 0.0);

    float color_var = normalized_fractal_brownian_motion(v_world_position * 1.5);
    vec3 varied_color = mix(u_rock_color * 0.6, u_rock_color, color_var);

    float crack_mask = smoothstep(0.0, 0.75, crack_pattern(v_world_position, u_crack_freq, u_crack_softness));
    vec3 crack_color = blend_crack_colors(u_crack_color, u_crack_color_2, v_world_position);
    vec3 color = mix(crack_color, varied_color, crack_mask);

    // Barely-there specular - it's ground, not polished rock, so only the faintest highlight should show.
    vec3 halfway_dir = normalize(normalize(u_light_position - v_view_position) + view_dir);
    float specular = pow(max(dot(halfway_dir, N), 0.0), 24.0) * 0.002;

    // Ambient term matching the scene's AmbientLight (main.js) - not self-emission, just the same
    // ambient fill every other lit object gets, without which the ground reads as near-black.
    color = color * (1.0 + diffuse * 0.55) + vec3(specular);

    gl_FragColor = vec4(color, 1.0);
}
