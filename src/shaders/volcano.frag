uniform vec3  u_light_position;
uniform float u_bump_scale;
uniform float u_bump_freq;
uniform vec3  u_rock_color;
uniform vec3  u_crack_color;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

float crack_bump(vec3 pos, float freq) {
    vec3 warp = vec3(
        simplex_noise(pos * freq * 0.6 + vec3(1.7, 9.2, 0.0)),
        simplex_noise(pos * freq * 0.6 + vec3(8.3, 2.8, 0.0)),
        simplex_noise(pos * freq * 0.6 + vec3(3.1, 0.0, 5.4))
    );
    return pow(abs(simplex_noise((pos + warp * 1.2) * freq)), 0.18);
}

void main() {
    vec3 N = normalize(v_normal);
    if (!gl_FrontFacing) N = -N;

    float eps = 0.06;
    float n0  = crack_bump(v_world_position,                        u_bump_freq);
    float nx  = crack_bump(v_world_position + vec3(eps, 0.0, 0.0), u_bump_freq);
    float ny  = crack_bump(v_world_position + vec3(0.0, eps, 0.0), u_bump_freq);
    float nz  = crack_bump(v_world_position + vec3(0.0, 0.0, eps), u_bump_freq);
    vec3 grad = vec3(nx - n0, ny - n0, nz - n0) / eps;
    N = normalize(N - grad * u_bump_scale);

    float diffuse = max(dot(N, normalize(u_light_position - v_view_position)), 0.0);

    float ash_var  = fractal_brownian_motion(v_world_position * 2.5) * 0.5 + 0.5;
    vec3 ash_color = mix(vec3(0.0), u_rock_color, ash_var * 0.15);

    float crack_mask = smoothstep(0.0, 0.18, n0);
    vec3 color = mix(u_crack_color, ash_color, crack_mask);

    vec3 view_dir    = normalize(-v_view_position);
    vec3 halfway_dir = normalize(normalize(u_light_position - v_view_position) + view_dir);
    float specular   = pow(max(dot(halfway_dir, N), 0.0), 32.0) * 0.01;

    color = color * (0.005 + diffuse * 0.50) + vec3(specular);

    gl_FragColor = vec4(color, 1.0);
}
