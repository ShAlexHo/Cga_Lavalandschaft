uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3;
uniform float u_ember_glow_strength;
uniform vec3 u_sun_color;
uniform vec3 u_sun_position;
uniform float u_sun_enabled;
uniform float u_sun_strength;

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_multiplier;
varying float v_shape_seed;
varying vec3  v_view_position;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float distance_from_center = length(centered);

    // coarse noise breaks the puff into a few big billows; fine noise roughens their edges,
    // together reading as a cauliflower-like cumulus silhouette instead of a soft circle
    float billow_noise = simplexNoise(vec3(centered * 1.2, v_shape_seed * 7.0)) * 0.12;
    float edge_noise = simplexNoise(vec3(centered * 3.0, v_shape_seed * 13.0)) * 0.05;
    float warped_radius = distance_from_center + billow_noise + edge_noise;

    float mask = smoothstep(0.5, 0.05, warped_radius);
    vec3 color = mix(u_color_1, u_color_2, v_color_mix);
    color = mix(color, u_color_3, v_accent_mix);
    color += u_color_3 * u_ember_glow_strength * v_glow_multiplier * v_accent_mix;

    // a rounded pseudo-normal per puff, so the sun's actual direction gives it a lit and a
    // shadowed side instead of a flat tint - the whole plume re-shades as the sun orbits
    vec3 puff_normal = normalize(vec3(centered * 2.0, sqrt(max(1.0 - dot(centered, centered) * 4.0, 0.001))));
    vec3 sun_direction = normalize(u_sun_position - v_view_position);
    float sun_diffuse = max(dot(puff_normal, sun_direction), 0.0);
    color *= mix(0.55, 1.0, sun_diffuse);
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;

    gl_FragColor = vec4(color, v_opacity * mask);
}
