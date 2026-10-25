import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    class Vector2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    }
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
        set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
        applyMatrix4() { return this; } // identity - no rotation/scale to model in this mock
    }
    class LatheGeometry {
        constructor(points, segments) {
            this.points = points;
            this.segments = segments;
            this.attributes = { position: { array: new Float32Array(points.length * 3) } };
        }
    }
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { set: vi.fn() };
        }
    }
    return { Vector2, Vector3, LatheGeometry, Mesh };
});

import { createVolcanoGeometry, bakeCrackDisplacement } from '../volcano_geometry.js';
import { makeScene } from '../../test-utils/three_mocks.js';

describe('createVolcanoGeometry', () => {
    let mock_scene, material;
    beforeEach(() => {
        mock_scene = makeScene();
        material = {};
    });

    test('adds the mesh to the scene', () => {
        const mesh = createVolcanoGeometry(mock_scene, material);
        expect(mock_scene.add).toHaveBeenCalledWith(mesh);
    });

    test('uses the given material', () => {
        const mesh = createVolcanoGeometry(mock_scene, material);
        expect(mesh.material).toBe(material);
    });

    test('subdivides the 3-point profile into a denser lathe outline', () => {
        const mesh = createVolcanoGeometry(mock_scene, material);
        expect(mesh.geometry.points.length).toBeGreaterThan(3);
    });

    test('stores an unmodified copy of the initial (undisplaced) vertex positions', () => {
        const mesh = createVolcanoGeometry(mock_scene, material);
        expect(mesh.pristine_positions).toEqual(mesh.geometry.attributes.position.array);
        expect(mesh.pristine_positions).not.toBe(mesh.geometry.attributes.position.array); // a copy, not the same buffer
    });
});

describe('bakeCrackDisplacement', () => {
    function makeMesh(pristine_positions) {
        return {
            updateMatrixWorld: vi.fn(),
            matrixWorld: {},
            pristine_positions,
            geometry: {
                attributes: { position: { count: pristine_positions.length / 3, setXYZ: vi.fn() } },
                computeBoundingSphere: vi.fn(),
                computeBoundingBox: vi.fn(),
            },
        };
    }

    test('keeps x/z exactly as given and only ever lowers y', () => {
        const mesh = makeMesh(new Float32Array([1, 2, 3, -4, 5, -6]));
        bakeCrackDisplacement(mesh, 0.5, 2.0);

        const { setXYZ } = mesh.geometry.attributes.position;
        expect(setXYZ).toHaveBeenCalledTimes(2);
        expect(setXYZ.mock.calls[0][0]).toBe(0);
        expect(setXYZ.mock.calls[0][1]).toBe(1);
        expect(setXYZ.mock.calls[0][2]).toBeLessThanOrEqual(2);
        expect(setXYZ.mock.calls[0][3]).toBe(3);
        expect(setXYZ.mock.calls[1][0]).toBe(1);
        expect(setXYZ.mock.calls[1][1]).toBe(-4);
        expect(setXYZ.mock.calls[1][2]).toBeLessThanOrEqual(5);
        expect(setXYZ.mock.calls[1][3]).toBe(-6);
    });

    test('marks the position attribute dirty and recomputes the bounding volumes', () => {
        const mesh = makeMesh(new Float32Array([0, 0, 0]));
        bakeCrackDisplacement(mesh, 0.5, 2.0);

        expect(mesh.geometry.attributes.position.needsUpdate).toBe(true);
        expect(mesh.geometry.computeBoundingSphere).toHaveBeenCalled();
        expect(mesh.geometry.computeBoundingBox).toHaveBeenCalled();
    });

    test('updates the world matrix before sampling, so a just-changed mesh.position is honored', () => {
        const mesh = makeMesh(new Float32Array([0, 0, 0]));
        bakeCrackDisplacement(mesh, 0.5, 2.0);
        expect(mesh.updateMatrixWorld).toHaveBeenCalledWith(true);
    });

    test('rebuilds from pristine_positions every time, so repeated bakes do not compound', () => {
        const pristine = new Float32Array([0, 0, 0]);
        const mesh = makeMesh(pristine);

        bakeCrackDisplacement(mesh, 0.5, 2.0);
        const first_y = mesh.geometry.attributes.position.setXYZ.mock.calls[0][2];

        bakeCrackDisplacement(mesh, 0.5, 2.0);
        const second_y = mesh.geometry.attributes.position.setXYZ.mock.calls[1][2];

        expect(second_y).toBe(first_y);
    });
});
