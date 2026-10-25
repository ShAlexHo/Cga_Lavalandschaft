import { describe, test, expect, beforeEach } from 'vitest';
import {
    INTERACTION_DECAY_DURATION, INTERACTION_BUMP_RADIUS, INTERACTION_PUSH_HEIGHT_SCALE, INTERACTION_MAX_POINTS,
    INTERACTION_HOVER_RISE_RATE, INTERACTION_HOVER_RISE_MAX_DELTA,
    INTERACTION_SMOKE_MIN_BURST_DURATION, INTERACTION_SMOKE_MAX_BURST_DURATION, INTERACTION_SMOKE_FADE_PER_PRESS_SECOND,
    INTERACTION_SMOKE_BLOOM_DURATION,
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_SURFACE_OFFSET, INTERACTION_SMOKE_PUSH_INFLUENCE,
    INTERACTION_SMOKE_EMBER_STRENGTH_DECAY, INTERACTION_SMOKE_MIN_EMBER_STRENGTH,
    INTERACTION_METABALL_SHRINK_DURATION, INTERACTION_METABALL_SHRINK_FRACTION,
    INTERACTION_LAVA_DETECTION_TOLERANCE,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';
import { importFreshModule } from '../../test-utils/import_fresh_module.js';

const CAMERA_POSITION = { x: 0, y: 0, z: 10 };

function metaball(x, y, z, radius) {
    return { x, y, z, radius, subtract: 0, isolation: 1 };
}

let animation_module;
beforeEach(async () => {
    animation_module = await importFreshModule(() => import('../interaction_animation.js'));
});

describe('settings (default values)', () => {
    test('enabled matches DEFAULT_SETTINGS.interactionMode', () => {
        expect(animation_module.settings.enabled).toBe(DEFAULT_SETTINGS.interactionMode);
    });
});

describe('registerTouch (lava-presence gating)', () => {
    test('does not create a touch point when no metaball\'s field reaches hit_point', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball(10, 10, 10, 2)], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(0);
    });

    test('never registers a spot with no nearby metaball, no matter how long the mouse dwells there', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const far_metaball = metaball(50, 0, 0, 2);

        for (const time of [0, 1, 5, 30, 300]) {
            animation_module.registerTouch(time, hit_point, [far_metaball], CAMERA_POSITION);
        }
        expect(animation_module.stepInteractionAnimation(300)).toHaveLength(0);
    });

    test('creates a touch point capped at the raw center distance to the selected metaball', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(1);
        expect(points[0]).toMatchObject({ x: 0, y: 0, z: 0 });
        expect(points[0].strength).toBeCloseTo(1.0 * INTERACTION_PUSH_HEIGHT_SCALE, 9);
    });

    test('a touch whose own radius alone doesn\'t reach it can still register once overlapping metaballs are blended together', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const threshold = INTERACTION_LAVA_DETECTION_TOLERANCE;
        const radius = 1;
        const distance_each = radius / Math.sqrt(threshold * 0.8);
        const ball_a = metaball(distance_each, 0, 0, radius);
        const ball_b = metaball(-distance_each, 0, 0, radius);
        animation_module.registerTouch(0, hit_point, [ball_a, ball_b], CAMERA_POSITION);

        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(1);
    });

    test('a touch right at the edge of a large metaball registers just as reliably as one at its center, but caps at the raw center distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(4, 0, 0, 4.2);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(1);
        expect(points[0].strength).toBeCloseTo(4.0 * INTERACTION_PUSH_HEIGHT_SCALE, 9);
    });

    test('a touch well inside a metaball\'s own radius still gets a real (non-zero) push, capped at the raw center distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(1, 0, 0, 5);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].strength).toBeCloseTo(1.0 * INTERACTION_PUSH_HEIGHT_SCALE, 9);
    });

    test('selects the metaball with the nearest surface among several candidates, but caps at its raw center distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        animation_module.registerTouch(0, hit_point, [
            metaball(1.5, 0, 0, 0),
            metaball(2, 0, 0, 2.1),
        ], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].strength).toBeCloseTo(2.0 * INTERACTION_PUSH_HEIGHT_SCALE, 9);
    });

    test('a repeated touch near an existing point refreshes it instead of creating a new one', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        animation_module.registerTouch(0.5, { x: 0.1, y: 0, z: 0 }, [ball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0.5);
        expect(points).toHaveLength(1);
        expect(points[0].decay_progress).toBeCloseTo(0, 9);
    });

    test('repeatedly re-hovering an already-active point while held down nudges its push height a little higher each time', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        const base_strength = animation_module.stepInteractionAnimation(0)[0].strength;

        animation_module.registerTouch(0.1, { x: 0.05, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        const after_one_rehover = animation_module.stepInteractionAnimation(0.1)[0].strength;
        expect(after_one_rehover).toBeCloseTo(base_strength + 0.1 * INTERACTION_HOVER_RISE_RATE, 9);

        animation_module.registerTouch(0.2, { x: 0.1, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        const after_two_rehovers = animation_module.stepInteractionAnimation(0.2)[0].strength;
        expect(after_two_rehovers).toBeCloseTo(after_one_rehover + 0.1 * INTERACTION_HOVER_RISE_RATE, 9);
    });

    test('a re-hover after a long gap only adds a bump capped at INTERACTION_HOVER_RISE_MAX_DELTA, not the full elapsed time', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        const base_strength = animation_module.stepInteractionAnimation(0)[0].strength;

        const long_gap = INTERACTION_HOVER_RISE_MAX_DELTA * 10;
        animation_module.registerTouch(long_gap, { x: 0.05, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        const strength = animation_module.stepInteractionAnimation(long_gap)[0].strength;
        expect(strength).toBeCloseTo(base_strength + INTERACTION_HOVER_RISE_MAX_DELTA * INTERACTION_HOVER_RISE_RATE, 9);
    });

    test('an existing bump stops being refreshed once the touch is no longer over any actual lava', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        animation_module.registerTouch(0, hit_point, [metaball(0, 0, 0, 1.2)], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(1);

        animation_module.registerTouch(1, hit_point, [metaball(50, 0, 0, 1.2)], CAMERA_POSITION);

        expect(animation_module.stepInteractionAnimation(INTERACTION_DECAY_DURATION + 0.01)).toHaveLength(0);
    });
});

describe('registerTouch (metaball center squeeze)', () => {
    test('signals a squeeze (at shrink_increment 0) the instant a metaball\'s visual center is pressed, even if far away in raw 3D distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(0, 0, 5, 0);
        const squeeze = animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);
        expect(squeeze).toMatchObject({ x: 0, y: 0, z: 5 });
        expect(squeeze.shrink_increment).toBeCloseTo(0, 9);
    });

    test('registers a bump/smoke while squeezing a metaball, even if its radius is too small to satisfy the raw-distance lava check on its own', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(0, 0, 5, 0);
        const squeeze = animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        expect(squeeze).not.toBeNull();
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(1);
        expect(animation_module.stepInteractionSmoke(0)).toHaveLength(1);
    });

    test('does not signal a squeeze for a metaball genuinely off to the side of the line of sight', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const squeeze = animation_module.registerTouch(0, hit_point, [metaball(5, 0, 0, 0)], CAMERA_POSITION);
        expect(squeeze).toBeNull();
    });

    test('a bump can still register even when nothing is close enough to the line of sight to squeeze', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(1, 0, 0, 1.2);
        const squeeze = animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);
        expect(squeeze).toBeNull();
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(1);
    });

    test('shrink_increment reflects real elapsed time since the metaball was last pressed (zero on the very first frame of a press)', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(0, 0, 0.1, 0);

        const first = animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);
        expect(first.shrink_increment).toBeCloseTo(0, 9);

        const second = animation_module.registerTouch(1.5, hit_point, [ball], CAMERA_POSITION);
        const shrink_rate = INTERACTION_METABALL_SHRINK_FRACTION / INTERACTION_METABALL_SHRINK_DURATION;
        expect(second.shrink_increment).toBeCloseTo(1.5 * shrink_rate, 9);
    });

    test('shrink_increment is zero on the frame the touch resumes after landing off any metaball\'s center', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(0, 0, 0.1, 0);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        animation_module.registerTouch(1, hit_point, [metaball(5, 0, 0, 0)], CAMERA_POSITION);

        const squeeze = animation_module.registerTouch(1.1, hit_point, [ball], CAMERA_POSITION);
        expect(squeeze.shrink_increment).toBeCloseTo(0, 9);
    });

    test('shrink_increment is zero on the frame a genuinely different metaball becomes the centered one', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        animation_module.registerTouch(0, hit_point, [metaball(0, 0, 0.1, 0)], CAMERA_POSITION);

        const distant_ball = metaball(0, 0, 100.1, 0);
        const squeeze = animation_module.registerTouch(2, hit_point, [distant_ball], CAMERA_POSITION);
        expect(squeeze.shrink_increment).toBeCloseTo(0, 9);
    });

    test('resetTouchSession() also clears an in-progress center press for a fresh mouse-down', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const ball = metaball(0, 0, 0.1, 0);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);
        animation_module.resetTouchSession();

        const squeeze = animation_module.registerTouch(100, hit_point, [ball], CAMERA_POSITION);
        expect(squeeze.shrink_increment).toBeCloseTo(0, 9);
    });

    test('returns null when there are no metaballs at all', () => {
        expect(animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [], CAMERA_POSITION)).toBeNull();
    });
});

