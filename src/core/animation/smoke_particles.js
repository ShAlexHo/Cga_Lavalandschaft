import { random, randomGauss } from '../rand.js';
import { clamp } from './math_utils.js';
import {
    SMOKE_MAX_PARTICLES, SMOKE_LIFETIME,
    SMOKE_SIZE_MULTIPLIER_MIN, SMOKE_SIZE_MULTIPLIER_MAX,
    SMOKE_ACCENT_THRESHOLD, SMOKE_ACCENT_STRENGTH,
    SMOKE_EMBER_GLOW_MULTIPLIER_MIN, SMOKE_EMBER_GLOW_MULTIPLIER_MAX,
    SMOKE_EMBER_COOLING_MULTIPLIER_MIN, SMOKE_EMBER_COOLING_MULTIPLIER_MAX,
    SMOKE_AMBIENT_FRACTION, SMOKE_PAUSED_ERUPTION_OPACITY,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export const MAX_PARTICLES = SMOKE_MAX_PARTICLES;

export const settings = { count: DEFAULT_SETTINGS.smokeCount, max_count: MAX_PARTICLES };

function meanAndStdDev(min, max) {
    return { mean: (min + max) / 2, std_dev: (max - min) / 4 };
}

// bell-curve size/glow distributions, so oversized grains or extra-bright embers stay rare
const SIZE_MULTIPLIER = meanAndStdDev(SMOKE_SIZE_MULTIPLIER_MIN, SMOKE_SIZE_MULTIPLIER_MAX);
const GLOW_MULTIPLIER = meanAndStdDev(SMOKE_EMBER_GLOW_MULTIPLIER_MIN, SMOKE_EMBER_GLOW_MULTIPLIER_MAX);
const COOLING_MULTIPLIER = meanAndStdDev(SMOKE_EMBER_COOLING_MULTIPLIER_MIN, SMOKE_EMBER_COOLING_MULTIPLIER_MAX);
const ACCENT_HEADROOM = 1 - SMOKE_ACCENT_THRESHOLD;

function createParticleSeeds() {
    const is_ambient = new Float32Array(MAX_PARTICLES);
    const motion_seed = new Float32Array(MAX_PARTICLES * 4); // base_angle, base_radius, drift_angle, lifetime_multiplier
    const timing_seed = new Float32Array(MAX_PARTICLES * 2); // phase_offset, color_seed
    const appearance = new Float32Array(MAX_PARTICLES * 3); // size_multiplier, glow_multiplier, shape_seed
    const accent_base = new Float32Array(MAX_PARTICLES); // time-independent part of the ember accent mix
    const ember_cooling_multiplier = new Float32Array(MAX_PARTICLES);
    const ambient_seed = new Float32Array(MAX_PARTICLES * 4); // ambient_angle, ambient_radius_seed, ambient_height_seed, ambient_opacity_seed

    for (let i = 0; i < MAX_PARTICLES; i++) {
        const ambient = random(0, 1) < SMOKE_AMBIENT_FRACTION;
        is_ambient[i] = ambient ? 1.0 : 0.0;

        // half-normal base_radius keeps most particles near the axis, with a shrinking tail further out
        motion_seed.set([random(0, Math.PI * 2), Math.abs(randomGauss(0, 1)), random(-Math.PI * 0.5, Math.PI * 0.5), random(0.75, 1.35)], i * 4);
        timing_seed.set([random(0, SMOKE_LIFETIME), random(0, 1)], i * 2);

        const size_seed = randomGauss(0, 1);
        const glow_multiplier_seed = randomGauss(0, 1);
        appearance.set([
            clamp(SIZE_MULTIPLIER.mean + size_seed * SIZE_MULTIPLIER.std_dev, SMOKE_SIZE_MULTIPLIER_MIN, SMOKE_SIZE_MULTIPLIER_MAX),
            clamp(GLOW_MULTIPLIER.mean + glow_multiplier_seed * GLOW_MULTIPLIER.std_dev, SMOKE_EMBER_GLOW_MULTIPLIER_MIN, SMOKE_EMBER_GLOW_MULTIPLIER_MAX),
            random(0, 1),
        ], i * 3);

        // Only the ceiling is baked in here - smoke.vert applies the age-dependent fade-out.
        const accent_seed = random(0, 1);
        accent_base[i] = ambient ? 0 : clamp((accent_seed - SMOKE_ACCENT_THRESHOLD) / ACCENT_HEADROOM, 0, 1) * SMOKE_ACCENT_STRENGTH;

        const ember_cooling_multiplier_seed = randomGauss(0, 1);
        ember_cooling_multiplier[i] = clamp(COOLING_MULTIPLIER.mean + ember_cooling_multiplier_seed * COOLING_MULTIPLIER.std_dev, SMOKE_EMBER_COOLING_MULTIPLIER_MIN, SMOKE_EMBER_COOLING_MULTIPLIER_MAX);

        // sqrt of a uniform sample gives uniform-area placement instead of clustering near the axis.
        ambient_seed.set([random(0, Math.PI * 2), Math.sqrt(random(0, 1)), random(0, 1), random(0.3, 1.0)], i * 4);
    }

    return { is_ambient, motion_seed, timing_seed, appearance, accent_base, ember_cooling_multiplier, ambient_seed };
}

export const particle_seeds = createParticleSeeds();

// Thins the plume between lava waves; eruption_intensity already eases (see getEruptionIntensity).
export function computePlumeOpacityFactor(eruption_intensity = 1.0) {
    return SMOKE_PAUSED_ERUPTION_OPACITY + (1 - SMOKE_PAUSED_ERUPTION_OPACITY) * clamp(eruption_intensity, 0, 1);
}
