import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
    SMOKE_MAX_PARTICLES,
    SMOKE_DEFAULT_COUNT,
    SMOKE_DEFAULT_SPREAD,
    SMOKE_DEFAULT_RISE_SPEED,
    SMOKE_RISE_HEIGHT,
    SMOKE_SIZE_MULT_MIN,
    SMOKE_SIZE_MULT_MAX,
    SMOKE_AMBIENT_RADIUS,
    SMOKE_AMBIENT_HEIGHT_MIN,
    SMOKE_AMBIENT_HEIGHT_MAX,
    SMOKE_AMBIENT_OPACITY,
} from '../../config.js';

function radiusOf(particle) { return Math.hypot(particle.x, particle.z); }

// ─── Fresh module instance per test ──────────────────────────────────────────
//
// smoke_animation.js bakes the particle pool's random parameters at import
// time from the shared seeded RNG (rand.js) - tests must not share one import
// across cases, and re-importing after vi.resetModules() restarts the RNG
// from the same seed, keeping particle parameters deterministic.

let animation_module;
beforeEach(async () => {
    vi.resetModules();
    animation_module = await import('../smoke_animation.js');
});

describe('settings (default values)', () => {
    test('count is SMOKE_DEFAULT_COUNT', () => expect(animation_module.settings.count).toBe(SMOKE_DEFAULT_COUNT));
    test('spread is SMOKE_DEFAULT_SPREAD', () => expect(animation_module.settings.spread).toBe(SMOKE_DEFAULT_SPREAD));
    test('rise_speed is SMOKE_DEFAULT_RISE_SPEED', () => expect(animation_module.settings.rise_speed).toBe(SMOKE_DEFAULT_RISE_SPEED));
    test('max_count is SMOKE_MAX_PARTICLES', () => expect(animation_module.settings.max_count).toBe(SMOKE_MAX_PARTICLES));
});

