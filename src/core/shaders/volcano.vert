uniform float u_displacement_scale;
uniform float u_displacement_frequency;
uniform vec3  u_interaction_positions[INTERACTION_MAX_POINTS];
uniform float u_interaction_strengths[INTERACTION_MAX_POINTS];
uniform float u_interaction_radii[INTERACTION_MAX_POINTS];
uniform float u_interaction_plateau_fraction;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 world_position = (modelMatrix * vec4(position, 1.0)).xyz;

    float displacement = -max(0.0, 0.85 - crackDisplacementNoise(world_position, u_displacement_frequency));
    vec3 displaced = position + normal * displacement * u_displacement_scale;
    vec3 crack_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;

    // Flat plateau, then falls off - a stamped-circle look rather than a soft dome.
    float push_amount = 0.0;
    for (int i = 0; i < INTERACTION_MAX_POINTS; i++) {
        float point_distance = length(crack_world_position - u_interaction_positions[i]);
        float plateau_edge = u_interaction_radii[i] * u_interaction_plateau_fraction;
        float falloff = 1.0 - smoothstep(plateau_edge, u_interaction_radii[i], point_distance);
        push_amount = max(push_amount, u_interaction_strengths[i] * falloff);
    }
    vec3 push_direction = normalize(cameraPosition - crack_world_position);
    vec3 final_world_position = crack_world_position + push_direction * push_amount;

    v_world_position = final_world_position;
    vec4 view_position = viewMatrix * vec4(final_world_position, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
