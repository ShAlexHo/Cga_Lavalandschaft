import { describe, test, expect } from 'vitest';
import { fieldValue, isoContour } from '../metaball_field_contour.js';
import { THRESHOLD, FIRST_BALL, SECOND_BALL, TEST_POINT } from '../metaball_example.js';

describe('fieldValue', () => {
    test('adds up 1/r of every ball, as in the example of the description', () => {
        expect(fieldValue(TEST_POINT, [FIRST_BALL])).toBeCloseTo(1 / 1.5, 12);
        expect(fieldValue(TEST_POINT, [FIRST_BALL, SECOND_BALL])).toBeCloseTo(2 / 1.5, 12);
    });

    test('the test point lies outside a single ball, but inside the two merged ones', () => {
        expect(fieldValue(TEST_POINT, [FIRST_BALL])).toBeLessThan(THRESHOLD);
        expect(fieldValue(TEST_POINT, [FIRST_BALL, SECOND_BALL])).toBeGreaterThan(THRESHOLD);
    });
});

describe('isoContour', () => {
    test('a single ball is a circle with the radius 1/τ', () => {
        for (const point of isoContour([FIRST_BALL], THRESHOLD)) expect(Math.hypot(point.x, point.y)).toBeCloseTo(1 / THRESHOLD, 6);
    });

    test('every point of the merged contour lies on the isoline', () => {
        const contour = isoContour([FIRST_BALL, SECOND_BALL], THRESHOLD);
        expect(contour.length).toBeGreaterThan(100);
        for (const point of contour) expect(fieldValue(point, [FIRST_BALL, SECOND_BALL])).toBeCloseTo(THRESHOLD, 6);
    });

    test('the merged contour reaches from x = −2 to x = 5, as the sum 1/|x| + 1/|x − 3| = 0.7 predicts', () => {
        const xs = isoContour([FIRST_BALL, SECOND_BALL], THRESHOLD).map(point => point.x);
        expect(Math.min(...xs)).toBeCloseTo(-2, 6);
        expect(Math.max(...xs)).toBeCloseTo(5, 6);
    });
});
