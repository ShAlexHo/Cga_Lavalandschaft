attribute float a_burst_index;
attribute vec4  a_seed;
attribute float a_phase_offset;

uniform float u_size;
uniform float u_spread_radius;
uniform float u_initial_spread_fraction;
uniform float u_rise_speed;
uniform float u_particle_lifetime;
uniform float u_haze_growth_duration;
uniform float u_haze_max_opacity;
uniform float u_rise_boost_duration;
uniform float u_max_rise_boost;
uniform float u_ember_radius_fraction;
uniform float u_grey_variance_min;
uniform vec3  u_burst_positions[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_bloom[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_fade[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_elapsed[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_ember_strength[INTERACTION_SMOKE_MAX_BURSTS];

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_multiplier;
varying float v_shape_seed;
varying vec3  v_view_position;

void main() {
    float angle_seed = a_seed.x;
    float radius_seed = a_seed.y;
    float rise_seed = a_seed.z;
    float shape_seed = a_seed.w;

    int burst_index = int(a_burst_index);
    vec3 origin = u_burst_positions[burst_index];
    float bloom = u_burst_bloom[burst_index];
    float fade = u_burst_fade[burst_index];
    float elapsed = u_burst_elapsed[burst_index];
    float ember_strength = u_burst_ember_strength[burst_index];

    float cycle_time = mod(elapsed + a_phase_offset, u_particle_lifetime);
    float local_progress = cycle_time / u_particle_lifetime;

    float angle = angle_seed + cycle_time * 0.8;
    float radius = radius_seed * u_spread_radius * mix(u_initial_spread_fraction, 1.0, local_progress);
    float rise_boost = mix(1.0, u_max_rise_boost, clamp(elapsed / u_rise_boost_duration, 0.0, 1.0));
    float rise = rise_seed * u_rise_speed * cycle_time * rise_boost;
    vec3 world_position = origin + vec3(radius * cos(angle), rise, radius * sin(angle));

    float puff_opacity = smoothstep(0.0, 0.15, local_progress) * (1.0 - smoothstep(0.6, 1.0, local_progress));

    float radial_color = smoothstep(0.0, u_ember_radius_fraction, local_progress);
    float base_color_mix = clamp(max(bloom, radial_color), 0.0, 1.0);
    float grey_ceiling = mix(u_grey_variance_min, 1.0, shape_seed);
    v_color_mix = min(base_color_mix, grey_ceiling);
    v_accent_mix = (1.0 - v_color_mix) * mix(1.0, 0.4, shape_seed) * ember_strength;
    v_glow_multiplier = 1.0;
    v_shape_seed = shape_seed;

    float haze_growth = clamp(elapsed / u_haze_growth_duration, 0.0, 1.0);
    float is_grey_leaning = smoothstep(0.4, 0.6, v_color_mix);
    float haze_opacity = haze_growth * u_haze_max_opacity * is_grey_leaning;
    v_opacity = max(puff_opacity, haze_opacity) * fade;

    vec4 view_position = modelViewMatrix * vec4(world_position, 1.0);
    v_view_position = view_position.xyz;
    gl_PointSize = clamp(u_size * pointSizeAttenuation(view_position.xyz), 1.0, 150.0);
    gl_Position = projectionMatrix * view_position;
}
