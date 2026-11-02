import { describe, test, expect } from 'vitest';
import { computeFlowBalls, flowDistance, flowTiming, flowAngle, sectorOffset } from '../flow_animation.js';
import { BALL_PATHS } from '../metaballs_animation.js';
import {
    MAX_BALL_COUNT, EFFECT_SCALE, FLOW_SPEED, FLOW_MAX_DISTANCE, FLOW_END_DEPTH, FLOW_GROW_DURATION, FLOW_SLOWING_DISTANCE, FLOW_SECTOR_SPREAD,
} from '../config.js';
import { VOLCANO_DEFAULTS } from '../../volcano-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';

function localRadius(ball, isolation, radius_scale) {
    return 2 * radius_scale * Math.sqrt(ball.strength / (isolation + ball.subtract));
}

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

describe('computeFlowBalls – in all directions', () => {
    const RADIAL_SETTINGS = { count: MAX_BALL_COUNT, spawn_height: VOLCANO_DEFAULTS.spawn_height, flow_slope: VOLCANO_DEFAULTS.flow_slope };

    function toWorld(ball) {
        return { x: EFFECT_SCALE * (2 * ball.x - 1), y: EFFECT_SCALE * (2 * ball.y - 1), z: EFFECT_SCALE * (2 * ball.z - 1) };
    }

    test('moves every ball down the same slope, each in its own direction', () => {
        const radial = computeFlowBalls(4.2, RADIAL_SETTINGS, { radial: true });
        const straight = computeFlowBalls(4.2, RADIAL_SETTINGS);
        radial.forEach((ball, i) => {
            const { x, y, z } = toWorld(ball);
            expect(Math.hypot(x, z)).toBeCloseTo(toWorld(straight[i]).x, 9);
            expect(y).toBeCloseTo(toWorld(straight[i]).y, 9);
            expect(Math.atan2(z, x)).toBeCloseTo(Math.atan2(Math.sin(BALL_PATHS[i].flow_angle), Math.cos(BALL_PATHS[i].flow_angle)), 9);
        });
    });

    test('spreads the directions around the whole volcano, every quarter getting its share', () => {
        const quarters = [0, 0, 0, 0];
        BALL_PATHS.forEach(({ flow_angle }) => {
            expect(flow_angle).toBeGreaterThanOrEqual(0);
            expect(flow_angle).toBeLessThan(2 * Math.PI);
            quarters[Math.floor(flow_angle / (Math.PI / 2))]++;
        });
        quarters.forEach(share => expect(share).toBeGreaterThanOrEqual(MAX_BALL_COUNT / 4 - 1));
    });
});

describe('computeFlowBalls – slowing down', () => {
    const SETTINGS = { count: 1, spawn_height: 5.4, flow_slope: 0.51 };
    const ABOVE_GROUND_LENGTH = SETTINGS.spawn_height / SETTINGS.flow_slope * Math.hypot(1, SETTINGS.flow_slope);

    function pathLengthAt(age, slow_down) {
        const [ball] = computeFlowBalls(age, { ...SETTINGS, slow_down });
        const x = EFFECT_SCALE * (2 * ball.x - 1);
        const y = EFFECT_SCALE * (2 * ball.y - 1);
        return Math.hypot(x, SETTINGS.spawn_height - y);
    }

    function speedAt(path_length) {
        const timing = flowTiming({ ...SETTINGS, slow_down: true });
        let age = 0;
        while (timing.travelledLength(age) < path_length) age += 0.001;
        return (timing.travelledLength(age + 0.01) - timing.travelledLength(age)) / 0.01;
    }

    test('starts as fast as the constant flow, then gets slower and slower on its way over the volcano', () => {
        expect(speedAt(0)).toBeCloseTo(FLOW_SPEED, 2);
        const speeds = [0.25, 0.5, 0.9].map(fraction => speedAt(fraction * ABOVE_GROUND_LENGTH));
        expect(speeds[0]).toBeLessThan(FLOW_SPEED);
        expect(speeds[1]).toBeLessThan(speeds[0]);
        expect(speeds[2]).toBeLessThan(speeds[1]);
        expect(speedAt(ABOVE_GROUND_LENGTH / 2)).toBeCloseTo(FLOW_SPEED / (1 + ABOVE_GROUND_LENGTH / 2 / FLOW_SLOWING_DISTANCE), 2);
    });

    test('so it stays on the volcano for much longer, and stays on the same straight line', () => {
        const constant = flowTiming({ ...SETTINGS, slow_down: false });
        const slowing = flowTiming({ ...SETTINGS, slow_down: true });
        const timeAboveGround = timing => {
            let age = 0;
            while (timing.travelledLength(age) < ABOVE_GROUND_LENGTH) age += 0.01;
            return age;
        };
        expect(timeAboveGround(slowing)).toBeGreaterThan(3 * timeAboveGround(constant));

        for (const age of [0.5, 3, 9, 20]) {
            const [ball] = computeFlowBalls(age, { ...SETTINGS, slow_down: true });
            const x = EFFECT_SCALE * (2 * ball.x - 1);
            expect(EFFECT_SCALE * (2 * ball.y - 1)).toBeCloseTo(SETTINGS.spawn_height - SETTINGS.flow_slope * x, 9);
        }
    });

    test('once under the ground, unseen, it goes on at the normal speed down to the same end depth', () => {
        const timing = flowTiming({ ...SETTINGS, slow_down: true });
        const age_at_end = timing.duration - 0.5;
        expect(pathLengthAt(age_at_end, true) - pathLengthAt(age_at_end - 1, true)).toBeCloseTo(FLOW_SPEED, 9);

        const [deepest] = computeFlowBalls(timing.duration * 0.99999, { ...SETTINGS, slow_down: true });
        expect(EFFECT_SCALE * (2 * deepest.y - 1)).toBeCloseTo(-FLOW_END_DEPTH, 3);
    });

    test('without slowing down, it keeps the constant speed all the way', () => {
        expect(pathLengthAt(3, false) - pathLengthAt(2, false)).toBeCloseTo(FLOW_SPEED, 9);
        expect(pathLengthAt(9, false) - pathLengthAt(8, false)).toBeCloseTo(FLOW_SPEED, 9);
    });
});

