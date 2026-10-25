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
    vec2 delta_uv = (v_uv - u_light_uv) * (u_density / float(NUM_SAMPLES));
    vec2 sample_position = v_uv;
    float illumination_decay = 1.0;
    vec3 color = vec3(0.0);

    for (int i = 0; i < NUM_SAMPLES; i++) {
        sample_position -= delta_uv;
        color += texture2D(u_occlusion, sample_position).rgb * illumination_decay * u_weight;
        illumination_decay *= u_decay;
    }

    // corrects for the viewport's aspect ratio, or the streaks/gap below render as an ellipse
    vec2 to_fragment = v_uv - u_light_uv;
    to_fragment.x *= u_aspect;

    // fixed angular pattern fakes irregular partial occlusion, so this reads as rays, not a flat gradient
    float angle = atan(to_fragment.y, to_fragment.x);
    float streaks = 0.5 + 0.5 * sin(angle * 22.0 + sin(angle * 6.0) * 2.5);
    streaks = mix(0.35, 1.0, streaks);

    // gap before the glow ramps in, so this doesn't read as a second blob next to the sun's own disc
    float near_light_fade = smoothstep(0.05, 0.11, length(to_fragment));
    gl_FragColor = vec4(color * u_exposure * u_visibility * near_light_fade * streaks, 1.0);
}
