varying vec3 v_normal;
varying vec3 v_view_position;

void main() {
    vec4 view_position = modelViewMatrix * vec4(position, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
