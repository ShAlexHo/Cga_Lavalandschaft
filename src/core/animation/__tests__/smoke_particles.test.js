import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
    SMOKE_MAX_PARTICLES,
    SMOKE_DEFAULT_COUNT,
    SMOKE_LIFETIME,
    SMOKE_SIZE_MULT_MIN,
    SMOKE_SIZE_MULT_MAX,
    SMOKE_ACCENT_STRENGTH,
    SMOKE_EMBER_GLOW_MULT_MIN,
    SMOKE_EMBER_GLOW_MULT_MAX,
    SMOKE_AMBIENT_FRACTION,
    SMOKE_PAUSED_ERUPTION_OPACITY,
} from '../../config.js';

// ─── Fresh module instance per test ──────────────────────────────────────────
//
// smoke_particles.js bakes the particle seed arrays at import time from the
// shared seeded RNG (rand.js) - tests must not share one import across cases,
// and re-importing after vi.resetModules() restarts the RNG from the same
// seed, keeping the seeds deterministic.

let particles_module;
beforeEach(async () => {
    vi.resetModules();
    particles_module = await import('../smoke_particles.js');
});

describe('settings (default values)', () => {
    test('count is SMOKE_DEFAULT_COUNT', () => expect(particles_module.settings.count).toBe(SMOKE_DEFAULT_COUNT));
    test('max_count is SMOKE_MAX_PARTICLES', () => expect(particles_module.settings.max_count).toBe(SMOKE_MAX_PARTICLES));
});

