import { describe, test, expect, vi } from 'vitest';
import { makeScene, MockMesh, MockSphereGeometry } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Mesh: MockMesh, SphereGeometry: MockSphereGeometry }));

import { createMetaballGeometry } from '../metaball_geometry.js';
import { METABALL_SCALE_XY, METABALL_SCALE_Z, METABALL_RAYMARCH_BOUNDING_RADIUS } from '../../config.js';

describe('createMetaballGeometry', () => {
    test('adds the mesh to the scene', () => {
        const scene = makeScene();
        const mesh = createMetaballGeometry(scene, {});
        expect(scene.add).toHaveBeenCalledWith(mesh);
    });

    test('builds a bounding sphere at METABALL_RAYMARCH_BOUNDING_RADIUS', () => {
        const mesh = createMetaballGeometry(makeScene(), {});
        expect(mesh.geometry.radius).toBe(METABALL_RAYMARCH_BOUNDING_RADIUS);
    });

    test('calls mesh.scale.set(30, 30, 30)', () => {
        const mesh = createMetaballGeometry(makeScene(), {});
        expect(mesh.scale.set).toHaveBeenCalledWith(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    });
});
