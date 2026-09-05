import { describe, test, expect, beforeEach } from 'vitest';
import {
    INTERACTION_DECAY_DURATION, INTERACTION_BUMP_RADIUS, INTERACTION_MAX_POINTS,
    INTERACTION_DWELL_POOL_SIZE,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';
import { importFreshModule } from '../../test-utils/reimport.js';

// Placed so the camera's line of sight through any hit_point on the z=0 plane runs straight along
// -z - keeps the view-ray-distance math easy to reason about across the removal tests below.
const CAMERA_POSITION = { x: 0, y: 0, z: 10 };

let animation_module;
beforeEach(async () => {
    animation_module = await importFreshModule(() => import('../interaction_animation.js'));
});

describe('settings (default values)', () => {
    test('enabled matches DEFAULT_SETTINGS.interactionMode', () => {
        expect(animation_module.settings.enabled).toBe(DEFAULT_SETTINGS.interactionMode);
    });
});

describe('registerTouch', () => {
    test('does not create a touch point when no metaball is within the proximity threshold', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [{ x: 10, y: 10, z: 10, radius: 0 }], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(0);
    });

    test('creates a touch point capped at the raw center distance to the selected metaball', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 1, y: 0, z: 0, radius: 0 };
        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(1);
        expect(points[0]).toMatchObject({ x: 0, y: 0, z: 0 });
        expect(points[0].strength).toBeCloseTo(1.0, 9);
    });

    test('a touch right at the edge of a large metaball registers just as reliably as one at its center', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        // Center is far away (4 units), but its own radius (3.9) reaches almost exactly to the hit point -
        // gating passes because the *surface* is close, even though the raw center distance (4) alone
        // would still be well within the base gating threshold anyway. The cap itself is still the raw
        // center distance, not the (near-zero) surface distance that only gates whether this registers.
        const metaball = { x: 4, y: 0, z: 0, radius: 3.9 };
        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(1);
        expect(points[0].strength).toBeCloseTo(4.0, 9);
    });

    test('a touch well inside a metaball\'s own radius still gets a real (non-zero) push, capped at the raw center distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 1, y: 0, z: 0, radius: 5 }; // radius far exceeds the center distance - trivially gated
        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].strength).toBeCloseTo(1.0, 9);
    });

    test('selects the metaball with the nearest surface among several candidates, but caps at its raw center distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        animation_module.registerTouch(0, hit_point, [
            { x: 1.5, y: 0, z: 0, radius: 0 }, // surface distance 1.5
            { x: 2, y: 0, z: 0, radius: 1.6 }, // surface distance 0.4 - nearer despite the larger center distance
        ], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].strength).toBeCloseTo(2.0, 9); // raw center distance of the selected (2nd) metaball
    });

    test('the gating distance grows the longer the mouse dwells at the same spot without registering', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 8, y: 0, z: 0, radius: 0 }; // surface distance 8, beyond the base threshold (6)

        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(0); // too far yet, at the base threshold

        animation_module.registerTouch(1.0, hit_point, [metaball], CAMERA_POSITION); // threshold has grown to 6 + 1.0 * 3 = 9
        const points = animation_module.stepInteractionAnimation(1.0);
        expect(points).toHaveLength(1);
        expect(points[0].strength).toBeCloseTo(8.0, 9);
    });

    test('a genuinely different spot starts its own dwell at the base threshold', () => {
        const first_metaball = { x: 8, y: 0, z: 0, radius: 0 };
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [first_metaball], CAMERA_POSITION);

        // A different spot, far beyond INTERACTION_DWELL_POSITION_TOLERANCE - its own fresh dwell, at the base.
        const second_metaball = { x: 108, y: 0, z: 0, radius: 0 };
        animation_module.registerTouch(1.0, { x: 100, y: 0, z: 0 }, [second_metaball], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(1.0)).toHaveLength(0); // 8 > base threshold (6)
    });

    test('revisiting an earlier spot keeps growing its own threshold instead of starting over', () => {
        const spot_a = { x: 0, y: 0, z: 0 };
        const metaball_a = { x: 8, y: 0, z: 0, radius: 0 }; // needs a threshold of at least 8

        animation_module.registerTouch(0, spot_a, [metaball_a], CAMERA_POSITION); // fails; spot_a's own dwell starts at t=0
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(0);

        // Detour to a distant, unrelated spot in between - does not touch spot_a's own dwell record.
        animation_module.registerTouch(0.5, { x: 100, y: 0, z: 0 }, [{ x: 200, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);

        // Back at spot_a: the real time since it was FIRST tried (1.0s) still counts, even though the
        // touch wandered elsewhere in between - threshold is now 6 + 1.0 * 3 = 9, enough for the 8-unit gap.
        animation_module.registerTouch(1.0, spot_a, [metaball_a], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(1.0);
        expect(points).toHaveLength(1);
        expect(points[0].strength).toBeCloseTo(8.0, 9);
    });

    test('dwell pool wraparound: a spot beyond INTERACTION_DWELL_POOL_SIZE distinct failed attempts forgets the oldest one', () => {
        for (let i = 0; i < INTERACTION_DWELL_POOL_SIZE; i++) {
            animation_module.registerTouch(0, { x: i * 20, y: 0, z: 0 }, [{ x: i * 20 + 8, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        }
        // One more distinct failed attempt evicts the oldest record (the very first, at x=0).
        const evictor_x = INTERACTION_DWELL_POOL_SIZE * 20;
        animation_module.registerTouch(0, { x: evictor_x, y: 0, z: 0 }, [{ x: evictor_x + 8, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);

        // Revisiting the very first spot later now starts a brand-new dwell, since its record was evicted.
        animation_module.registerTouch(1.0, { x: 0, y: 0, z: 0 }, [{ x: 8, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(1.0)).toHaveLength(0); // fresh dwell at t=1.0, threshold still base (6) < 8
    });

    test('resetDwellTracking() clears the accumulated dwell time for a fresh mouse press', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 8, y: 0, z: 0, radius: 0 };

        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION); // fails, but starts the dwell timer at t=0
        animation_module.resetDwellTracking(); // e.g. the mouse was released and pressed again

        // Without the reset, a huge elapsed time would inherit the old dwell duration and pass trivially.
        animation_module.registerTouch(100, hit_point, [metaball], CAMERA_POSITION);
        expect(animation_module.stepInteractionAnimation(100)).toHaveLength(0);
    });

    test('a repeated touch near an existing point refreshes it instead of creating a new one', () => {
        const metaball = { x: 1, y: 0, z: 0, radius: 0 };
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [metaball], CAMERA_POSITION);
        animation_module.registerTouch(0.5, { x: 0.1, y: 0, z: 0 }, [metaball], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0.5);
        expect(points).toHaveLength(1);
        expect(points[0].radius).toBeCloseTo(INTERACTION_BUMP_RADIUS, 5); // still full radius - the touch timer was refreshed
    });
});

describe('registerTouch (metaball removal)', () => {
    test('removes a metaball that visually appears at the center, even if far away in raw 3D distance', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        // 5 units away in raw distance, but it sits exactly on the camera's line of sight through
        // hit_point (straight between the camera and the hit point) - visually right where the user clicked.
        const metaball = { x: 0, y: 0, z: 5, radius: 0 };
        const removed = animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);
        expect(removed).toEqual({ x: 0, y: 0, z: 5 });
    });

    test('does not remove a metaball that is genuinely off to the side of the line of sight', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 5, y: 0, z: 0, radius: 0 };
        const removed = animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);
        expect(removed).toBeNull();
    });

    test('a bump can still register even when nothing is close enough to the line of sight to remove', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 1, y: 0, z: 0, radius: 0 }; // gates a bump, but not close enough to the view ray to pop
        const removed = animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);
        expect(removed).toBeNull();
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(1);
    });

    test('keeps returning the removal signal even while just refreshing an existing bump point', () => {
        const hit_point = { x: 0, y: 0, z: 0 };
        const metaball = { x: 0, y: 0, z: 0.1, radius: 0 }; // on the line of sight, within the remove threshold
        animation_module.registerTouch(0, hit_point, [metaball], CAMERA_POSITION);
        const removed = animation_module.registerTouch(0.05, hit_point, [metaball], CAMERA_POSITION); // same spot, refreshes
        expect(removed).toEqual({ x: 0, y: 0, z: 0.1 });
    });

    test('returns null when there are no metaballs at all', () => {
        expect(animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [], CAMERA_POSITION)).toBeNull();
    });
});

