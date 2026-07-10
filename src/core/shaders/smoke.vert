attribute float a_opacity;
attribute float a_color_mix;
attribute float a_accent_mix;
attribute float a_glow_mult;
attribute float a_size_mult;
attribute float a_shape_seed;

uniform float u_size;

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_mult;
varying float v_shape_seed;

void main() {
    vec4 view_position = modelViewMatrix * vec4(position, 1.0);
    v_opacity = a_opacity;
    v_color_mix = a_color_mix;
    v_accent_mix = a_accent_mix;
    v_glow_mult = a_glow_mult;
    v_shape_seed = a_shape_seed;
    
    const float REFERENCE_DISTANCE = 10.0;
    float attenuation = REFERENCE_DISTANCE / max(-view_position.z, 0.001);
    gl_PointSize = clamp(u_size * a_size_mult * attenuation, 1.0, 150.0);
    gl_Position = projectionMatrix * view_position;
}
