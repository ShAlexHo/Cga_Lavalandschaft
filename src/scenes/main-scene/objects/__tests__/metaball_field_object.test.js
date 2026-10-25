import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeScene } from '../../test-utils/three_mocks.js';

vi.mock('../../geometry/metaball_geometry.js', () => ({
    createMetaballGeometry: vi.fn((scene, material) => {
        const effect = { material, position: { x: 0, y: 0, z: 0 }, isolation: 50 };
        scene.add(effect);
        return effect;
    }),
    ballToWorldPosition: vi.fn((ball, effect) => ({
        x: effect.position.x + 30 * (2 * ball.x - 1),
        y: effect.position.y + 30 * (2 * ball.y - 1),
        z: effect.position.z + 30 * (2 * ball.z - 1),
    })),
    ballToWorldRadius: vi.fn(() => 1.5),
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
        },
    })),
    updateMetaballLight: vi.fn(),
    updateMetaballBalls: vi.fn(),
    updateMetaballDisplacement: vi.fn(),
}));

vi.mock('../../animation/metaball_animation.js', () => {
    const settings = { count: 100, spread: 1.0, speed_factor: 0.003, sink_speed: 0.25, disappear_y: 0.25, paused: false, max_count: 500, flow_z_radius: 11 };
    return {
        settings,
        getActiveBalls: vi.fn(() => []),
        stepMetaballAnimation: vi.fn(),
        getEruptionIntensity: vi.fn(() => 1.0),
        getSpawnCount: vi.fn(() => 0),
        getWaveStartCount: vi.fn(() => 0),
    };
});

import { createMetaballField } from '../metaball_field_object.js';
import { createMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls, updateMetaballDisplacement } from '../../rendering/metaball_material.js';
import { settings as mock_settings, getActiveBalls, stepMetaballAnimation, getEruptionIntensity, getSpawnCount, getWaveStartCount } from '../../animation/metaball_animation.js';

const VOLCANO_POSITION = { x: 0, y: 0, z: 0 };
const NEAR_CAMERA = { position: { x: 20, y: 3, z: 0 } };

const DEFAULT_SETTINGS = { count: 100, spread: 1.0, speed_factor: 0.003, sink_speed: 0.25, disappear_y: 0.25, paused: false, max_count: 500, flow_z_radius: 11 };

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
});

