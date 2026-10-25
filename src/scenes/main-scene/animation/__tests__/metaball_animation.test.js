import { describe, test, expect, beforeEach } from 'vitest';
import { METABALL_WAVE_TRANSITION, METABALL_SPAWN_INTERVAL } from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';
import { importFreshModule } from '../../test-utils/reimport.js';

let animation_module;
beforeEach(async () => {
    animation_module = await importFreshModule(() => import('../metaball_animation.js'));
});

describe('settings (default values)', () => {
    test('count matches DEFAULT_SETTINGS.metaballCount', () => expect(animation_module.settings.count).toBe(DEFAULT_SETTINGS.metaballCount));
    test('spread matches DEFAULT_SETTINGS.metaballSpread', () => expect(animation_module.settings.spread).toBe(DEFAULT_SETTINGS.metaballSpread));
    test('speed_factor matches DEFAULT_SETTINGS.metaballSpeed', () => expect(animation_module.settings.speed_factor).toBe(DEFAULT_SETTINGS.metaballSpeed));
    test('sink_speed matches DEFAULT_SETTINGS.metaballSinkSpeed', () => expect(animation_module.settings.sink_speed).toBe(DEFAULT_SETTINGS.metaballSinkSpeed));
    test('disappear_y matches DEFAULT_SETTINGS.metaballDisappearY', () => expect(animation_module.settings.disappear_y).toBe(DEFAULT_SETTINGS.metaballDisappearY));
    test('paused matches DEFAULT_SETTINGS.paused', () => expect(animation_module.settings.paused).toBe(DEFAULT_SETTINGS.paused));
    test('max_count is 500', () => expect(animation_module.settings.max_count).toBe(500));
    test('flow_z_radius matches DEFAULT_SETTINGS.flowRadius', () => expect(animation_module.settings.flow_z_radius).toBe(DEFAULT_SETTINGS.flowRadius));
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

    test('does not spawn a second ball before METABALL_SPAWN_INTERVAL has elapsed', () => {
        animation_module.stepMetaballAnimation(0);
        const balls = animation_module.stepMetaballAnimation(METABALL_SPAWN_INTERVAL / 2);
        expect(balls).toHaveLength(1); // still just the 1 active ball, repositioned
    });

    test('spawns the next ball once METABALL_SPAWN_INTERVAL has elapsed', () => {
        animation_module.stepMetaballAnimation(0);
        const balls = animation_module.stepMetaballAnimation(METABALL_SPAWN_INTERVAL);
        expect(balls).toHaveLength(2); // both active balls
    });

    test('a ball moves down from the crater towards the ground mid-flight', () => {
        animation_module.stepMetaballAnimation(0); // ball #0 spawns at the crater
        const [ball0] = animation_module.stepMetaballAnimation(20); // still above the disappear threshold
        expect(ball0.y).toBeLessThan(0.45); // moved down from the crater...
        expect(ball0.y).toBeGreaterThan(animation_module.settings.disappear_y); // ...but not disappeared yet
    });

    test('a ball disappears once it has fully sunk below the ground', () => {
        animation_module.stepMetaballAnimation(0); // ball #0 spawns at the crater
        const balls = animation_module.stepMetaballAnimation(20000); // far past lifetime: #0 removed, #1 spawns fresh
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

describe('getSpawnCount', () => {
    test('is 0 before the simulation has run', () => {
        expect(animation_module.getSpawnCount()).toBe(0);
    });

    test('increments each time a ball actually spawns', () => {
        animation_module.stepMetaballAnimation(0);
        expect(animation_module.getSpawnCount()).toBe(1);

        animation_module.stepMetaballAnimation(METABALL_SPAWN_INTERVAL);
        expect(animation_module.getSpawnCount()).toBe(2);
    });

    test('does not increment on a step that repositions balls without spawning a new one', () => {
        animation_module.stepMetaballAnimation(0);
        animation_module.stepMetaballAnimation(METABALL_SPAWN_INTERVAL / 2);
        expect(animation_module.getSpawnCount()).toBe(1);
    });
});

describe('getWaveStartCount', () => {
    test('is 0 before the simulation has run', () => {
        expect(animation_module.getWaveStartCount()).toBe(0);
    });

    test('increments to 1 on the very first ball of the very first wave', () => {
        animation_module.stepMetaballAnimation(0);
        expect(animation_module.getWaveStartCount()).toBe(1);
    });

    test('does not increment again while the same wave keeps spawning', () => {
        animation_module.stepMetaballAnimation(0);
        animation_module.stepMetaballAnimation(METABALL_SPAWN_INTERVAL);
        expect(animation_module.getWaveStartCount()).toBe(1);
    });

    test('increments again once a new wave starts spawning after the pause between waves', () => {
        animation_module.settings.count = 1;
        animation_module.stepMetaballAnimation(0); // wave #1 starts, its 1 ball spawns
        animation_module.stepMetaballAnimation(0.1); // wave count already met -> pause begins
        expect(animation_module.getWaveStartCount()).toBe(1);

        animation_module.stepMetaballAnimation(10_000); // far past any random pause length -> ends the pause
        expect(animation_module.getWaveStartCount()).toBe(1); // ending the pause alone doesn't spawn yet

        animation_module.stepMetaballAnimation(10_000); // wave #2 starts, its 1 ball spawns
        expect(animation_module.getWaveStartCount()).toBe(2);
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

        // far enough that any random pause_end (20-30s out) has long passed
        expect(animation_module.getEruptionIntensity(10_000)).toBe(1.0);
    });
});
