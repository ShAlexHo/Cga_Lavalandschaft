uniform float u_layer_y;

in vec2  v_local_xz;
in vec3  v_ball_center;
in float v_ball_strength;
in float v_ball_subtract;

out vec4 out_field;

void main() {
    vec3 offset = vec3(v_local_xz.x, u_layer_y, v_local_xz.y) - v_ball_center;
    float distance_squared = max(dot(offset, offset), 0.0001);
    float contribution = max(0.0, 4.0 * v_ball_strength / distance_squared - v_ball_subtract);
    out_field = vec4(min(contribution, METABALL_FIELD_CONTRIBUTION_LIMIT), 0.0, 0.0, 1.0);
}
