import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeScene, MockMesh, MockBoxGeometry, MockVector3 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Mesh: MockMesh, BoxGeometry: MockBoxGeometry }));

import { createMetaballGeometry, rebuildMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../metaball_geometry.js';
import { METABALL_SCALE_XY, METABALL_SCALE_Z, METABALL_GPU_MAX_BALLS } from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

function makeEffect() {
    return {
        isolation: 80,
        radius_scale: 1,
        position: new MockVector3(1, 2, 3),
        scale: { x: 30, y: 30, z: 30 },
        material: {
            uniforms: {
                u_ball_center: { value: Array.from({ length: METABALL_GPU_MAX_BALLS }, () => new MockVector3()) },
                u_ball_strength: { value: new Array(METABALL_GPU_MAX_BALLS).fill(0) },
                u_ball_subtract: { value: new Array(METABALL_GPU_MAX_BALLS).fill(0) },
                u_isolation: { value: 0 },
                u_effect_position: { value: new MockVector3() },
                u_effect_scale: { value: 1 },
            },
        },
    };
}

describe('createMetaballGeometry', () => {
    let mock_scene;
    beforeEach(() => { mock_scene = makeScene(); });

    test('adds the effect to the scene', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(mock_scene.add).toHaveBeenCalledWith(effect);
    });

    test('sets effect.isolation to DEFAULT_SETTINGS.metaballIsolation', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(effect.isolation).toBe(DEFAULT_SETTINGS.metaballIsolation);
    });

    test('sets effect.radius_scale to DEFAULT_SETTINGS.metaballRadius', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(effect.radius_scale).toBe(DEFAULT_SETTINGS.metaballRadius);
    });

    test('calls effect.scale.set(30, 30, 30)', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(effect.scale.set).toHaveBeenCalledWith(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    });

    test('centers the proxy box geometry via translate()', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(effect.geometry.translate).toHaveBeenCalled();
    });
});

describe('rebuildMetaballGeometry', () => {
    let effect;
    beforeEach(() => { effect = makeEffect(); });

    test('writes each ball\'s doubled field-space position, strength and subtract into the uniform arrays', () => {
        const balls = [
            { x: 0.1, y: 0.2, z: 0.3, strength: 0.5, subtract: 40 },
            { x: 0.4, y: 0.5, z: 0.6, strength: 0.7, subtract: 35 },
        ];
        rebuildMetaballGeometry(effect, balls);

        const { u_ball_center, u_ball_strength, u_ball_subtract } = effect.material.uniforms;
        expect(u_ball_center.value[0].x).toBeCloseTo(-0.8, 9);
        expect(u_ball_center.value[0].y).toBeCloseTo(-0.6, 9);
        expect(u_ball_center.value[0].z).toBeCloseTo(-0.4, 9);
        expect(u_ball_center.value[1].x).toBeCloseTo(-0.2, 9);
        expect(u_ball_center.value[1].y).toBeCloseTo(0.0, 9);
        expect(u_ball_center.value[1].z).toBeCloseTo(0.2, 9);
        expect(u_ball_strength.value[0]).toBe(0.5);
        expect(u_ball_strength.value[1]).toBe(0.7);
        expect(u_ball_subtract.value[0]).toBe(40);
        expect(u_ball_subtract.value[1]).toBe(35);
    });

    test('scales uploaded strength by radius_scale squared', () => {
        effect.radius_scale = 2;
        rebuildMetaballGeometry(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40 }]);
        expect(effect.material.uniforms.u_ball_strength.value[0]).toBeCloseTo(2.0, 9); // 0.5 * 2^2
    });

    test('zeroes the strength of every slot beyond the given balls', () => {
        rebuildMetaballGeometry(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40 }]);
        expect(effect.material.uniforms.u_ball_strength.value[1]).toBe(0.0);
        expect(effect.material.uniforms.u_ball_strength.value[METABALL_GPU_MAX_BALLS - 1]).toBe(0.0);
    });

    test('caps writes at METABALL_GPU_MAX_BALLS when given more balls than that', () => {
        const balls = Array.from({ length: METABALL_GPU_MAX_BALLS + 10 }, (_, i) => ({
            x: 0.5, y: 0.5, z: 0.5, strength: i + 1, subtract: 30,
        }));
        expect(() => rebuildMetaballGeometry(effect, balls)).not.toThrow();
        expect(effect.material.uniforms.u_ball_strength.value).toHaveLength(METABALL_GPU_MAX_BALLS);
        expect(effect.material.uniforms.u_ball_strength.value[METABALL_GPU_MAX_BALLS - 1]).toBe(METABALL_GPU_MAX_BALLS);
    });

    test('an empty ball list zeroes every slot\'s strength', () => {
        rebuildMetaballGeometry(effect, []);
        expect(effect.material.uniforms.u_ball_strength.value.every(strength => strength === 0)).toBe(true);
    });

    test('syncs isolation and the effect\'s transform into their own uniforms', () => {
        effect.isolation = 42;
        effect.position = new MockVector3(4, 5, 6);
        effect.scale = { x: 12, y: 12, z: 12 };
        rebuildMetaballGeometry(effect, []);

        const { u_isolation, u_effect_position, u_effect_scale } = effect.material.uniforms;
        expect(u_isolation.value).toBe(42);
        expect(u_effect_position.value).toMatchObject({ x: 4, y: 5, z: 6 });
        expect(u_effect_scale.value).toBe(12);
    });
});

describe('ballToWorldPosition', () => {
    test('maps the field-space center (0.5, 0.5, 0.5) to effect.position', () => {
        const effect = { position: { x: 1, y: 2, z: 3 }, scale: { x: 30, y: 30, z: 30 } };
        expect(ballToWorldPosition({ x: 0.5, y: 0.5, z: 0.5 }, effect)).toEqual({ x: 1, y: 2, z: 3 });
    });

    test('scales an off-center ball by effect.scale around effect.position', () => {
        const effect = { position: { x: 0, y: 0, z: 0 }, scale: { x: 30, y: 30, z: 30 } };
        expect(ballToWorldPosition({ x: 1, y: 0, z: 0.75 }, effect)).toEqual({ x: 30, y: -30, z: 15 });
    });
});

describe('ballToWorldRadius', () => {
    test('matches the isosurface radius derived from the metaball field\'s own contribution formula', () => {
        // strength / (isolation + subtract) = 0.8 / 80 = 0.01 -> field radius sqrt(0.01) = 0.1
        const effect = { isolation: 50, scale: { x: 30 }, radius_scale: 1 };
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, effect)).toBeCloseTo(6.0, 9); // 2 * 30 * 0.1
    });

    test('scales linearly with effect.scale.x', () => {
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, { isolation: 50, scale: { x: 1 }, radius_scale: 1 })).toBeCloseTo(0.2, 9);
    });

    test('a higher isolation shrinks the radius', () => {
        const ball = { strength: 0.8, subtract: 30 };
        const low_isolation_radius = ballToWorldRadius(ball, { isolation: 10, scale: { x: 30 }, radius_scale: 1 });
        const high_isolation_radius = ballToWorldRadius(ball, { isolation: 90, scale: { x: 30 }, radius_scale: 1 });
        expect(high_isolation_radius).toBeLessThan(low_isolation_radius);
    });

    test('scales linearly with effect.radius_scale', () => {
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, { isolation: 50, scale: { x: 30 }, radius_scale: 2 })).toBeCloseTo(12.0, 9); // double the 6.0 base case
    });
});
