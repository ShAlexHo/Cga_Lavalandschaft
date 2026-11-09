import { describe, test, expect } from 'vitest';
import { particleLifetime, particleOpacity, emberGlow, lifetimeCurves, RISE_SPEED, EMBER_COOLING_TIME } from '../smoke_example.js';
import { SMOKE_LIFETIME, SMOKE_FADE_IN_END, SMOKE_FADE_OUT_START } from '../../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../../main-scene/default_settings.json';

describe('smoke example', () => {
    test('uses the smoke settings of the scene', () => {
        expect(RISE_SPEED).toBe(MAIN_SCENE_DEFAULTS.smokeRiseSpeed);
        expect(EMBER_COOLING_TIME).toBe(MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime);
        expect(particleLifetime()).toBeCloseTo(SMOKE_LIFETIME / RISE_SPEED, 9);
        expect(particleLifetime(1, 2 * RISE_SPEED)).toBeCloseTo(particleLifetime() / 2, 9);
    });

    test('a particle fades in, stays fully visible until the fade out starts and is gone at the end', () => {
        expect(particleOpacity(0)).toBe(0);
        expect(particleOpacity(SMOKE_FADE_IN_END)).toBe(1);
        expect(particleOpacity(SMOKE_FADE_OUT_START)).toBe(1);
        expect(particleOpacity(1)).toBe(0);
    });

    test('an ember glows fully at birth and is dark after the cooling time', () => {
        expect(emberGlow(0)).toBe(1);
        expect(emberGlow(EMBER_COOLING_TIME / particleLifetime())).toBeCloseTo(0, 12);
        expect(lifetimeCurves(100)).toHaveLength(101);
    });
});
