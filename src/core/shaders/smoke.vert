attribute float a_is_ambient;
attribute vec4  a_motion_seed;  // base_angle, base_radius, drift_angle, lifetime_multiplier
attribute vec2  a_timing_seed;  // phase_offset, color_seed
attribute vec3  a_appearance;   // size_multiplier, glow_multiplier, shape_seed
attribute float a_accent_base;
attribute float a_ember_cooling_multiplier;
attribute vec4  a_ambient_seed; // ambient_angle, ambient_radius_seed, ambient_height_seed, ambient_opacity_seed

uniform float u_time;
uniform float u_size;
uniform float u_spread;
uniform float u_rise_speed;
uniform float u_plume_opacity_factor;
uniform float u_lifetime;
uniform float u_core_spread;
uniform float u_rise_height;
uniform float u_fade_in_end;
uniform float u_fade_out_start;
uniform float u_ambient_radius;
uniform float u_ambient_height_min;
uniform float u_ambient_height_max;
uniform float u_ambient_opacity;
uniform float u_ember_cooling_time;

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_multiplier;
varying float v_shape_seed;

void main() {
    float base_angle = a_motion_seed.x;
    float base_radius = a_motion_seed.y;
    float drift_angle = a_motion_seed.z;
    float lifetime_multiplier = a_motion_seed.w;
    float phase_offset = a_timing_seed.x;
    float color_seed = a_timing_seed.y;
    float size_multiplier = a_appearance.x;
    float glow_multiplier = a_appearance.y;
    float shape_seed = a_appearance.z;

    float lifetime = (u_lifetime * lifetime_multiplier) / u_rise_speed;
    float age_seconds = mod(u_time + phase_offset, lifetime);
    float age_fraction = age_seconds / lifetime;

    // age dominates the mix (young stays close to u_color_1); color_seed adds mottling
    float color_mix = clamp(age_fraction * 0.65 + color_seed * 0.35, 0.0, 1.0);

    // smoothstep's zero slope at the edges lets particles drift into invisibility instead of cutting off
    float fade_in = smoothstep(0.0, u_fade_in_end, age_fraction);
    float fade_out = 1.0 - smoothstep(u_fade_out_start, 1.0, age_fraction);
    float life_envelope = fade_in * fade_out;

    vec3 local_position;
    float opacity;
    float accent_mix;

    if (a_is_ambient > 0.5) {
        float ambient_angle = a_ambient_seed.x;
        float ambient_radius_seed = a_ambient_seed.y;
        float ambient_height_seed = a_ambient_seed.z;
        float ambient_opacity_seed = a_ambient_seed.w;

        float ambient_radius = ambient_radius_seed * u_ambient_radius;
        float ambient_height_range = u_ambient_height_max - u_ambient_height_min;

        local_position = vec3(
            ambient_radius * cos(ambient_angle),
            u_ambient_height_min + ambient_height_seed * ambient_height_range,
            ambient_radius * sin(ambient_angle)
        );
        opacity = life_envelope * u_ambient_opacity * ambient_opacity_seed;
        accent_mix = 0.0;
    } else {
        float rise_shape = 0.2 + 0.8 * age_fraction;

        // core_radius ignores u_spread so the center stays dense; extra_reach (cubed base_radius)
        // only pushes particles already far out
        float core_radius = base_radius * u_core_spread * rise_shape;
        float extra_reach = u_spread * pow(base_radius, 3.0) * rise_shape;
        float radius = core_radius + extra_reach;
        float angle = base_angle + drift_angle * age_fraction;

        // normalized by u_core_spread so widening the core doesn't crush opacity towards zero
        float normalized_radius = radius / u_core_spread;
        float distance_falloff = 1.0 / (1.0 + normalized_radius * normalized_radius);

        local_position = vec3(radius * cos(angle), age_fraction * u_rise_height, radius * sin(angle));
        opacity = life_envelope * distance_falloff * u_plume_opacity_factor;

        float cooling_time = u_ember_cooling_time * a_ember_cooling_multiplier;
        float ember_cooling = 1.0 - smoothstep(0.0, cooling_time, age_seconds);
        accent_mix = a_accent_base * ember_cooling;
    }

    v_opacity = opacity;
    v_color_mix = color_mix;
    v_accent_mix = accent_mix;
    v_glow_multiplier = glow_multiplier;
    v_shape_seed = shape_seed;

    vec4 view_position = modelViewMatrix * vec4(local_position, 1.0);

    gl_PointSize = clamp(u_size * size_multiplier * pointSizeAttenuation(view_position.xyz), 1.0, 150.0);
    gl_Position = projectionMatrix * view_position;
}
