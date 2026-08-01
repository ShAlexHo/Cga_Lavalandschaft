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
    test('speed_factor is 0.0011', () => expect(animation_module.settings.speed_factor).toBe(0.0011));
    test('sink_speed is 0.25', () => expect(animation_module.settings.sink_speed).toBe(0.25));
    test('disappear_y is 0.33', () => expect(animation_module.settings.disappear_y).toBe(0.33));
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

    test('a ball moves down from the crater towards the ground mid-flight', () => {
        animation_module.stepMetaballAnimation(0); // ball #0 spawns at the crater
        const [ball0] = animation_module.stepMetaballAnimation(20); // early enough to stay well above the disappear threshold for any speed_mult
        expect(ball0.y).toBeLessThan(0.45); // moved down from the crater...
        expect(ball0.y).toBeGreaterThan(animation_module.settings.disappear_y); // ...but not yet at the disappear threshold
    });

    test('a ball disappears once it has fully sunk below the ground', () => {
        animation_module.stepMetaballAnimation(0); // ball #0 spawns at the crater
        const balls = animation_module.stepMetaballAnimation(20000); // far past BALL_LIFETIME for any speed_mult -> ball #0 has sunk past disappear_y and been removed, ball #1 spawns fresh
        expect(balls).toHaveLength(1); // only the freshly-spawned ball #1 remains active

        const [ball1] = balls;
        expect(ball1.x).toBeCloseTo(0.5, 9);
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
