uniform float u_disp_scale;
uniform float u_disp_freq;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

float crack_layer(vec3 pos, float freq) {
    vec3 warp = vec3(
        simplex_noise(pos * freq * 0.6 + vec3(1.7, 9.2, 0.0)),
        simplex_noise(pos * freq * 0.6 + vec3(8.3, 2.8, 0.0)),
        simplex_noise(pos * freq * 0.6 + vec3(3.1, 0.0, 5.4))
    );
    float n = abs(simplex_noise((pos + warp * 1.2) * freq));
    return pow(n, 0.18);
}

float crack_noise(vec3 pos, float freq) {
    float v = 0.0, a = 1.0, w = 0.0;
    for (int i = 0; i < 3; i++) {
        v += crack_layer(pos, freq) * a;
        w += a;
        pos  *= 2.1;
        a    *= 0.45;
    }
    return v / w;
}

void main() {
    vec3 world_pos = (modelMatrix * vec4(position, 1.0)).xyz;

    float disp = crack_noise(world_pos, u_disp_freq) - 0.847;
    vec3 displaced = position + normal * disp * u_disp_scale;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_pos = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_pos.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_pos;
}
