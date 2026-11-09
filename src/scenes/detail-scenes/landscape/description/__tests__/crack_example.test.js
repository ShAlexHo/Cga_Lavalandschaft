import { describe, test, expect } from 'vitest';
import { crackValue, crackDepth, crackCurves, CRACK_SHARPNESS_EXPONENT, VOLCANO_CRACK_THRESHOLD, DISPLACEMENT_SCALE } from '../crack_example.js';
import MAIN_SCENE_DEFAULTS from '../../../../main-scene/default_settings.json';

describe('crack example', () => {
    test('uses the volcano’s displacement settings', () => {
        expect(DISPLACEMENT_SCALE).toBe(MAIN_SCENE_DEFAULTS.volcanoDisplacementScale);
        expect(crackValue(0.5)).toBeCloseTo(0.5 ** CRACK_SHARPNESS_EXPONENT, 12);
    });

    test('the surface only sinks where the crack value lies below the threshold, by at most a · t', () => {
        expect(crackDepth(1)).toBe(0);
        expect(crackDepth(-1)).toBe(0);
        expect(crackDepth(0)).toBeCloseTo(DISPLACEMENT_SCALE * VOLCANO_CRACK_THRESHOLD, 12);
        expect(crackDepth(0.01)).toBeGreaterThan(crackDepth(0.2));
    });

    test('the curves span the requested range and the sinking never rises above the surface', () => {
        const { noise, crack, depth } = crackCurves(8, 60);
        for (const points of [noise, crack, depth]) expect(points.at(-1).x).toBe(8);
        expect(Math.max(...depth.map(({ y }) => y))).toBeLessThanOrEqual(0);
        expect(Math.min(...crack.map(({ y }) => y))).toBeGreaterThanOrEqual(0);
    });
});
