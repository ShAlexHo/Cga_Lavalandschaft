import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three/addons/objects/MarchingCubes.js', () => {
    class MarchingCubes {
        constructor(_resolution, _material, _uvs, _colors, _max) {
            this.isolation = 80;
            this.scale = { set: vi.fn() };
            this.position = { y: 0 };
        }
        reset() {}
        addBall() {}
        update() {}
    }
    return { MarchingCubes };
});

import { createMetaballGeometry, rebuildMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../metaball_geometry.js';
import { METABALL_SCALE_XY, METABALL_SCALE_Z } from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';
import { makeScene } from '../../test-utils/three_mocks.js';

function makeEffect() {
    return {
        reset: vi.fn(),
        addBall: vi.fn(),
        update: vi.fn(),
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

    test('calls effect.scale.set(30, 30, 30)', () => {
        const effect = createMetaballGeometry(mock_scene, {});
        expect(effect.scale.set).toHaveBeenCalledWith(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    });
});

describe('rebuildMetaballGeometry', () => {
    let effect;
    beforeEach(() => { effect = makeEffect(); });

    test('calls reset() first and update() last', () => {
        const order = [];
        effect.reset.mockImplementation(() => order.push('reset'));
        effect.addBall.mockImplementation(() => order.push('addBall'));
        effect.update.mockImplementation(() => order.push('update'));

        rebuildMetaballGeometry(effect, [{ x: 0, y: 0, z: 0, strength: 1, subtract: 30 }]);

        expect(order[0]).toBe('reset');
        expect(order[order.length - 1]).toBe('update');
    });

    test('adds no balls for an empty list', () => {
        rebuildMetaballGeometry(effect, []);
        expect(effect.addBall).not.toHaveBeenCalled();
    });

    test('forwards each ball\'s fields to addBall', () => {
        const balls = [
            { x: 0.1, y: 0.2, z: 0.3, strength: 0.5, subtract: 40 },
            { x: 0.4, y: 0.5, z: 0.6, strength: 0.7, subtract: 35 },
        ];
        rebuildMetaballGeometry(effect, balls);
        expect(effect.addBall).toHaveBeenNthCalledWith(1, 0.1, 0.2, 0.3, 0.5, 40);
        expect(effect.addBall).toHaveBeenNthCalledWith(2, 0.4, 0.5, 0.6, 0.7, 35);
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
    test('matches the isosurface radius derived from MarchingCubes\' own contribution formula', () => {
        // strength / (isolation + subtract) = 0.8 / 80 = 0.01 -> field radius sqrt(0.01) = 0.1
        const effect = { isolation: 50, scale: { x: 30 } };
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, effect)).toBeCloseTo(6.0, 9); // 2 * 30 * 0.1
    });

    test('scales linearly with effect.scale.x', () => {
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, { isolation: 50, scale: { x: 1 } })).toBeCloseTo(0.2, 9);
    });

    test('a higher isolation shrinks the radius', () => {
        const ball = { strength: 0.8, subtract: 30 };
        const low_isolation_radius = ballToWorldRadius(ball, { isolation: 10, scale: { x: 30 } });
        const high_isolation_radius = ballToWorldRadius(ball, { isolation: 90, scale: { x: 30 } });
        expect(high_isolation_radius).toBeLessThan(low_isolation_radius);
    });
});
