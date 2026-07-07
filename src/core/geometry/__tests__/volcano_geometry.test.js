import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    class Vector2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    }
    class LatheGeometry {
        constructor(points, segments) { this.points = points; this.segments = segments; }
    }
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { set: vi.fn() };
        }
    }
    return { Vector2, LatheGeometry, Mesh };
});

import { createVolcanoGeometry } from '../volcano_geometry.js';

describe('createVolcanoGeometry', () => {
    let mock_scene, material;
    beforeEach(() => {
        mock_scene = { add: vi.fn() };
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
});