describe('particle_seeds', () => {
    test('every seed array is sized for the full particle pool', () => {
        const { particle_seeds } = particles_module;
        expect(particle_seeds.is_ambient).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(particle_seeds.motion_seed).toHaveLength(SMOKE_MAX_PARTICLES * 4);
        expect(particle_seeds.timing_seed).toHaveLength(SMOKE_MAX_PARTICLES * 2);
        expect(particle_seeds.appearance).toHaveLength(SMOKE_MAX_PARTICLES * 3);
        expect(particle_seeds.accent_base).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(particle_seeds.ambient_seed).toHaveLength(SMOKE_MAX_PARTICLES * 4);
    });

    test('is_ambient is only ever exactly 0 or 1, roughly matching SMOKE_AMBIENT_FRACTION', () => {
        const { is_ambient } = particles_module.particle_seeds;
        is_ambient.forEach(value => expect([0, 1]).toContain(value));
        const ambient_share = is_ambient.reduce((sum, value) => sum + value, 0) / is_ambient.length;
        expect(ambient_share).toBeGreaterThan(SMOKE_AMBIENT_FRACTION - 0.1);
        expect(ambient_share).toBeLessThan(SMOKE_AMBIENT_FRACTION + 0.1);
    });

    test('appearance packs size_mult/glow_mult within their configured ranges', () => {
        const { appearance } = particles_module.particle_seeds;
        for (let i = 0; i < appearance.length; i += 3) {
            const [size_mult, glow_mult, shape_seed] = [appearance[i], appearance[i + 1], appearance[i + 2]];
            expect(size_mult).toBeGreaterThanOrEqual(SMOKE_SIZE_MULT_MIN);
            expect(size_mult).toBeLessThanOrEqual(SMOKE_SIZE_MULT_MAX);
            expect(glow_mult).toBeGreaterThanOrEqual(SMOKE_EMBER_GLOW_MULT_MIN);
            expect(glow_mult).toBeLessThanOrEqual(SMOKE_EMBER_GLOW_MULT_MAX);
            expect(shape_seed).toBeGreaterThanOrEqual(0);
            expect(shape_seed).toBeLessThanOrEqual(1);
        }
    });

    test('size_mult follows a bell curve - most particles cluster near the mean, few are near the maximum', () => {
        const { appearance } = particles_module.particle_seeds;
        const size_mults = [];
        for (let i = 0; i < appearance.length; i += 3) size_mults.push(appearance[i]);

        const mean = (SMOKE_SIZE_MULT_MIN + SMOKE_SIZE_MULT_MAX) / 2;
        const near_mean = size_mults.filter(value => Math.abs(value - mean) < (SMOKE_SIZE_MULT_MAX - mean) * 0.5);
        const near_max = size_mults.filter(value => value > mean + (SMOKE_SIZE_MULT_MAX - mean) * 0.8);

        // A uniform distribution would put ~50% of particles in the "near mean" band and ~20% in the
        // "near max" band - a bell curve clusters much more tightly around the mean and leaves the
        // extreme large sizes rare.
        expect(near_mean.length / size_mults.length).toBeGreaterThan(0.6);
        expect(near_max.length / size_mults.length).toBeLessThan(0.1);
    });

    test('accent_base is a sparse highlight, capped at SMOKE_ACCENT_STRENGTH, and zero for ambient particles', () => {
        const { is_ambient, accent_base } = particles_module.particle_seeds;
        const with_accent = [];
        for (let i = 0; i < accent_base.length; i++) {
            expect(accent_base[i]).toBeGreaterThanOrEqual(0);
            expect(accent_base[i]).toBeLessThanOrEqual(SMOKE_ACCENT_STRENGTH);
            if (is_ambient[i] > 0.5) expect(accent_base[i]).toBe(0);
            if (accent_base[i] > 0) with_accent.push(i);
        }
        expect(with_accent.length).toBeGreaterThan(0);
        expect(with_accent.length).toBeLessThan(accent_base.length);
    });

    test('timing_seed keeps phase_offset within [0, SMOKE_LIFETIME] and color_seed within [0, 1]', () => {
        const { timing_seed } = particles_module.particle_seeds;
        for (let i = 0; i < timing_seed.length; i += 2) {
            expect(timing_seed[i]).toBeGreaterThanOrEqual(0);
            expect(timing_seed[i]).toBeLessThanOrEqual(SMOKE_LIFETIME);
            expect(timing_seed[i + 1]).toBeGreaterThanOrEqual(0);
            expect(timing_seed[i + 1]).toBeLessThanOrEqual(1);
        }
    });

    test('ambient_seed keeps ambient_radius_seed/ambient_height_seed within [0, 1]', () => {
        const { ambient_seed } = particles_module.particle_seeds;
        for (let i = 0; i < ambient_seed.length; i += 4) {
            expect(ambient_seed[i + 1]).toBeGreaterThanOrEqual(0);
            expect(ambient_seed[i + 1]).toBeLessThanOrEqual(1);
            expect(ambient_seed[i + 2]).toBeGreaterThanOrEqual(0);
            expect(ambient_seed[i + 2]).toBeLessThanOrEqual(1);
        }
    });

    test('seeds are deterministic across fresh module instances', async () => {
        const first = particles_module.particle_seeds;

        vi.resetModules();
        const second_particles_module = await import('../smoke_particles.js');
        const second = second_particles_module.particle_seeds;

        expect(Array.from(first.motion_seed)).toEqual(Array.from(second.motion_seed));
        expect(Array.from(first.appearance)).toEqual(Array.from(second.appearance));
    });
});

describe('computePlumeOpacityFactor', () => {
    test('defaults to 1.0 (no dimming) when eruption_intensity is omitted', () => {
        expect(particles_module.computePlumeOpacityFactor()).toBe(1.0);
    });

    test('is 1.0 (no dimming) at full eruption intensity', () => {
        expect(particles_module.computePlumeOpacityFactor(1.0)).toBe(1.0);
    });

    test('drops to SMOKE_PAUSED_ERUPTION_OPACITY while paused (eruption_intensity 0)', () => {
        expect(particles_module.computePlumeOpacityFactor(0.0)).toBeCloseTo(SMOKE_PAUSED_ERUPTION_OPACITY, 9);
    });

    test('clamps out-of-range eruption_intensity instead of extrapolating', () => {
        expect(particles_module.computePlumeOpacityFactor(2.0)).toBe(1.0);
        expect(particles_module.computePlumeOpacityFactor(-1.0)).toBeCloseTo(SMOKE_PAUSED_ERUPTION_OPACITY, 9);
    });
});
