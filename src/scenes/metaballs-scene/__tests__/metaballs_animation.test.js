import { describe, test, expect } from 'vitest';
import { computeBalls, BALL_PATHS } from '../metaballs_animation.js';
import { MAX_BALL_COUNT, BOX_HALF_EXTENT, BALL_STRENGTH, STRENGTH_VARIANCE, SUBTRACT_RANGE, DEFAULTS } from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';

const SETTINGS = { count: DEFAULTS.count, spread: DEFAULTS.spread, subtract_scale: DEFAULTS.subtract_scale };

function localRadius(ball, isolation, radius_scale) {
    return 2 * radius_scale * Math.sqrt(ball.strength / (isolation + ball.subtract));
}

describe('computeBalls', () => {
    test('returns as many balls as requested, up to the maximum', () => {
        expect(computeBalls(0, { ...SETTINGS, count: 3 })).toHaveLength(3);
        expect(computeBalls(0, { ...SETTINGS, count: MAX_BALL_COUNT })).toHaveLength(MAX_BALL_COUNT);
    });

    test('places the balls in field space around its center, all at the center without spread', () => {
        computeBalls(5, { ...SETTINGS, spread: 0 }).forEach(ball => {
            expect(ball).toMatchObject({ x: 0.5, y: 0.5, z: 0.5 });
        });
    });

    test('is deterministic and moves over time', () => {
        expect(computeBalls(12.5, SETTINGS)).toEqual(computeBalls(12.5, SETTINGS));
        expect(computeBalls(10, SETTINGS)).not.toEqual(computeBalls(0, SETTINGS));
    });

    test('scales every ball’s field cutoff by subtract_scale', () => {
        const unscaled = computeBalls(0, SETTINGS);
        const doubled = computeBalls(0, { ...SETTINGS, subtract_scale: 2 });
        doubled.forEach((ball, i) => expect(ball.subtract).toBeCloseTo(unscaled[i].subtract * 2));
    });

    test('varies strength and cutoff per ball within the main scene’s ranges', () => {
        BALL_PATHS.forEach(({ strength, subtract }) => {
            expect(strength).toBeGreaterThanOrEqual(BALL_STRENGTH * STRENGTH_VARIANCE.min);
            expect(strength).toBeLessThanOrEqual(BALL_STRENGTH * STRENGTH_VARIANCE.max);
            expect(subtract).toBeGreaterThanOrEqual(SUBTRACT_RANGE.min);
            expect(subtract).toBeLessThanOrEqual(SUBTRACT_RANGE.max);
        });
        expect(new Set(BALL_PATHS.map(path => path.strength)).size).toBe(MAX_BALL_COUNT);
    });

    test('keeps every ball inside the raymarch box at the widest spread and largest GUI radius', () => {
        for (const time of [0, 7.3, 50, 400]) {
            computeBalls(time, { count: MAX_BALL_COUNT, spread: 2, subtract_scale: 1 }).forEach(ball => {
                const reach = localRadius(ball, MAIN_SCENE_DEFAULTS.metaballIsolation, 3);
                for (const coordinate of [ball.x, ball.y, ball.z]) {
                    expect(Math.abs(2 * coordinate - 1) + reach).toBeLessThan(BOX_HALF_EXTENT);
                }
            });
        }
    });
});
