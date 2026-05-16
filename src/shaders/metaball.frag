uniform vec3  u_light_position;
uniform vec3  u_color_hot;
uniform vec3  u_color_cool;
uniform float u_time;
uniform float u_glow_enabled;
uniform vec3  u_glow_color;

varying vec3 v_normal;
varying vec3 v_view_position;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    vec3 light_dir = normalize(u_light_position - v_view_position);
    vec3 view_dir = normalize(-v_view_position);
    vec3 halfway_dir = normalize(light_dir + view_dir);

    float diffuse  = max(dot(normal, light_dir), 0.0);
    float specular = pow(max(dot(normal, halfway_dir), 0.0), 64.0);

    float rim = pow(1.0 - max(dot(view_dir, normal), 0.0), 7.0);

    float fast_pulse = 0.5 + 0.5 * sin(u_time * 2.0);
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.6 + 1.3);
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);

    vec3 color = mix(u_color_cool, u_color_hot, clamp(diffuse * 0.85 + 0.25, 0.0, 1.0));
    color += vec3(1.0, 0.5, 0.4) * specular;
    color += glow_color * rim * (0.20 + 0.30 * slow_pulse) * u_glow_enabled;

    gl_FragColor = vec4(color, 1.0);
}
