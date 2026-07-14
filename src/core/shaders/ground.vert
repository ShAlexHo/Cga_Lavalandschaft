uniform float u_displacement_scale;
uniform float u_displacement_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    // Symmetric around zero (unlike the volcano's one-sided crack dents), so the ground's average
    // height stays put while the surface itself becomes uneven.
    float bump = warpedFractalBrownianMotion(position * u_displacement_frequency, 0.6) * 2.0 - 1.0;
    vec3 displaced = position + normal * bump * u_displacement_scale;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
