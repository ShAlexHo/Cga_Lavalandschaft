import { describe, test, expect } from 'vitest';
import { ringBalls, isInside, contourSegments, INNER_RING_RADIUS, OUTER_RING_RADIUS, SPREAD_BALL_COUNT } from '../flow_spread_example.js';

const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

describe('flow spread example', () => {
    const inner = ringBalls(INNER_RING_RADIUS);
    const outer = ringBalls(OUTER_RING_RADIUS);
    const all = [...inner, ...outer];

    test('both rings hold the same number of balls in the same directions', () => {
        expect(inner).toHaveLength(SPREAD_BALL_COUNT);
        inner.forEach((ball, i) => expect(Math.atan2(ball.y, ball.x)).toBeCloseTo(Math.atan2(outer[i].y, outer[i].x), 12));
    });

    test('neighbouring balls close to the crater merge, the same balls further out stay separate', () => {
        expect(isInside(midpoint(inner[0], inner[1]), all)).toBe(true);
        expect(isInside(midpoint(outer[0], outer[1]), all)).toBe(false);
        for (const ball of outer) expect(isInside(ball, all)).toBe(true);
    });

    test('the outline is made of short segments around all balls', () => {
        expect(contourSegments(all, 8, 0.2).length).toBeGreaterThan(100);
    });
});
