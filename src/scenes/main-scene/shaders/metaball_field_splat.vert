in vec4 ball_center_strength;
in float ball_subtract;

uniform float u_layer_y;
uniform vec3  u_field_minimum;
uniform vec3  u_field_size;

out vec2  v_local_xz;
out vec3  v_ball_center;
out float v_ball_strength;
out float v_ball_subtract;

void main() {
    vec3 center = ball_center_strength.xyz;
    float strength = ball_center_strength.w;
    float influence_squared = ball_subtract > 0.0 ? 4.0 * strength / ball_subtract : dot(u_field_size, u_field_size);
    float layer_offset = u_layer_y - center.y;
    float footprint_squared = influence_squared - layer_offset * layer_offset;

    if (strength <= 0.0 || footprint_squared <= 0.0) {
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        return;
    }

    vec2 local_xz = center.xz + position.xy * sqrt(footprint_squared);
    vec2 texture_coordinate = (local_xz - u_field_minimum.xz) / u_field_size.xz;

    v_local_xz = local_xz;
    v_ball_center = center;
    v_ball_strength = strength;
    v_ball_subtract = ball_subtract;
    gl_Position = vec4(texture_coordinate * 2.0 - 1.0, 0.0, 1.0);
}
