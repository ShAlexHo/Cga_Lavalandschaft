uniform float u_displacement_scale;
uniform float u_displacement_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 world_position = (modelMatrix * vec4(position, 1.0)).xyz;

    float displacement = -max(0.0, 0.85 - crackDisplacementNoise(world_position, u_displacement_frequency));
    vec3 displaced = position + normal * displacement * u_displacement_scale;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
