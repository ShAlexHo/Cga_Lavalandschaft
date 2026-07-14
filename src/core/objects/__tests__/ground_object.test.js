import { describe, test, expect, vi, beforeEach } from 'vitest';

function makeColor(hex) {
    return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
}

vi.mock('three', () => {
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0 };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.visible = true;
        }
    }
    class PlaneGeometry { constructor(width, height, width_segments, height_segments) { this.width = width; this.height = height; this.width_segments = width_segments; this.height_segments = height_segments; } }
    return { Mesh, PlaneGeometry };
});

vi.mock('../../rendering/ground_material.js', () => ({
    createGroundMaterial: vi.fn(() => ({
        uniforms: {
            u_disp_scale: { value: 0.6 },
            u_disp_freq: { value: 0.08 },
            u_rock_color: { value: makeColor('220500') },
            u_crack_color: { value: makeColor('050505') },
            u_crack_color_2: { value: makeColor('ffaa00') },
            u_crack_softness: { value: 0.25 },
        },
    })),
    updateGroundLight: vi.fn(),
}));

import { createGround } from '../ground_object.js';
import { createGroundMaterial, updateGroundLight } from '../../rendering/ground_material.js';

function makeScene() { return { add: vi.fn() }; }

beforeEach(() => vi.clearAllMocks());

describe('createGround', () => {
    test('adds the mesh to the scene, built with a freshly created material', () => {
        const scene = makeScene();
        const ground = createGround(scene);
        expect(createGroundMaterial).toHaveBeenCalledTimes(1);
        expect(scene.add).toHaveBeenCalledWith(ground.mesh);
    });

    test('lies flat and starts at y = -6', () => {
        const ground = createGround(makeScene());
        expect(ground.mesh.rotation.x).toBeCloseTo(-Math.PI / 2, 9);
        expect(ground.mesh.position.y).toBe(-6);
    });

    test('update() forwards to updateGroundLight with the material and camera', () => {
        const ground = createGround(makeScene());
        const camera = {};
        ground.update(camera);
        expect(updateGroundLight).toHaveBeenCalledWith(expect.any(Object), camera);
    });

    test('getVisible/setVisible toggle mesh.visible', () => {
        const ground = createGround(makeScene());
        expect(ground.getVisible()).toBe(true);
        ground.setVisible(false);
        expect(ground.getVisible()).toBe(false);
    });

    test('color and displacement getters/setters forward to the material uniforms', () => {
        const ground = createGround(makeScene());

        ground.setColor('#abcabc');
        expect(ground.getColor()).toBe('#abcabc');

        ground.setCrackColor('#111111');
        expect(ground.getCrackColor()).toBe('#111111');

        ground.setCrackColor2('#222222');
        expect(ground.getCrackColor2()).toBe('#222222');

        ground.setCrackSoftness(0.6);
        expect(ground.getCrackSoftness()).toBe(0.6);

        ground.setDisplacementScale(1.2);
        expect(ground.getDisplacementScale()).toBe(1.2);

        ground.setDisplacementFrequency(0.3);
        expect(ground.getDisplacementFrequency()).toBe(0.3);
    });
});
