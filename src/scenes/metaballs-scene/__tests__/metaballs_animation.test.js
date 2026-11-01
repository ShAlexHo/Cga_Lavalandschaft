import { describe, test, expect } from 'vitest';
import { computeBalls, computeFlowBalls, flowDistance, BALL_PATHS } from '../metaballs_animation.js';
import {
    MAX_BALL_COUNT, BOX_HALF_EXTENT, BALL_STRENGTH, STRENGTH_VARIANCE, SUBTRACT_RANGE, DEFAULTS,
    EFFECT_SCALE, VOLCANO_DEFAULTS, FLOW_SPEED, FLOW_MAX_DISTANCE, FLOW_END_DEPTH, FLOW_GROW_DURATION,
} from '../config.js';
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

    test('planar balls all share the field’s central height and still move across it', () => {
        const planar = computeBalls(7.3, { ...SETTINGS, count: MAX_BALL_COUNT }, { planar: true });
        planar.forEach(ball => expect(ball.y).toBe(0.5));
        expect(planar.map(ball => ball.x)).toEqual(computeBalls(7.3, { ...SETTINGS, count: MAX_BALL_COUNT }).map(ball => ball.x));
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

describe('computeFlowBalls', () => {
    const FLOW_SETTINGS = { count: VOLCANO_DEFAULTS.count, spawn_height: VOLCANO_DEFAULTS.spawn_height, flow_slope: VOLCANO_DEFAULTS.flow_slope };
    const FLOW_DISTANCE = flowDistance(FLOW_SETTINGS);
    const FLOW_DURATION = FLOW_DISTANCE * Math.hypot(1, FLOW_SETTINGS.flow_slope) / FLOW_SPEED;

    function toWorld(ball) {
        return { x: EFFECT_SCALE * (2 * ball.x - 1), y: EFFECT_SCALE * (2 * ball.y - 1), z: EFFECT_SCALE * (2 * ball.z - 1) };
    }

    function firstBallAt(time, settings = FLOW_SETTINGS) {
        return toWorld(computeFlowBalls(time, settings)[0]);
    }

    function lineHeight(x, { spawn_height, flow_slope }) {
        return spawn_height - flow_slope * x;
    }

    test('returns as many balls as requested, deterministically, moving over time', () => {
        expect(computeFlowBalls(0, { ...FLOW_SETTINGS, count: 5 })).toHaveLength(5);
        expect(computeFlowBalls(3.3, FLOW_SETTINGS)).toEqual(computeFlowBalls(3.3, FLOW_SETTINGS));
        expect(computeFlowBalls(1, FLOW_SETTINGS)).not.toEqual(computeFlowBalls(0, FLOW_SETTINGS));
    });

    test('a ball starts at the spawn height above the crater’s centre, invisibly small, and grows as it leaves', () => {
        const [first] = computeFlowBalls(0, FLOW_SETTINGS);
        expect(toWorld(first)).toMatchObject({ x: expect.closeTo(0, 9), y: expect.closeTo(FLOW_SETTINGS.spawn_height, 9), z: expect.closeTo(0, 9) });
        expect(first.strength).toBe(0);

        const [leaving] = computeFlowBalls(FLOW_GROW_DURATION, FLOW_SETTINGS);
        expect(leaving.strength).toBeCloseTo(BALL_PATHS[0].strength, 9);
    });

    test('every ball stays on one straight line with the chosen slope, in one direction, also under the ground', () => {
        for (const flow_slope of [0, 0.2, 0.45, 1.5]) {
            const settings = { ...FLOW_SETTINGS, count: MAX_BALL_COUNT, flow_slope };
            for (const time of [0, 2.5, 7, 31]) {
                computeFlowBalls(time, settings).forEach(ball => {
                    const { x, y, z } = toWorld(ball);
                    expect(x).toBeGreaterThanOrEqual(-1e-9);
                    expect(x).toBeLessThanOrEqual(flowDistance(settings) + 1e-9);
                    expect(y).toBeCloseTo(lineHeight(x, settings), 9);
                    expect(z).toBeCloseTo(0, 9);
                });
            }
        }
    });

    test('moves at one constant speed along the line', () => {
        const step = 0.25;
        for (let time = 0; time + step < FLOW_DURATION; time += step) {
            const from = firstBallAt(time);
            const to = firstBallAt(time + step);
            expect(Math.hypot(to.x - from.x, to.y - from.y)).toBeCloseTo(FLOW_SPEED * step, 9);
        }
    });

    test('goes on through the ground until it is deep enough below it, then emerges again at the crater', () => {
        const before_end = firstBallAt(0.99999 * FLOW_DURATION);
        expect(before_end.y).toBeCloseTo(-FLOW_END_DEPTH, 3);
        expect(computeFlowBalls(0.99999 * FLOW_DURATION, FLOW_SETTINGS)[0].strength).toBe(BALL_PATHS[0].strength);
        expect(firstBallAt(FLOW_DURATION).x).toBeCloseTo(0, 9);

        expect(flowDistance({ spawn_height: 6, flow_slope: 1 })).toBe(6 + FLOW_END_DEPTH);
        expect(flowDistance({ spawn_height: 6, flow_slope: 0.1 })).toBe(FLOW_MAX_DISTANCE);
        expect(flowDistance({ spawn_height: 6, flow_slope: 0 })).toBe(FLOW_MAX_DISTANCE);
    });

    test('at that depth no ball’s field reaches up to the ground any more, so it vanishes unseen', () => {
        const radius_scale = MAIN_SCENE_DEFAULTS.metaballRadius;
        BALL_PATHS.forEach(({ strength, subtract }) => {
            const field_reach = EFFECT_SCALE * 2 * radius_scale * Math.sqrt(strength / subtract);
            expect(field_reach).toBeLessThan(FLOW_END_DEPTH);
        });
    });

    test('spreads the balls evenly along the line, close enough for a continuous stream', () => {
        const spacing = FLOW_SPEED * FLOW_DURATION / FLOW_SETTINGS.count;
        const smallest_radius = Math.min(...BALL_PATHS.map(path => localRadius(path, MAIN_SCENE_DEFAULTS.metaballIsolation, MAIN_SCENE_DEFAULTS.metaballRadius)));
        expect(spacing).toBeLessThan(2 * smallest_radius * EFFECT_SCALE);
    });
});
