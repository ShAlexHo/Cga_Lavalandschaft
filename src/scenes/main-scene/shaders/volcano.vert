uniform vec3  u_interaction_positions[INTERACTION_MAX_POINTS];
uniform float u_interaction_strengths[INTERACTION_MAX_POINTS];
uniform float u_interaction_radii[INTERACTION_MAX_POINTS];
uniform float u_interaction_decay[INTERACTION_MAX_POINTS];
uniform float u_interaction_plateau_fraction;
uniform float u_interaction_wipe_band_fraction;
uniform float u_interaction_wipe_noise_strength;
uniform float u_interaction_wipe_noise_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 crack_world_position = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 volcano_center = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    float push_amount = 0.0;
    for (int i = 0; i < INTERACTION_MAX_POINTS; i++) {
        float point_distance = length(crack_world_position - u_interaction_positions[i]);
        float radius = u_interaction_radii[i];
        float plateau_edge = radius * u_interaction_plateau_fraction;
        float falloff = 1.0 - smoothstep(plateau_edge, radius, point_distance);

        float vertex_axis_distance = length(crack_world_position.xz - volcano_center.xz);
        float touch_axis_distance = length(u_interaction_positions[i].xz - volcano_center.xz);
        float wipe_noise = simplexNoise(crack_world_position * u_interaction_wipe_noise_frequency) * radius * u_interaction_wipe_noise_strength;
        float axis_distance_beyond_touch = vertex_axis_distance - touch_axis_distance + wipe_noise;

        float wipe_band = radius * u_interaction_wipe_band_fraction;
        float wipe_threshold = mix(-radius - wipe_band, radius + wipe_band, u_interaction_decay[i]);
        float wipe_mask = smoothstep(wipe_threshold - wipe_band, wipe_threshold + wipe_band, axis_distance_beyond_touch);

        push_amount = max(push_amount, u_interaction_strengths[i] * falloff * wipe_mask);
    }
    vec3 push_direction = normalize(cameraPosition - crack_world_position);
    vec3 final_world_position = crack_world_position + push_direction * push_amount;

    v_world_position = final_world_position;
    vec4 view_position = viewMatrix * vec4(final_world_position, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
