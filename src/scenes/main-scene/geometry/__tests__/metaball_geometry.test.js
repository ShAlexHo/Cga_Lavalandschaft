import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeScene, MockMesh, MockBoxGeometry } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Mesh: MockMesh, BoxGeometry: MockBoxGeometry }));

import { createMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../metaball_geometry.js';
import { METABALL_SCALE_XY, METABALL_SCALE_Z } from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

describe('createMetaballGeometry', () => {
    let mock_scene;
    beforeEach(() => { mock_scene = makeScene(); });

    test('adds the mesh to the scene', () => {
        const mesh = createMetaballGeometry(mock_scene, {});
        expect(mock_scene.add).toHaveBeenCalledWith(mesh);
    });

    test('sets mesh.isolation to DEFAULT_SETTINGS.metaballIsolation', () => {
        const mesh = createMetaballGeometry(mock_scene, {});
        expect(mesh.isolation).toBe(DEFAULT_SETTINGS.metaballIsolation);
    });

    test('sets mesh.radius_scale to DEFAULT_SETTINGS.metaballRadius', () => {
        const mesh = createMetaballGeometry(mock_scene, {});
        expect(mesh.radius_scale).toBe(DEFAULT_SETTINGS.metaballRadius);
    });

    test('calls mesh.scale.set(30, 30, 30)', () => {
        const mesh = createMetaballGeometry(mock_scene, {});
        expect(mesh.scale.set).toHaveBeenCalledWith(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    });

    test('centers the proxy box geometry via translate()', () => {
        const mesh = createMetaballGeometry(mock_scene, {});
        expect(mesh.geometry.translate).toHaveBeenCalled();
    });
});

describe('ballToWorldPosition', () => {
    test('maps the field-space center (0.5, 0.5, 0.5) to mesh.position', () => {
        const mesh = { position: { x: 1, y: 2, z: 3 }, scale: { x: 30, y: 30, z: 30 } };
        expect(ballToWorldPosition({ x: 0.5, y: 0.5, z: 0.5 }, mesh)).toEqual({ x: 1, y: 2, z: 3 });
    });

    test('scales an off-center ball by mesh.scale around mesh.position', () => {
        const mesh = { position: { x: 0, y: 0, z: 0 }, scale: { x: 30, y: 30, z: 30 } };
        expect(ballToWorldPosition({ x: 1, y: 0, z: 0.75 }, mesh)).toEqual({ x: 30, y: -30, z: 15 });
    });
});

describe('ballToWorldRadius', () => {
    test('matches the isosurface radius derived from the metaball field\'s own contribution formula', () => {
        const mesh = { isolation: 50, scale: { x: 30 }, radius_scale: 1 };
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, mesh)).toBeCloseTo(6.0, 9);
    });

    test('scales linearly with mesh.scale.x', () => {
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, { isolation: 50, scale: { x: 1 }, radius_scale: 1 })).toBeCloseTo(0.2, 9);
    });

    test('a higher isolation shrinks the radius', () => {
        const ball = { strength: 0.8, subtract: 30 };
        const low_isolation_radius = ballToWorldRadius(ball, { isolation: 10, scale: { x: 30 }, radius_scale: 1 });
        const high_isolation_radius = ballToWorldRadius(ball, { isolation: 90, scale: { x: 30 }, radius_scale: 1 });
        expect(high_isolation_radius).toBeLessThan(low_isolation_radius);
    });

    test('scales linearly with mesh.radius_scale', () => {
        const ball = { strength: 0.8, subtract: 30 };
        expect(ballToWorldRadius(ball, { isolation: 50, scale: { x: 30 }, radius_scale: 2 })).toBeCloseTo(12.0, 9);
    });
});
