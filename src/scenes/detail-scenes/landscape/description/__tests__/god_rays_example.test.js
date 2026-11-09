import { describe, test, expect } from 'vitest';
import { createMask, sampleTowardsLight, WEIGHT, DECAY } from '../god_rays_example.js';
import { GOD_RAYS_SAMPLE_COUNT } from '../../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../../main-scene/default_settings.json';

const SUN = { x: 0, y: 0, radius: 1 };
const COVER = [{ x: -2, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: -2, y: 2 }];

describe('god rays example', () => {
    test('uses the god ray settings of the scene', () => {
        expect(WEIGHT).toBe(MAIN_SCENE_DEFAULTS.godRaysWeight);
        expect(DECAY).toBe(MAIN_SCENE_DEFAULTS.godRaysDecay);
    });

    test('the mask is white only on the part of the sun that is not covered', () => {
        const mask = createMask(SUN, COVER);
        expect(mask({ x: 0, y: -0.5 })).toBe(1);
        expect(mask({ x: 0, y: 0.5 })).toBe(0);
        expect(mask({ x: 3, y: -3 })).toBe(0);
    });

    test('a pixel whose path crosses the covered half of the sun stays darker than one with a free path', () => {
        const mask = createMask(SUN, COVER);
        const free = sampleTowardsLight({ x: 0, y: -3 }, SUN, mask);
        const covered = sampleTowardsLight({ x: 0, y: 3 }, SUN, mask);
        expect(free.samples).toHaveLength(GOD_RAYS_SAMPLE_COUNT);
        expect(free.samples[1].weight).toBeCloseTo(WEIGHT * DECAY, 12);
        expect(covered.brightness).toBeLessThan(free.brightness);
    });
});