describe('stepSmokeAnimation', () => {
    test('returns exactly settings.count particles', () => {
        animation_module.settings.count = 37;
        expect(animation_module.stepSmokeAnimation(0)).toHaveLength(37);
    });

    test('clamps the particle count to the pool size', () => {
        animation_module.settings.count = 10_000;
        expect(animation_module.stepSmokeAnimation(0)).toHaveLength(SMOKE_MAX_PARTICLES);
    });

    test('keeps y/opacity/colorMix/accentMix within their expected bounds', () => {
        const particles = animation_module.stepSmokeAnimation(123.456);
        const max_height = Math.max(SMOKE_RISE_HEIGHT, SMOKE_AMBIENT_HEIGHT_MAX);
        particles.forEach(particle => {
            expect(particle.y).toBeGreaterThanOrEqual(SMOKE_AMBIENT_HEIGHT_MIN - 1e-9);
            expect(particle.y).toBeLessThanOrEqual(max_height + 1e-9);
            expect(particle.opacity).toBeGreaterThanOrEqual(0);
            expect(particle.opacity).toBeLessThanOrEqual(1);
            expect(particle.colorMix).toBeGreaterThanOrEqual(0);
            expect(particle.colorMix).toBeLessThanOrEqual(1);
            expect(particle.accentMix).toBeGreaterThanOrEqual(0);
            expect(particle.accentMix).toBeLessThanOrEqual(1);
        });
    });

    test('sizeMult stays within [SMOKE_SIZE_MULT_MIN, SMOKE_SIZE_MULT_MAX]', () => {
        const particles = animation_module.stepSmokeAnimation(7.0);
        particles.forEach(particle => {
            expect(particle.sizeMult).toBeGreaterThanOrEqual(SMOKE_SIZE_MULT_MIN);
            expect(particle.sizeMult).toBeLessThanOrEqual(SMOKE_SIZE_MULT_MAX);
        });
    });

    test('shapeSeed stays within [0, 1] and varies per particle - each grain gets its own irregular shape', () => {
        const particles = animation_module.stepSmokeAnimation(7.0);
        particles.forEach(particle => {
            expect(particle.shapeSeed).toBeGreaterThanOrEqual(0);
            expect(particle.shapeSeed).toBeLessThanOrEqual(1);
        });
        expect(new Set(particles.map(particle => particle.shapeSeed)).size).toBeGreaterThan(1);
    });

    test('colorMix and sizeMult vary across particles instead of being a single flat value', () => {
        const particles = animation_module.stepSmokeAnimation(1.0);
        expect(new Set(particles.map(particle => particle.colorMix)).size).toBeGreaterThan(1);
        expect(new Set(particles.map(particle => particle.sizeMult)).size).toBeGreaterThan(1);
    });

    test('sizeMult follows a bell curve - most particles cluster near the mean, few are near the maximum', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;
        const particles = animation_module.stepSmokeAnimation(1.0);

        const mean = (SMOKE_SIZE_MULT_MIN + SMOKE_SIZE_MULT_MAX) / 2;
        const near_mean = particles.filter(particle => Math.abs(particle.sizeMult - mean) < (SMOKE_SIZE_MULT_MAX - mean) * 0.5);
        const near_max = particles.filter(particle => particle.sizeMult > mean + (SMOKE_SIZE_MULT_MAX - mean) * 0.8);

        // A uniform distribution would put ~50% of particles in the "near mean"
        // band and ~20% in the "near max" band - a bell curve clusters much
        // more tightly around the mean and leaves the extreme large sizes rare.
        expect(near_mean.length / particles.length).toBeGreaterThan(0.6);
        expect(near_max.length / particles.length).toBeLessThan(0.1);
    });

    test('accentMix is a sparse highlight - only some particles carry any ember accent', () => {
        const particles = animation_module.stepSmokeAnimation(0.0);
        const with_accent = particles.filter(particle => particle.accentMix > 0);
        expect(with_accent.length).toBeGreaterThan(0);
        expect(with_accent.length).toBeLessThan(particles.length);
    });

    test('positions are deterministic for the same time', async () => {
        const first = animation_module.stepSmokeAnimation(5.0);

        vi.resetModules();
        const second_animation_module = await import('../smoke_animation.js');
        const second = second_animation_module.stepSmokeAnimation(5.0);

        expect(first).toEqual(second);
    });

    test('rise_speed changes how far particles have progressed through their cycle', () => {
        const baseline = animation_module.stepSmokeAnimation(2.0);
        animation_module.settings.rise_speed = 3.0;
        const scaled = animation_module.stepSmokeAnimation(2.0);
        expect(scaled).not.toEqual(baseline);
    });

    // ─── centered, density-falls-off-with-distance behaviour ────────────────

    test('opacity falls off with distance from the central axis', () => {
        const particles = animation_module.stepSmokeAnimation(3.0);
        const near = particles.filter(particle => radiusOf(particle) < 1.0);
        const far = particles.filter(particle => radiusOf(particle) > 5.0);
        expect(near.length).toBeGreaterThan(0);
        expect(far.length).toBeGreaterThan(0);

        const average = list => list.reduce((sum, particle) => sum + particle.opacity, 0) / list.length;
        expect(average(far)).toBeLessThan(average(near));
    });

    test('spread=0 still keeps particles bounded near the axis (the core placement never depends on spread)', () => {
        animation_module.settings.spread = 0;
        const particles = animation_module.stepSmokeAnimation(3.3);
        particles.forEach(particle => expect(radiusOf(particle)).toBeLessThan(25));
    });

    // ─── ambient background ash - fills the whole space, densest at the crater ──

    test('even with spread=0, some ash is scattered far across the whole space while most stays near the crater', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;
        animation_module.settings.spread = 0;
        const particles = animation_module.stepSmokeAnimation(4.0);

        const far = particles.filter(particle => radiusOf(particle) > 15);
        const near = particles.filter(particle => radiusOf(particle) <= 15);

        // The ambient population reaches far beyond what the crater-centered
        // core alone would ever produce at spread=0, but it is still a
        // minority - the plume concentrated at the opening dominates.
        expect(far.length).toBeGreaterThan(0);
        expect(far.length).toBeLessThan(near.length);
    });

    test('ambient ash covers a height range independent of the crater plume, including below the crater opening', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;
        const particles = animation_module.stepSmokeAnimation(4.0);
        const below_crater = particles.filter(particle => particle.y < 0);
        expect(below_crater.length).toBeGreaterThan(0);
    });

    test('ambient ash never carries the glowing-ember accent', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;
        animation_module.settings.spread = 0; // isolate ambient particles: at spread=0 the crater plume can't reach this far out
        const particles = animation_module.stepSmokeAnimation(0.0);
        const far_particles = particles.filter(particle => radiusOf(particle) > SMOKE_AMBIENT_RADIUS * 0.95);
        expect(far_particles.length).toBeGreaterThan(0);
        far_particles.forEach(particle => expect(particle.accentMix).toBe(0));
    });

    test('ambient ash stays fainter than the dense crater plume', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;
        animation_module.settings.spread = 0; // isolate ambient particles: at spread=0 the crater plume can't reach this far out
        const particles = animation_module.stepSmokeAnimation(4.0);
        particles
            .filter(particle => radiusOf(particle) > SMOKE_AMBIENT_RADIUS * 0.95)
            .forEach(particle => expect(particle.opacity).toBeLessThanOrEqual(SMOKE_AMBIENT_OPACITY + 1e-9));
    });

    test('turning up spread widens the plume\'s outer reach without diluting the center', () => {
        animation_module.settings.count = SMOKE_MAX_PARTICLES;

        animation_module.settings.spread = 0;
        const narrow_radii = animation_module.stepSmokeAnimation(4.0).map(radiusOf).sort((a, b) => a - b);

        animation_module.settings.spread = 20;
        const wide_radii = animation_module.stepSmokeAnimation(4.0).map(radiusOf).sort((a, b) => a - b);

        // The particles closest to the axis (the plume's core) barely move...
        const near_axis_index = Math.floor(narrow_radii.length * 0.1);
        expect(wide_radii[near_axis_index]).toBeLessThan(narrow_radii[near_axis_index] * 2.5);

        // ...but the plume's outer edge reaches dramatically further out.
        const outer_index = narrow_radii.length - 1;
        expect(wide_radii[outer_index]).toBeGreaterThan(narrow_radii[outer_index] * 10);
    });
});
