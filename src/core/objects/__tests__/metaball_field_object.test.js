import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeScene } from '../../test-utils/three_mocks.js';

vi.mock('../../geometry/metaball_geometry.js', () => ({
    createMetaballGeometry: vi.fn((scene, material) => {
        const effect = { material, position: { x: 0, y: 0, z: 0 }, matrixWorld: {} };
        scene.add(effect);
        return effect;
    }),
}));

vi.mock('../../rendering/metaball_material.js', () => ({
    createMetaballMaterial: vi.fn(() => ({
        uniforms: {
            u_color_hot: { value: makeColor('a01500') },
            u_color_cool: { value: makeColor('7c3027') },
            u_glow_color: { value: makeColor('ff3f00') },
            u_noise_color_1: { value: makeColor('7c3027') },
            u_noise_color_2: { value: makeColor('ea6927') },
            u_glow_enabled: { value: 1.0 },
            u_noise_enabled: { value: 1.0 },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
            u_isolation: { value: 50 },
        },
    })),
    updateMetaballLight: vi.fn(),
    updateMetaballBalls: vi.fn(),
}));

vi.mock('../../animation/metaball_animation.js', () => {
    const settings = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: 500, flow_z_radius: 11 };
    return {
        settings,
        getActiveBalls: vi.fn(() => []),
        stepMetaballAnimation: vi.fn(),
        getEruptionIntensity: vi.fn(() => 1.0),
    };
});

import { createMetaballField } from '../metaball_field_object.js';
import { createMetaballGeometry } from '../../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls } from '../../rendering/metaball_material.js';
import { settings as mock_settings, stepMetaballAnimation, getEruptionIntensity } from '../../animation/metaball_animation.js';

const DEFAULT_SETTINGS = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: 500, flow_z_radius: 11 };

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
});

describe('createMetaballField', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const field = createMetaballField(scene);
        expect(createMetaballMaterial).toHaveBeenCalledTimes(1);
        expect(createMetaballGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(field.effect);
    });

    test('update() uploads balls to the shader only when the animation step returns balls', () => {
        const field = createMetaballField(makeScene());
        const camera = {};

        stepMetaballAnimation.mockReturnValueOnce(null);
        field.update(0, camera);
        expect(updateMetaballBalls).not.toHaveBeenCalled();

        const balls = [{ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 }];
        stepMetaballAnimation.mockReturnValueOnce(balls);
        field.update(1, camera);
        expect(updateMetaballBalls).toHaveBeenCalledWith(expect.any(Object), field.effect, balls, camera);
        expect(updateMetaballLight).toHaveBeenCalledWith(expect.any(Object), camera, 1);
    });

    test('isPaused/setPaused forward to the animation settings', () => {
        const field = createMetaballField(makeScene());
        expect(field.isPaused()).toBe(false);
        field.setPaused(true);
        expect(field.isPaused()).toBe(true);
        expect(mock_settings.paused).toBe(true);
    });

    test('getEruptionIntensity forwards to the animation module', () => {
        const field = createMetaballField(makeScene());
        getEruptionIntensity.mockReturnValueOnce(0.42);
        expect(field.getEruptionIntensity(7)).toBe(0.42);
        expect(getEruptionIntensity).toHaveBeenCalledWith(7);
    });

    test('setCount/setIsolation update state and the isolation uniform directly', () => {
        const field = createMetaballField(makeScene());

        field.setCount(250);
        expect(field.getCount()).toBe(250);

        field.setIsolation(77);
        expect(field.getIsolation()).toBe(77);
    });

    test('displacement toggle remembers the strength while disabled', () => {
        const field = createMetaballField(makeScene());
        expect(field.getDisplacementEnabled()).toBe(true);
        expect(field.getDisplacementStrength()).toBeCloseTo(0.00005, 9);

        field.setDisplacementEnabled(false);
        expect(field.getDisplacementEnabled()).toBe(false);
        expect(field.getDisplacementStrength()).toBe(0.0);

        field.setDisplacementEnabled(true);
        expect(field.getDisplacementEnabled()).toBe(true);
        expect(field.getDisplacementStrength()).toBeCloseTo(0.00005, 9);
    });

    test('color and noise getters/setters forward to the material uniforms', () => {
        const field = createMetaballField(makeScene());

        field.setColorHot('#111111');
        expect(field.getColorHot()).toBe('#111111');

        field.setNoiseColor1('#222222');
        expect(field.getNoiseColor1()).toBe('#222222');

        field.setGlowEnabled(false);
        expect(field.getGlowEnabled()).toBe(false);
    });
});
