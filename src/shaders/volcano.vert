uniform float u_disp_scale;
uniform float u_disp_freq;
uniform float u_macro_scale;
uniform float u_macro_freq;

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

// Low-frequency fbm driving the large-scale ridges/bumps of the flanks
// (as opposed to crack_noise, which only textures fine surface detail).
float macro_noise(vec3 pos, float freq) {
    float v = 0.0, a = 1.0, w = 0.0;
    for (int i = 0; i < 4; i++) {
        v += simplex_noise(pos * freq) * a;
        w += a;
        pos  *= 2.0;
        a    *= 0.5;
    }
    return v / w;
}

// local_height is the un-displaced model-space y, used to fade the structural
// displacement out near the summit/crater and the base ring so the volcano's
// overall silhouette and height stay intact regardless of macro strength.
float total_displacement(vec3 world_pos, float local_height) {
    float crack = -max(0.0, 0.85 - crack_noise(world_pos, u_disp_freq)) * u_disp_scale;

    float apex_fade = 1.0 - smoothstep(4.0, 5.0, local_height);
    float base_fade = smoothstep(0.0, 0.6, local_height);
    float structure = macro_noise(world_pos, u_macro_freq) * u_macro_scale * apex_fade * base_fade;

    return crack + structure;
}

void main() {
    vec3 world_pos    = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 world_normal = normalize(mat3(modelMatrix) * normal);

    // Recompute the normal from the displaced surface via finite differences,
    // otherwise lighting keeps using the flat, un-displaced normals and the
    // stronger macro relief would look wrong.
    vec3 tangent_dir   = normalize(cross(abs(world_normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0), world_normal));
    vec3 bitangent_dir = cross(world_normal, tangent_dir);
    float eps = 0.08;

    float disp_c = total_displacement(world_pos, position.y);
    float disp_t = total_displacement(world_pos + tangent_dir   * eps, position.y);
    float disp_b = total_displacement(world_pos + bitangent_dir * eps, position.y);

    vec3 p0 = world_pos                       + world_normal * disp_c;
    vec3 p1 = world_pos + tangent_dir   * eps + world_normal * disp_t;
    vec3 p2 = world_pos + bitangent_dir * eps + world_normal * disp_b;

    vec3 displaced_normal = normalize(cross(p1 - p0, p2 - p0));
    if (dot(displaced_normal, world_normal) < 0.0) displaced_normal = -displaced_normal;

    v_world_position = p0;
    vec4 view_pos = viewMatrix * vec4(p0, 1.0);
    v_view_position = view_pos.xyz;
    v_normal = normalize(mat3(viewMatrix) * displaced_normal);
    gl_Position = projectionMatrix * view_pos;
}
