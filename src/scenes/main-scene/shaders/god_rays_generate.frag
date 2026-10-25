uniform sampler2D u_occlusion;
uniform vec2 u_light_uv;
uniform float u_exposure;
uniform float u_decay;
uniform float u_density;
uniform float u_weight;
uniform float u_visibility;
uniform float u_aspect;
varying vec2 v_uv;

void main() {
    vec2 delta_uv = (v_uv - u_light_uv) * (u_density / float(GOD_RAYS_SAMPLE_COUNT));
    vec2 sample_position = v_uv;
    float illumination_decay = 1.0;
    vec3 color = vec3(0.0);

    for (int i = 0; i < GOD_RAYS_SAMPLE_COUNT; i++) {
        sample_position -= delta_uv;
        color += texture2D(u_occlusion, sample_position).rgb * illumination_decay * u_weight;
        illumination_decay *= u_decay;
    }

    vec2 aspect_corrected_to_fragment = v_uv - u_light_uv;
    aspect_corrected_to_fragment.x *= u_aspect;

    float angle = atan(aspect_corrected_to_fragment.y, aspect_corrected_to_fragment.x);
    float streaks = 0.5 + 0.5 * sin(angle * 22.0 + sin(angle * 6.0) * 2.5);
    streaks = mix(0.35, 1.0, streaks);

    float near_light_fade = smoothstep(0.05, 0.11, length(aspect_corrected_to_fragment));
    gl_FragColor = vec4(color * u_exposure * u_visibility * near_light_fade * streaks, 1.0);
}