describe('stepInteractionAnimation (decay_progress drives a top-to-bottom wipe, not radius shrink)', () => {
    test('starts at the full bump radius and zero decay_progress right after the touch', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball(1, 0, 0, 1.2)], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].radius).toBeCloseTo(INTERACTION_BUMP_RADIUS, 5);
        expect(points[0].decay_progress).toBeCloseTo(0, 9);
    });

    test('decay_progress grows partway through the decay duration, while radius and strength stay constant', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball(1, 0, 0, 1.2)], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(INTERACTION_DECAY_DURATION / 2);
        expect(points[0].radius).toBeCloseTo(INTERACTION_BUMP_RADIUS, 5);
        expect(points[0].decay_progress).toBeCloseTo(0.5, 9);
        expect(points[0].strength).toBeCloseTo(1.0 * INTERACTION_PUSH_HEIGHT_SCALE, 9);
    });

    test('is fully evicted once INTERACTION_DECAY_DURATION has elapsed since the last touch', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball(1, 0, 0, 1.2)], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(INTERACTION_DECAY_DURATION + 0.01);
        expect(points).toHaveLength(0);
    });
});

describe('stepInteractionSmoke', () => {
    test('spawns a burst at the touch point (not the metaball\'s own center) when the push is zero, lifted just above the surface', () => {
        const ball = metaball(3, 4, 4, 1.2);
        animation_module.registerTouch(0, { x: 3, y: 4, z: 4 }, [ball], CAMERA_POSITION);

        const bursts = animation_module.stepInteractionSmoke(0);
        expect(bursts).toHaveLength(1);
        expect(bursts[0]).toMatchObject({ x: 3, y: 4 + INTERACTION_SMOKE_SURFACE_OFFSET, z: 4 });
        expect(bursts[0].bloom).toBeCloseTo(0, 9);
        expect(bursts[0].fade).toBeCloseTo(1, 9);
        expect(bursts[0].elapsed).toBeCloseTo(0, 9);
    });

    test('shifts the burst toward the camera by only a fraction of the touch\'s push amount, staying close to the actual local surface', () => {
        const hit_point = { x: 0, y: 0, z: 4 };
        const ball = metaball(0, 0, 2, 2.2);
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);

        const bursts = animation_module.stepInteractionSmoke(0);
        const height_cap = 2 * INTERACTION_PUSH_HEIGHT_SCALE;
        const pushed_z = 4 + height_cap * INTERACTION_SMOKE_PUSH_INFLUENCE;
        expect(bursts[0]).toMatchObject({ x: 0, y: INTERACTION_SMOKE_SURFACE_OFFSET, z: pushed_z });
    });

    test('does not spawn an extra burst when a touch merely refreshes an existing point', () => {
        const ball = metaball(0, 0, 1, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        animation_module.registerTouch(0.05, { x: 0.05, y: 0, z: 0 }, [ball], CAMERA_POSITION);

        expect(animation_module.stepInteractionSmoke(0.05)).toHaveLength(1);
    });

    test('bloom grows toward 1 over INTERACTION_SMOKE_BLOOM_DURATION while continuously touched at the same spot', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        animation_module.registerTouch(INTERACTION_SMOKE_BLOOM_DURATION / 2, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);

        const bursts = animation_module.stepInteractionSmoke(INTERACTION_SMOKE_BLOOM_DURATION / 2);
        expect(bursts[0].bloom).toBeCloseTo(0.5, 9);
        expect(bursts[0].fade).toBeCloseTo(1, 9);
    });

    test('bloom (hot ember tint) resets while genuinely dragging to new spots, and only grows once the touch holds still', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        animation_module.registerTouch(0.3, { x: 0.2, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        animation_module.registerTouch(0.6, { x: 0.4, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(0.6)[0].bloom).toBeCloseTo(0, 9);

        const hold_time = 0.6 + INTERACTION_SMOKE_BLOOM_DURATION / 2;
        animation_module.registerTouch(hold_time, { x: 0.4, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(hold_time)[0].bloom).toBeCloseTo(0.5, 9);
    });

    test('ember_strength starts at 1 and weakens with each genuine movement reset, floored at INTERACTION_SMOKE_MIN_EMBER_STRENGTH', () => {
        const ball = metaball(1, 0, 0, 1.2);
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(0)[0].ember_strength).toBeCloseTo(1, 9);

        animation_module.registerTouch(0.1, { x: 0.2, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(0.1)[0].ember_strength).toBeCloseTo(INTERACTION_SMOKE_EMBER_STRENGTH_DECAY, 9);

        animation_module.registerTouch(0.2, { x: 0.4, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(0.2)[0].ember_strength).toBeCloseTo(INTERACTION_SMOKE_EMBER_STRENGTH_DECAY ** 2, 9);

        let time = 0.2;
        let x = 0.4;
        for (let i = 0; i < 20; i++) {
            time += 0.1;
            x += 0.2;
            animation_module.registerTouch(time, { x, y: 0, z: 0 }, [ball], CAMERA_POSITION);
        }
        expect(animation_module.stepInteractionSmoke(time)[0].ember_strength).toBeCloseTo(INTERACTION_SMOKE_MIN_EMBER_STRENGTH, 9);
    });

    test('stays fully alive (fade never drops) for as long as it keeps being touched every frame, even well past the longest possible fade-out duration', () => {
        const ball = metaball(1, 0, 0, 1.2);
        const hit_point = { x: 0, y: 0, z: 0 };
        const still_touching_time = INTERACTION_SMOKE_MAX_BURST_DURATION * 2;
        const frame_interval = 0.1;

        for (let time = 0; time <= still_touching_time; time += frame_interval) {
            animation_module.registerTouch(time, hit_point, [ball], CAMERA_POSITION);
            animation_module.stepInteractionSmoke(time);
        }

        const bursts = animation_module.stepInteractionSmoke(still_touching_time);
        expect(bursts).toHaveLength(1);
        expect(bursts[0].bloom).toBeCloseTo(1, 9);
        expect(bursts[0].fade).toBeCloseTo(1, 9);
        expect(bursts[0].elapsed).toBeCloseTo(still_touching_time, 5);
    });

    test('only starts fading once the touch stops, evicted INTERACTION_SMOKE_MIN_BURST_DURATION after a single instantaneous touch', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball(1, 0, 0, 1.2)], CAMERA_POSITION);

        const midway = animation_module.stepInteractionSmoke(INTERACTION_SMOKE_MIN_BURST_DURATION / 2);
        expect(midway[0].fade).toBeCloseTo(0.5, 9);

        expect(animation_module.stepInteractionSmoke(INTERACTION_SMOKE_MIN_BURST_DURATION + 0.01)).toHaveLength(0);
    });

    test('a longer press leaves the smoke fading out for longer, scaled by INTERACTION_SMOKE_FADE_PER_PRESS_SECOND', () => {
        const ball = metaball(1, 0, 0, 1.2);
        const hit_point = { x: 0, y: 0, z: 0 };
        const press_duration = 2.0;
        animation_module.registerTouch(0, hit_point, [ball], CAMERA_POSITION);
        animation_module.registerTouch(press_duration, hit_point, [ball], CAMERA_POSITION);

        const fade_duration = press_duration * INTERACTION_SMOKE_FADE_PER_PRESS_SECOND;
        const midway = animation_module.stepInteractionSmoke(press_duration + fade_duration / 2);
        expect(midway[0].fade).toBeCloseTo(0.5, 9);

        expect(animation_module.stepInteractionSmoke(press_duration + fade_duration + 0.01)).toHaveLength(0);
    });

    test('stops being refreshed (and eventually fades out) once the touch is no longer over any actual lava', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        animation_module.registerTouch(0, hit_point, [metaball(0, 0, 0, 1.2)], CAMERA_POSITION);
        expect(animation_module.stepInteractionSmoke(0)).toHaveLength(1);

        animation_module.registerTouch(0.5, hit_point, [metaball(50, 0, 0, 1.2)], CAMERA_POSITION);

        expect(animation_module.stepInteractionSmoke(INTERACTION_SMOKE_MIN_BURST_DURATION + 0.01)).toHaveLength(0);
    });

    test('wraparound: a burst beyond INTERACTION_SMOKE_MAX_BURSTS distinct touches overwrites the oldest one', () => {
        for (let i = 0; i < INTERACTION_SMOKE_MAX_BURSTS; i++) {
            animation_module.registerTouch(0, { x: i * 10, y: 0, z: 0 }, [metaball(i * 10, 0, 0, 1.2)], CAMERA_POSITION);
        }
        expect(animation_module.stepInteractionSmoke(0)).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);

        const extra_x = INTERACTION_SMOKE_MAX_BURSTS * 10;
        animation_module.registerTouch(0, { x: extra_x, y: 0, z: 0 }, [metaball(extra_x, 0, 0, 1.2)], CAMERA_POSITION);

        const bursts = animation_module.stepInteractionSmoke(0);
        expect(bursts).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(bursts.some(burst => burst.x === extra_x)).toBe(true);
        expect(bursts.some(burst => burst.x === 0)).toBe(false);
    });
});

describe('touch pool wraparound', () => {
    test('a touch beyond MAX_POINTS distinct locations overwrites the oldest slot', () => {
        for (let i = 0; i < INTERACTION_MAX_POINTS; i++) {
            animation_module.registerTouch(0, { x: i * 10, y: 0, z: 0 }, [metaball(i * 10 + 0.1, 0, 0, 1.2)], CAMERA_POSITION);
        }
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(INTERACTION_MAX_POINTS);

        const extra_x = INTERACTION_MAX_POINTS * 10;
        animation_module.registerTouch(0, { x: extra_x, y: 0, z: 0 }, [metaball(extra_x + 0.1, 0, 0, 1.2)], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(INTERACTION_MAX_POINTS);
        expect(points.some(point => point.x === extra_x)).toBe(true);
        expect(points.some(point => point.x === 0)).toBe(false);
    });
});
