attribute float a_burst_index;
attribute vec4  a_seed; // angle, radius_seed, rise_seed, shape_seed
attribute float a_phase_offset;

uniform float u_size;
uniform float u_spread_radius;
uniform float u_initial_spread_fraction;
uniform float u_rise_speed;
uniform float u_particle_lifetime;
uniform vec3  u_burst_positions[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_bloom[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_fade[INTERACTION_SMOKE_MAX_BURSTS];
uniform float u_burst_elapsed[INTERACTION_SMOKE_MAX_BURSTS];

varying float v_opacity;
varying float v_color_mix;
varying float v_accent_mix;
varying float v_glow_mult;
varying float v_shape_seed;

void main() {
    int burst_index = int(a_burst_index);
    vec3 origin = u_burst_positions[burst_index];
    float bloom = u_burst_bloom[burst_index];
    float fade = u_burst_fade[burst_index];
    float elapsed = u_burst_elapsed[burst_index];

    // Each particle repeats its own short rise-and-fade cycle from the origin for as long as the
    // burst lives, so staying longer adds more overlapping puffs instead of one ever-growing mass.
    float has_started = step(a_phase_offset, elapsed);
    float cycle_time = mod(max(elapsed - a_phase_offset, 0.0), u_particle_lifetime);
    float local_progress = cycle_time / u_particle_lifetime;

    float angle = a_seed.x + cycle_time * 0.8;
    // Already spread out sideways at the very start of the cycle instead of converging to a point -
    // same particle count and opacity (density unchanged), just wider from the first frame onward.
    float radius = a_seed.y * u_spread_radius * mix(u_initial_spread_fraction, 1.0, local_progress);
    float rise = a_seed.z * u_rise_speed * cycle_time;
    vec3 world_position = origin + vec3(radius * cos(angle), rise, radius * sin(angle));

    float puff_opacity = smoothstep(0.0, 0.15, local_progress) * (1.0 - smoothstep(0.6, 1.0, local_progress));
    v_opacity = has_started * puff_opacity * fade;

    // color_seed (reusing the shape seed) gives each particle its own fixed spot on the light-to-dark
    // gradient, instead of every particle in the burst sharing one identical shade at any instant -
    // particles that lean darker also glow hot less, so the two stay visually consistent.
    float color_seed = a_seed.w;
    v_color_mix = clamp(bloom * 0.5 + color_seed * 0.5, 0.0, 1.0);
    v_accent_mix = (1.0 - bloom) * mix(1.0, 0.4, color_seed);
    v_glow_mult = 1.0;
    v_shape_seed = color_seed;

    vec4 view_position = modelViewMatrix * vec4(world_position, 1.0);
    const float REFERENCE_DISTANCE = 10.0;
    float attenuation = REFERENCE_DISTANCE / max(-view_position.z, 0.001);
    gl_PointSize = clamp(u_size * attenuation, 1.0, 150.0);
    gl_Position = projectionMatrix * view_position;
}
