import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    function makeColor(hex = '000000') {
        return {
            _hex: hex,
            set(value) { this._hex = String(value).replace('#', ''); return this; },
            getHexString() { return this._hex; },
            multiplyScalar() { return this; },
        };
    }
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0 };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.visible = true;
        }
    }
    class PlaneGeometry { constructor(width, height) { this.width = width; this.height = height; } }
    class MeshStandardMaterial {
        constructor() {
            this.color = makeColor('220500');
            this.emissive = makeColor('2b0800');
        }
    }
    return { Mesh, PlaneGeometry, MeshStandardMaterial };
});

import { createGround } from '../ground_object.js';

function makeScene() { return { add: vi.fn() }; }

describe('createGround', () => {
    let scene, ground;
    beforeEach(() => {
        scene = makeScene();
        ground = createGround(scene);
    });

    test('adds the mesh to the scene', () => {
        expect(scene.add).toHaveBeenCalledWith(ground.mesh);
    });

    test('lies flat and starts at y = -6', () => {
        expect(ground.mesh.rotation.x).toBeCloseTo(-Math.PI / 2, 9);
        expect(ground.mesh.position.y).toBe(-6);
    });

    test('getVisible/setVisible toggle mesh.visible', () => {
        expect(ground.getVisible()).toBe(true);
        ground.setVisible(false);
        expect(ground.getVisible()).toBe(false);
        expect(ground.mesh.visible).toBe(false);
    });

    test('setColor updates both color and a dimmed emissive', () => {
        ground.setColor('#abcabc');
        expect(ground.getColor()).toBe('#abcabc');
        expect(ground.mesh.material.emissive.getHexString()).toBe('abcabc');
    });
});
