uniform vec3  u_light_position;
uniform vec3  u_sun_position;
uniform vec3  u_sun_color;
uniform float u_sun_enabled;
uniform float u_sun_strength;
uniform float u_sun_focus;
uniform float u_crack_frequency;
uniform vec3  u_rock_color;
uniform vec3  u_crack_color;
uniform vec3  u_crack_color_2;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    vec3 view_direction = normalize(-v_view_position);
    vec3 sun_direction  = normalize(u_sun_position - v_view_position);

    float diffuse = max(dot(normal, normalize(u_light_position - v_view_position)), 0.0);

    float sun_diffuse = sunDiffuseTerm(normal, view_direction, sun_direction, u_sun_focus);

    float ash_var  = normalizedFractalBrownianMotion(v_world_position * 2.5);
    vec3 ash_color = mix(vec3(0.0), u_rock_color, ash_var * 0.15);

    float crack_mask = crackPattern(v_world_position, u_crack_frequency, 0.05);
    vec3 crack_color = blendCrackColors(u_crack_color, u_crack_color_2, v_world_position);
    vec3 color = mix(crack_color, ash_color, crack_mask);

    vec3 halfway_direction = normalize(normalize(u_light_position - v_view_position) + view_direction);
    float specular   = pow(max(dot(halfway_direction, normal), 0.0), 32.0) * 0.01;

    color = color * (0.005 + diffuse * 0.50) + vec3(specular);
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;

    gl_FragColor = vec4(color, 1.0);
}