describe('createMetaballField', () => {
    test('builds the geometry with a freshly created material and an initial (empty) rebuild', () => {
        const scene = makeScene();
        const field = createMetaballField(scene);
        expect(createMetaballMaterial).toHaveBeenCalledTimes(1);
        expect(createMetaballGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(field.effect);
        expect(updateMetaballBalls).toHaveBeenCalledWith(field.effect, [], null);
    });

    test('update() rebuilds only when the animation step returns balls', () => {
        const field = createMetaballField(makeScene());
        updateMetaballBalls.mockClear();

        stepMetaballAnimation.mockReturnValueOnce(null);
        field.update(0, NEAR_CAMERA, VOLCANO_POSITION);
        expect(updateMetaballBalls).not.toHaveBeenCalled();

        const balls = [{ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 }];
        stepMetaballAnimation.mockReturnValueOnce(balls);
        field.update(1, NEAR_CAMERA, VOLCANO_POSITION);
        expect(updateMetaballBalls).toHaveBeenCalledWith(field.effect, balls, NEAR_CAMERA);
        expect(updateMetaballLight).toHaveBeenCalledWith(expect.any(Object), NEAR_CAMERA, 1);
    });

    test('isPaused/setPaused forward to the animation settings', () => {
        const field = createMetaballField(makeScene());
        expect(field.isPaused()).toBe(false);
        field.setPaused(true);
        expect(field.isPaused()).toBe(true);
        expect(mock_settings.paused).toBe(true);
    });

    test('getActiveWorldPositions maps active balls through ballToWorldPosition/ballToWorldRadius using the field\'s effect, carrying subtract/isolation along', () => {
        const field = createMetaballField(makeScene());
        getActiveBalls.mockReturnValueOnce([{ x: 0.5, y: 0.5, z: 0.5, subtract: 30 }]);
        const positions = field.getActiveWorldPositions();
        expect(ballToWorldPosition).toHaveBeenCalledWith({ x: 0.5, y: 0.5, z: 0.5, subtract: 30 }, field.effect);
        expect(ballToWorldRadius).toHaveBeenCalledWith({ x: 0.5, y: 0.5, z: 0.5, subtract: 30 }, field.effect);
        expect(positions).toEqual([{ x: 0, y: 0, z: 0, radius: 1.5, subtract: 30, isolation: 50 }]);
    });

    test('squeezeNearestBall shrinks the active ball closest to the given world position, leaving others untouched', () => {
        const field = createMetaballField(makeScene());
        const near_ball = { x: 0.5, y: 0.5, z: 0.5, active: true, base_strength: 4, strength: 4, shrink_fraction: 0 };
        const far_ball = { x: 0.6, y: 0.5, z: 0.5, active: true, base_strength: 4, strength: 4, shrink_fraction: 0 };
        getActiveBalls.mockReturnValueOnce([far_ball, near_ball]);

        field.squeezeNearestBall({ x: 0, y: 0, z: 0, shrink_increment: 0.1 });

        expect(near_ball.strength).toBeCloseTo(4 * 0.9 * 0.9, 9);
        expect(near_ball.active).toBe(true);
        expect(far_ball.strength).toBe(4);
    });

    test('squeezeNearestBall accumulates onto the ball\'s own persisted shrink_fraction instead of resetting it, so a ball already shrunk in an earlier press stays shrunk', () => {
        const field = createMetaballField(makeScene());
        const ball = { x: 0.5, y: 0.5, z: 0.5, active: true, base_strength: 4, strength: 2.56, shrink_fraction: 0.2 };

        getActiveBalls.mockReturnValueOnce([ball]);
        field.squeezeNearestBall({ x: 0, y: 0, z: 0, shrink_increment: 0 });
        expect(ball.strength).toBeCloseTo(4 * 0.8 * 0.8, 9);

        getActiveBalls.mockReturnValueOnce([ball]);
        field.squeezeNearestBall({ x: 0, y: 0, z: 0, shrink_increment: 0.1 });
        expect(ball.shrink_fraction).toBeCloseTo(0.3, 9);
        expect(ball.strength).toBeCloseTo(4 * 0.7 * 0.7, 9);
    });

    test('squeezeNearestBall deactivates the ball once fully shrunk (shrink_fraction reaches 1)', () => {
        const field = createMetaballField(makeScene());
        const ball = { x: 0.5, y: 0.5, z: 0.5, active: true, base_strength: 4, strength: 4, shrink_fraction: 0 };
        getActiveBalls.mockReturnValueOnce([ball]);

        field.squeezeNearestBall({ x: 0, y: 0, z: 0, shrink_increment: 1.0 });

        expect(ball.strength).toBe(0);
        expect(ball.active).toBe(false);
    });

    test('squeezeNearestBall does nothing when there are no active balls', () => {
        const field = createMetaballField(makeScene());
        getActiveBalls.mockReturnValueOnce([]);
        expect(() => field.squeezeNearestBall({ x: 0, y: 0, z: 0, shrink_increment: 0.1 })).not.toThrow();
    });

    test('getEruptionIntensity forwards to the animation module', () => {
        const field = createMetaballField(makeScene());
        getEruptionIntensity.mockReturnValueOnce(0.42);
        expect(field.getEruptionIntensity(7)).toBe(0.42);
        expect(getEruptionIntensity).toHaveBeenCalledWith(7);
    });

    test('getSpawnCount forwards to the animation module', () => {
        const field = createMetaballField(makeScene());
        getSpawnCount.mockReturnValueOnce(3);
        expect(field.getSpawnCount()).toBe(3);
    });

    test('getWaveStartCount forwards to the animation module', () => {
        const field = createMetaballField(makeScene());
        getWaveStartCount.mockReturnValueOnce(2);
        expect(field.getWaveStartCount()).toBe(2);
    });

    test('setCount/setIsolation/setRadius rebuild the geometry with the currently active balls', () => {
        const field = createMetaballField(makeScene());
        updateMetaballBalls.mockClear();

        field.setCount(250);
        expect(field.getCount()).toBe(250);
        expect(updateMetaballBalls).toHaveBeenCalledTimes(1);

        field.setIsolation(77);
        expect(field.getIsolation()).toBe(77);
        expect(updateMetaballBalls).toHaveBeenCalledTimes(2);

        field.setRadius(1.5);
        expect(field.getRadius()).toBe(1.5);
        expect(updateMetaballBalls).toHaveBeenCalledTimes(3);
    });

    test('getDisplacementStrength/getDisplacementEnabled reflect the configured values, unaffected by the applied uniform', () => {
        const field = createMetaballField(makeScene());
        expect(field.getDisplacementEnabled()).toBe(true);
        expect(field.getDisplacementStrength()).toBeCloseTo(0.003, 9);

        field.setDisplacementEnabled(false);
        expect(field.getDisplacementEnabled()).toBe(false);
        expect(field.getDisplacementStrength()).toBeCloseTo(0.003, 9);

        field.setDisplacementStrength(0.002);
        expect(field.getDisplacementStrength()).toBe(0.002);
        expect(field.getDisplacementEnabled()).toBe(false);
    });

    test('update() forwards the configured displacement enabled/strength to updateMetaballDisplacement', () => {
        const field = createMetaballField(makeScene());
        field.update(0, NEAR_CAMERA, VOLCANO_POSITION);
        expect(updateMetaballDisplacement).toHaveBeenCalledWith(expect.any(Object), {
            enabled: true, strength: expect.closeTo(0.003, 9), camera: NEAR_CAMERA, volcano_position: VOLCANO_POSITION,
        });

        field.setDisplacementEnabled(false);
        field.update(0, NEAR_CAMERA, VOLCANO_POSITION);
        expect(updateMetaballDisplacement).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ enabled: false }));
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
