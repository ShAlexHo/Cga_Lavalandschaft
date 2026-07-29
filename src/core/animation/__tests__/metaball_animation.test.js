import { describe, test, expect, beforeEach } from 'vitest';
import { METABALL_WAVE_TRANSITION } from '../../config.js';
import { importFreshModule } from '../../test-utils/reimport.js';

let animation_module;
beforeEach(async () => {
    animation_module = await importFreshModule(() => import('../metaball_animation.js'));
});

describe('settings (default values)', () => {
    test('count is 100', () => expect(animation_module.settings.count).toBe(100));
    test('spread is 1.0', () => expect(animation_module.settings.spread).toBe(1.0));
    test('speed_factor is 0.003', () => expect(animation_module.settings.speed_factor).toBe(0.003));
    test('paused is false', () => expect(animation_module.settings.paused).toBe(false));
    test('max_count is 500', () => expect(animation_module.settings.max_count).toBe(500));
    test('flow_z_radius is 10.3', () => expect(animation_module.settings.flow_z_radius).toBe(10.3));
});

describe('getActiveBalls', () => {
    test('is empty before the simulation has run', () => {
        expect(animation_module.getActiveBalls()).toHaveLength(0);
    });
});

describe('stepMetaballAnimation', () => {
    test('returns null while paused', () => {
        animation_module.settings.paused = true;
        expect(animation_module.stepMetaballAnimation(0)).toBeNull();
    });

    test('spawns exactly one ball on the very first call, at the crater', () => {
        const balls = animation_module.stepMetaballAnimation(0);
        expect(balls).toHaveLength(1);

        const [ball] = balls;
        expect(ball.x).toBeCloseTo(0.5, 9);
        expect(ball.y).toBeCloseTo(0.45, 9);
        expect(ball.z).toBeCloseTo(0.5, 9);
        expect(ball.strength).toBeGreaterThan(0);
        expect(ball.subtract).toBeGreaterThanOrEqual(25);
        expect(ball.subtract).toBeLessThanOrEqual(45);
    });

    test('does not spawn a second ball less than a second after the first', () => {
        animation_module.stepMetaballAnimation(0);
        const balls = animation_module.stepMetaballAnimation(0.5);
        expect(balls).toHaveLength(1); // still just the 1 active ball, repositioned
    });

    test('spawns the next ball once a full second has elapsed', () => {
        animation_module.stepMetaballAnimation(0);
        const balls = animation_module.stepMetaballAnimation(1.0);
        expect(balls).toHaveLength(2); // both active balls
    });

    test('a ball flows from the crater towards the ground over its lifetime', () => {
        animation_module.stepMetaballAnimation(0); // ball #0 spawns at the crater
        const balls = animation_module.stepMetaballAnimation(2000); // far past BALL_LIFETIME -> ball #0 fully descended, ball #1 spawns fresh
        expect(balls).toHaveLength(2);

        const [ball0, ball1] = balls; // ball #0: landed (life_fraction clamped to 1.0 regardless of its random speed_mult)
        expect(ball0.y).toBeCloseTo(0.45 + (0.288 - 0.45) * 0.95, 9);
        const radius = (11 / 30) * 0.95;
        expect(ball0.x).toBeGreaterThanOrEqual(0.5 - radius - 1e-9);
        expect(ball0.x).toBeLessThanOrEqual(0.5 + radius + 1e-9);

        expect(ball1.x).toBeCloseTo(0.5, 9); // ball #1: freshly spawned this same call
        expect(ball1.y).toBeCloseTo(0.45, 9);
        expect(ball1.z).toBeCloseTo(0.5, 9);
    });

    test('positions are deterministic for the same call sequence', async () => {
        animation_module.stepMetaballAnimation(0);
        const balls_first_run = animation_module.stepMetaballAnimation(2000).map(ball => ({ ...ball }));

        const second_animation_module = await importFreshModule(() => import('../metaball_animation.js'));
        second_animation_module.stepMetaballAnimation(0);
        const balls_second_run = second_animation_module.stepMetaballAnimation(2000).map(ball => ({ ...ball }));

        expect(balls_first_run).toEqual(balls_second_run);
    });
});

describe('getEruptionIntensity', () => {
    test('is 1.0 while a wave is actively spawning', () => {
        expect(animation_module.getEruptionIntensity(0)).toBe(1.0);
    });

    test('eases down to 0 after a wave finishes and no new balls are being spawned', () => {
        animation_module.settings.count = 1;
        animation_module.stepMetaballAnimation(0); // spawns the 1 ball of the wave
        animation_module.stepMetaballAnimation(0.1); // wave count already met -> pause begins at time=0.1

        expect(animation_module.getEruptionIntensity(0.1)).toBeCloseTo(1.0, 5); // right at the pause boundary, not yet faded
        expect(animation_module.getEruptionIntensity(0.1 + METABALL_WAVE_TRANSITION / 2)).toBeCloseTo(0.5, 5); // smoothstep midpoint
        expect(animation_module.getEruptionIntensity(0.1 + METABALL_WAVE_TRANSITION + 1)).toBe(0); // well past the fade-out, well before the next wave
    });

    test('eases back up to 1.0 as the next wave approaches, regardless of the exact (random) pause length', () => {
        animation_module.settings.count = 1;
        animation_module.stepMetaballAnimation(0);
        animation_module.stepMetaballAnimation(0.1);

        // Far enough into the future that any random pause_end (20-30s out) has long passed -
        // getEruptionIntensity is a pure read of time vs. the stored pause window, so this is deterministic.
        expect(animation_module.getEruptionIntensity(10_000)).toBe(1.0);
    });
});
