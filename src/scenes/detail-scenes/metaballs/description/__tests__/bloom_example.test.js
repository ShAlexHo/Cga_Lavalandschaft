import { describe, test, expect } from 'vitest';
import { bloomCurves, brightParts, sceneBrightness, BLOOM_THRESHOLD, BLOOM_STRENGTH } from '../bloom_example.js';
import MAIN_SCENE_DEFAULTS from '../../../../main-scene/default_settings.json';

describe('bloom example', () => {
    test('uses the bloom threshold and strength of the scene', () => {
        expect(BLOOM_THRESHOLD).toBe(MAIN_SCENE_DEFAULTS.bloomThreshold);
        expect(BLOOM_STRENGTH).toBe(MAIN_SCENE_DEFAULTS.bloomStrength);
    });

    test('only the parts above the threshold are kept', () => {
        expect(brightParts(sceneBrightness(0))).toBe(0);
        expect(brightParts(sceneBrightness(2.5))).toBe(sceneBrightness(2.5));
    });

    test('the glow spills onto the dark ground beside the lava', () => {
        const { original, glow, result } = bloomCurves(8, 40);
        const beside_lava = original.findIndex(({ x }) => x >= 1.2);
        expect(original[beside_lava].y).toBeLessThan(BLOOM_THRESHOLD);
        expect(glow[beside_lava].y).toBeGreaterThan(0.05);
        expect(result[beside_lava].y).toBeCloseTo(original[beside_lava].y + BLOOM_STRENGTH * glow[beside_lava].y);
        const far_away = original.findIndex(({ x }) => x >= 0);
        expect(glow[far_away].y).toBeLessThan(0.01);
    });
});
