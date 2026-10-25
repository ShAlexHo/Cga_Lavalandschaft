import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
        set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
        applyMatrix4() { return this; }
    }
    class PlaneGeometry {
        constructor(width, height, width_segments, height_segments) {
            this.width = width;
            this.height = height;
            this.width_segments = width_segments;
            this.height_segments = height_segments;
            const vertex_count = (width_segments + 1) * (height_segments + 1);
            this.attributes = { position: { array: new Float32Array(vertex_count * 3), count: vertex_count } };
        }
        setAttribute(name, attribute) { this.attributes[name] = attribute; }
    }
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0 };
            this.rotation = { x: 0 };
        }
    }
    class Float32BufferAttribute {
        constructor(array, item_size) {
            this.array = array;
            this.itemSize = item_size;
            this.count = array.length / item_size;
        }
        setX(index, value) { this.array[index] = value; }
    }
    return { Vector3, PlaneGeometry, Mesh, Float32BufferAttribute };
});

import { createGroundGeometry, bakeGroundDisplacement } from '../ground_geometry.js';
import { makeScene } from '../../test-utils/three_mocks.js';

describe('createGroundGeometry', () => {
    let mock_scene, material;
    beforeEach(() => {
        mock_scene = makeScene();
        material = {};
    });

    test('adds the mesh to the scene', () => {
        const mesh = createGroundGeometry(mock_scene, material);
        expect(mock_scene.add).toHaveBeenCalledWith(mesh);
    });

    test('lies flat and starts at y = -6', () => {
        const mesh = createGroundGeometry(mock_scene, material);
        expect(mesh.rotation.x).toBeCloseTo(-Math.PI / 2, 9);
        expect(mesh.position.y).toBe(-6);
    });

    test('stores an unmodified copy of the initial (undisplaced) vertex positions', () => {
        const mesh = createGroundGeometry(mock_scene, material);
        expect(mesh.pristine_positions).toEqual(mesh.geometry.attributes.position.array);
        expect(mesh.pristine_positions).not.toBe(mesh.geometry.attributes.position.array);
    });

    test('adds an a_bump attribute matching the vertex count', () => {
        const mesh = createGroundGeometry(mock_scene, material);
        expect(mesh.geometry.attributes.a_bump.count).toBe(mesh.geometry.attributes.position.count);
    });
});

describe('bakeGroundDisplacement', () => {
    function makeMesh(pristine_positions) {
        return {
            updateMatrixWorld: vi.fn(),
            matrixWorld: {},
            pristine_positions,
            geometry: {
                attributes: {
                    position: { count: pristine_positions.length / 3, setXYZ: vi.fn() },
                    a_bump: { setX: vi.fn() },
                },
                computeBoundingSphere: vi.fn(),
                computeBoundingBox: vi.fn(),
            },
        };
    }

    const base_parameters = {
        frequency: 0.1, scale: 1.0, volcano_crack_frequency: 0.5, volcano_crack_scale: 2.5,
        volcano_position: { x: 0, y: 0, z: 0 }, proximity_radius: 20,
    };

    test('keeps x/y exactly as given and only ever perturbs z', () => {
        const mesh = makeMesh(new Float32Array([1, 2, 0, -4, 5, 0]));
        bakeGroundDisplacement(mesh, base_parameters);

        const { setXYZ } = mesh.geometry.attributes.position;
        expect(setXYZ).toHaveBeenCalledTimes(2);
        expect(setXYZ.mock.calls[0][1]).toBe(1);
        expect(setXYZ.mock.calls[0][2]).toBe(2);
        expect(setXYZ.mock.calls[1][1]).toBe(-4);
        expect(setXYZ.mock.calls[1][2]).toBe(5);
    });

    test('writes a bump value per vertex', () => {
        const mesh = makeMesh(new Float32Array([1, 2, 0]));
        bakeGroundDisplacement(mesh, base_parameters);
        expect(mesh.geometry.attributes.a_bump.setX).toHaveBeenCalledTimes(1);
        expect(mesh.geometry.attributes.a_bump.setX.mock.calls[0][0]).toBe(0);
        expect(typeof mesh.geometry.attributes.a_bump.setX.mock.calls[0][1]).toBe('number');
    });

    test('marks both attributes dirty and recomputes the bounding volumes', () => {
        const mesh = makeMesh(new Float32Array([0, 0, 0]));
        bakeGroundDisplacement(mesh, base_parameters);
        expect(mesh.geometry.attributes.position.needsUpdate).toBe(true);
        expect(mesh.geometry.attributes.a_bump.needsUpdate).toBe(true);
        expect(mesh.geometry.computeBoundingSphere).toHaveBeenCalled();
        expect(mesh.geometry.computeBoundingBox).toHaveBeenCalled();
    });

    test('updates the world matrix before sampling, so a just-changed mesh.position is honored', () => {
        const mesh = makeMesh(new Float32Array([0, 0, 0]));
        bakeGroundDisplacement(mesh, base_parameters);
        expect(mesh.updateMatrixWorld).toHaveBeenCalledWith(true);
    });

    test('rebuilds from pristine_positions every time, so repeated bakes do not compound', () => {
        const pristine_positions = new Float32Array([3, 7, 0]);
        const mesh = makeMesh(pristine_positions);

        bakeGroundDisplacement(mesh, base_parameters);
        const first_z = mesh.geometry.attributes.position.setXYZ.mock.calls[0][3];

        bakeGroundDisplacement(mesh, base_parameters);
        const second_z = mesh.geometry.attributes.position.setXYZ.mock.calls[1][3];

        expect(second_z).toBe(first_z);
    });

    test('blends toward the volcano-style bump/scale as proximity to the volcano increases', () => {
        const mesh_far = makeMesh(new Float32Array([3, 7, 0]));
        bakeGroundDisplacement(mesh_far, { ...base_parameters, volcano_position: { x: 1000, y: 0, z: 1000 } });
        const far_z = mesh_far.geometry.attributes.position.setXYZ.mock.calls[0][3];

        const mesh_near = makeMesh(new Float32Array([3, 7, 0]));
        bakeGroundDisplacement(mesh_near, { ...base_parameters, volcano_position: { x: 3, y: 0, z: 7 } });
        const near_z = mesh_near.geometry.attributes.position.setXYZ.mock.calls[0][3];

        expect(near_z).not.toBe(far_z);
    });
});
