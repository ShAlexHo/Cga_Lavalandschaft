import { describe, test, expect } from 'vitest';
import { flowLine, flankHeight, PROFILE_POINTS, SPAWN_HEIGHT, FLOW_SLOPE, EXAMPLE_FLOW } from '../volcano_example.js';
import { VOLCANO_PROFILE } from '../../../../main-scene/config.js';
import { VOLCANO_DEFAULTS } from '../../config.js';
import { MESH_SCALE } from '../../../metaballs/config.js';
import { computeFlowBalls, flowDistance } from '../../flow_animation.js';

const toWorld = field_coordinate => (field_coordinate - 0.5) * 2 * MESH_SCALE;

describe('volcano example', () => {
    test('uses the volcano profile and the flow defaults of the scene', () => {
        expect(PROFILE_POINTS).toBe(VOLCANO_PROFILE);
        expect(SPAWN_HEIGHT).toBe(VOLCANO_DEFAULTS.spawn_height);
        expect(FLOW_SLOPE).toBe(VOLCANO_DEFAULTS.flow_slope);
    });

    test('the line starts at the spawn height, crosses the ground and ends where the balls start again', () => {
        const { start, ground, end } = flowLine();
        expect(start).toEqual({ x: 0, y: SPAWN_HEIGHT });
        expect(ground.y).toBeCloseTo(0, 12);
        expect(end.x).toBeCloseTo(flowDistance(VOLCANO_DEFAULTS), 12);
        expect(end.y).toBeLessThan(0);
    });

    test('the example line has the default slope, starts just above the crater rim and dips into the volcano', () => {
        const [foot, rim] = PROFILE_POINTS;
        const line = flowLine(EXAMPLE_FLOW);
        expect(EXAMPLE_FLOW.flow_slope).toBe(FLOW_SLOPE);
        expect(line.heightAt(rim.x)).toBeGreaterThan(flankHeight(rim.x));
        expect(line.crossing.x).toBeGreaterThan(rim.x);
        expect(line.crossing.x).toBeLessThan(foot.x);
        expect(line.ball.x).toBeGreaterThan(line.crossing.x);
        expect(line.ball.y).toBeLessThan(flankHeight(line.ball.x));
    });

    test('the balls of the scene lie on the line y = m·x + b with m = −slope', () => {
        for (const ball of computeFlowBalls(3, VOLCANO_DEFAULTS)) {
            expect(toWorld(ball.y)).toBeCloseTo(SPAWN_HEIGHT - FLOW_SLOPE * toWorld(ball.x), 9);
        }
    });
});
