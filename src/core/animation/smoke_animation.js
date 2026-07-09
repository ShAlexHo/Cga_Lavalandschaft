import { random, randomGauss } from '../rand.js';
import {
    SMOKE_MAX_PARTICLES,
    SMOKE_DEFAULT_COUNT,
    SMOKE_CORE_SPREAD,
    SMOKE_DEFAULT_SPREAD,
    SMOKE_DEFAULT_RISE_SPEED,
    SMOKE_RISE_HEIGHT,
    SMOKE_LIFETIME,
    SMOKE_SIZE_MULT_MIN,
    SMOKE_SIZE_MULT_MAX,
    SMOKE_ACCENT_THRESHOLD,
    SMOKE_ACCENT_STRENGTH,
    SMOKE_FADE_IN_END,
    SMOKE_FADE_OUT_START,
    SMOKE_AMBIENT_FRACTION,
    SMOKE_AMBIENT_RADIUS,
    SMOKE_AMBIENT_HEIGHT_MIN,
    SMOKE_AMBIENT_HEIGHT_MAX,
    SMOKE_AMBIENT_OPACITY,
} from '../config.js';

export const MAX_PARTICLES = SMOKE_MAX_PARTICLES;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

// Bell-curve size distribution, so oversized grains stay rare instead of as common as any other size.
const SIZE_MULT_MEAN = (SMOKE_SIZE_MULT_MIN + SMOKE_SIZE_MULT_MAX) / 2;
const SIZE_MULT_STD_DEV = (SMOKE_SIZE_MULT_MAX - SMOKE_SIZE_MULT_MIN) / 4;

export const settings = { count: SMOKE_DEFAULT_COUNT, spread: SMOKE_DEFAULT_SPREAD, rise_speed: SMOKE_DEFAULT_RISE_SPEED, max_count: MAX_PARTICLES };

// Half-normal magnitude, so most particles stay near the plume's axis with a shrinking tail further out.
const particle_pool = Array.from({ length: MAX_PARTICLES }, () => ({
    is_ambient: random(0, 1) < SMOKE_AMBIENT_FRACTION,
    base_angle: random(0, Math.PI * 2),
    base_radius: Math.abs(randomGauss(0, 1)),
    drift_angle: random(-Math.PI * 0.5, Math.PI * 0.5),
    lifetime_mult: random(0.75, 1.35),
    phase_offset: random(0, SMOKE_LIFETIME),
    color_seed: random(0, 1),
    size_seed: randomGauss(0, 1),
    accent_seed: random(0, 1),
    shape_seed: random(0, 1),
    // sqrt of a uniform sample gives uniform-area placement instead of clustering near the axis.
    ambient_radius_seed: Math.sqrt(random(0, 1)),
    ambient_angle: random(0, Math.PI * 2),
    ambient_height_seed: random(0, 1),
    ambient_opacity_seed: random(0.3, 1.0),
}));

// Pure function of time, so freezing `time` (see main.js) freezes the plume for free.
export function stepSmokeAnimation(time) {
    const active_count = Math.min(settings.count, MAX_PARTICLES);
    const particles = [];

    for (let i = 0; i < active_count; i++) {
        const particle = particle_pool[i];
        const lifetime = (SMOKE_LIFETIME * particle.lifetime_mult) / settings.rise_speed;
        const age_fraction = ((time + particle.phase_offset) % lifetime) / lifetime;

        // Age dominates the mix so young particles stay close to u_color_1 instead of already leaning pale.
        const color_mix = clamp(age_fraction * 0.8 + particle.color_seed * 0.2, 0, 1);

        const size_mult = clamp(SIZE_MULT_MEAN + particle.size_seed * SIZE_MULT_STD_DEV, SMOKE_SIZE_MULT_MIN, SMOKE_SIZE_MULT_MAX);

        // smoothstep's zero slope at the fade-out edges lets particles drift into invisibility instead of cutting off.
        const fade_in = smoothstep(0, SMOKE_FADE_IN_END, age_fraction);
        const fade_out = 1 - smoothstep(SMOKE_FADE_OUT_START, 1, age_fraction);
        const life_envelope = fade_in * fade_out;

        if (particle.is_ambient) {
            // Ambient ash spreads evenly across the space rather than radiating from the crater.
            const ambient_radius = particle.ambient_radius_seed * SMOKE_AMBIENT_RADIUS;
            const ambient_height_range = SMOKE_AMBIENT_HEIGHT_MAX - SMOKE_AMBIENT_HEIGHT_MIN;

            particles.push({
                x: ambient_radius * Math.cos(particle.ambient_angle),
                y: SMOKE_AMBIENT_HEIGHT_MIN + particle.ambient_height_seed * ambient_height_range,
                z: ambient_radius * Math.sin(particle.ambient_angle),
                opacity: life_envelope * SMOKE_AMBIENT_OPACITY * particle.ambient_opacity_seed,
                colorMix: color_mix,
                accentMix: 0,
                sizeMult: size_mult,
                shapeSeed: particle.shape_seed,
            });
            continue;
        }

        const rise_shape = 0.2 + 0.8 * age_fraction;

        // core_radius never depends on settings.spread, so the center stays dense; extra_reach grows with the
        // CUBE of base_radius, so only particles already far out get pushed further, widening the plume without diluting its center.
        const core_radius = particle.base_radius * SMOKE_CORE_SPREAD * rise_shape;
        const extra_reach = settings.spread * particle.base_radius ** 3 * rise_shape;
        const radius = core_radius + extra_reach;

        const angle = particle.base_angle + particle.drift_angle * age_fraction;
        // Normalized by SMOKE_CORE_SPREAD so widening the core doesn't also crush the cloud's opacity towards zero.
        const normalized_radius = radius / SMOKE_CORE_SPREAD;
        const distance_falloff = 1.0 / (1.0 + normalized_radius * normalized_radius);

        // Only particles above the accent threshold get a glowing-ember tint, which fades out as they age/cool.
        const accent_headroom = 1 - SMOKE_ACCENT_THRESHOLD;
        const accent_mix = clamp((particle.accent_seed - SMOKE_ACCENT_THRESHOLD) / accent_headroom, 0, 1) * (1 - age_fraction) * SMOKE_ACCENT_STRENGTH;

        particles.push({
            x: radius * Math.cos(angle),
            y: age_fraction * SMOKE_RISE_HEIGHT,
            z: radius * Math.sin(angle),
            opacity: life_envelope * distance_falloff,
            colorMix: color_mix,
            accentMix: accent_mix,
            sizeMult: size_mult,
            shapeSeed: particle.shape_seed,
        });
    }

    return particles;
}