describe('flowAngle – sectors', () => {
    function angleDistance(angle_a, angle_b) {
        const difference = ((angle_a - angle_b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        return Math.abs(difference);
    }

    function sectorOffsets(sector_count) {
        const sector_width = 2 * Math.PI / sector_count;
        return Array.from({ length: sector_count }, (_, sector) => BALL_PATHS
            .map((path, i) => ({ i, angle: flowAngle(i, path, { sectors_enabled: true, sector_count }) }))
            .filter(({ i }) => i % sector_count === sector)
            .map(({ angle }) => (angle - sector * sector_width) / sector_width));
    }

    test('without sectors, keeps every ball’s own direction around the whole volcano', () => {
        BALL_PATHS.forEach((path, i) => expect(flowAngle(i, path, { sectors_enabled: false, sector_count: 6 })).toBe(path.flow_angle));
    });

    test('like the landscape, deals the balls out to the sectors in turn', () => {
        const sector_count = 6;
        const sector_width = 2 * Math.PI / sector_count;
        BALL_PATHS.forEach((path, i) => {
            const angle = flowAngle(i, path, { sectors_enabled: true, sector_count });
            expect(angle).toBeCloseTo((i % sector_count) * sector_width + FLOW_SECTOR_SPREAD * sector_width * sectorOffset(i % sector_count, Math.floor(i / sector_count)), 12);
        });
    });

    for (const sector_count of [2, 3, 4, 6]) {
        test(`with ${sector_count} sectors, every sector’s balls scatter around its own centre, on both sides, tightly enough to be seen as a stream`, () => {
            sectorOffsets(sector_count).forEach(offsets => {
                const mean = offsets.reduce((sum, offset) => sum + offset, 0) / offsets.length;
                const deviation = Math.sqrt(offsets.reduce((sum, offset) => sum + (offset - mean) ** 2, 0) / offsets.length);
                expect(Math.abs(mean)).toBeLessThan(0.25);
                expect(offsets.some(offset => offset > 0)).toBe(true);
                expect(offsets.some(offset => offset < 0)).toBe(true);
                expect(deviation).toBeGreaterThan(0.5 * FLOW_SECTOR_SPREAD);
                expect(deviation).toBeLessThan(1.5 * FLOW_SECTOR_SPREAD);
            });
        });
    }

    test('does not sweep to one side over time: consecutive balls of a sector change sides', () => {
        sectorOffsets(3).forEach(offsets => {
            const side_changes = offsets.slice(1).filter((offset, j) => Math.sign(offset) !== Math.sign(offsets[j])).length;
            expect(side_changes).toBeGreaterThanOrEqual(offsets.length / 2 - 1);
        });
    });

    test('most balls lie closer to their own sector’s centre than to any other', () => {
        const sector_count = 4;
        const sector_width = 2 * Math.PI / sector_count;
        const own_closest = BALL_PATHS.filter((path, i) => {
            const angle = flowAngle(i, path, { sectors_enabled: true, sector_count });
            const own = angleDistance(angle, (i % sector_count) * sector_width);
            return own <= sector_width / 2;
        }).length;
        expect(own_closest / BALL_PATHS.length).toBeGreaterThan(0.75);
    });

    test('computeFlowBalls sends the balls in their sector directions', () => {
        const settings = { count: MAX_BALL_COUNT, spawn_height: 5.4, flow_slope: 0.51, sectors_enabled: true, sector_count: 3 };
        computeFlowBalls(6, settings, { radial: true }).forEach((ball, i) => {
            const x = 2 * ball.x - 1;
            const z = 2 * ball.z - 1;
            if (Math.hypot(x, z) < 1e-9) return;
            expect(angleDistance(Math.atan2(z, x), flowAngle(i, BALL_PATHS[i], settings))).toBeLessThan(1e-9);
        });
    });
});