describe('stepInteractionAnimation (radius decay, outside-in)', () => {
    test('starts at (approximately) the full bump radius right after the touch', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [{ x: 1, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(0);
        expect(points[0].radius).toBeCloseTo(INTERACTION_BUMP_RADIUS, 5);
    });

    test('the radius shrinks partway through the decay duration, while strength stays at the full height cap', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [{ x: 1, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(INTERACTION_DECAY_DURATION / 2);
        expect(points[0].radius).toBeGreaterThan(0);
        expect(points[0].radius).toBeLessThan(INTERACTION_BUMP_RADIUS);
        expect(points[0].strength).toBeCloseTo(1.0, 9);
    });

    test('is fully evicted once INTERACTION_DECAY_DURATION has elapsed since the last touch', () => {
        animation_module.registerTouch(0, { x: 0, y: 0, z: 0 }, [{ x: 1, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        const points = animation_module.stepInteractionAnimation(INTERACTION_DECAY_DURATION + 0.01);
        expect(points).toHaveLength(0);
    });
});

describe('touch pool wraparound', () => {
    test('a touch beyond MAX_POINTS distinct locations overwrites the oldest slot', () => {
        for (let i = 0; i < INTERACTION_MAX_POINTS; i++) {
            animation_module.registerTouch(0, { x: i * 10, y: 0, z: 0 }, [{ x: i * 10 + 0.1, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);
        }
        expect(animation_module.stepInteractionAnimation(0)).toHaveLength(INTERACTION_MAX_POINTS);

        const extra_x = INTERACTION_MAX_POINTS * 10;
        animation_module.registerTouch(0, { x: extra_x, y: 0, z: 0 }, [{ x: extra_x + 0.1, y: 0, z: 0, radius: 0 }], CAMERA_POSITION);

        const points = animation_module.stepInteractionAnimation(0);
        expect(points).toHaveLength(INTERACTION_MAX_POINTS);
        expect(points.some(point => point.x === extra_x)).toBe(true);
        expect(points.some(point => point.x === 0)).toBe(false);
    });
});
