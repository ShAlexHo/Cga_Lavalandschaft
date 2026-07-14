uniform vec3  u_light_position;
uniform vec3  u_sun_position;
uniform vec3  u_sun_color;
uniform float u_sun_enabled;
uniform float u_sun_strength;
uniform float u_sun_focus;
uniform float u_crack_freq;
uniform vec3  u_rock_color;
uniform vec3  u_crack_color;
uniform vec3  u_crack_color_2;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 N = normalize(v_normal);
    if (!gl_FrontFacing) N = -N;

    vec3 view_dir = normalize(-v_view_position);
    vec3 sun_dir  = normalize(u_sun_position - v_view_position);

    float diffuse = max(dot(N, normalize(u_light_position - v_view_position)), 0.0);

    // Soft wash across the whole sun-facing side, boosted by a rim/fresnel highlight right
    // at the silhouette - reads as "this side is lit by the sun", with the grazing edge
    // popping brighter like a sunset rim light, instead of either a flat wash alone or an
    // easy-to-miss thin edge line alone.
    float sun_facing = max(dot(N, sun_dir), 0.0);
    float sun_wash = pow(sun_facing, 1.5) * 0.4;
    float sun_rim = pow(1.0 - max(dot(N, view_dir), 0.0), u_sun_focus) * sun_facing;
    float sun_diffuse = sun_wash + sun_rim;

    float ash_var  = normalized_fractal_brownian_motion(v_world_position * 2.5);
    vec3 ash_color = mix(vec3(0.0), u_rock_color, ash_var * 0.15);

    float n0 = crack_pattern(v_world_position, u_crack_freq, 0.18);
    float crack_mask = smoothstep(0.0, 0.18, n0);
    vec3 crack_color = blend_crack_colors(u_crack_color, u_crack_color_2, v_world_position);
    vec3 color = mix(crack_color, ash_color, crack_mask);

    vec3 halfway_dir = normalize(normalize(u_light_position - v_view_position) + view_dir);
    float specular   = pow(max(dot(halfway_dir, N), 0.0), 32.0) * 0.01;

    color = color * (0.005 + diffuse * 0.50) + vec3(specular);
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;

    gl_FragColor = vec4(color, 1.0);
}
