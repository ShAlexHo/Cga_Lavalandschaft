out vec3 v_local_position;

void main() {
    v_local_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
