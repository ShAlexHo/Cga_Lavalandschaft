uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3;
uniform float u_ember_glow_strength;

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_mult;
varying float v_shape_seed;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float distance_from_center = length(centered);

    float shape_noise = simplex_noise(vec3(centered * 3.0, v_shape_seed * 13.0));
    float warped_radius = distance_from_center + shape_noise * 0.05;

    float mask = smoothstep(0.5, 0.05, warped_radius);
    vec3 color = mix(u_color_1, u_color_2, v_color_mix);
    color = mix(color, u_color_3, v_accent_mix);
    color += u_color_3 * u_ember_glow_strength * v_glow_mult * v_accent_mix;
    gl_FragColor = vec4(color, v_opacity * mask);
}
