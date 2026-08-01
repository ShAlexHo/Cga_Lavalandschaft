varying vec3 v_world_position;

void main() {
    vec4 world_position = modelMatrix * vec4(position, 1.0);
    v_world_position = world_position.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
