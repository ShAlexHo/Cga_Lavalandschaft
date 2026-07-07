import { describe, test, expect, vi, beforeEach } from 'vitest';

function makeColor(hex) {
    return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
}

vi.mock('../../geometry/volcano_geometry.js', () => ({
    createVolcanoGeometry: vi.fn((scene, material) => {
        const mesh = { material, position: { x: 0, y: 0, z: 0 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
}));

vi.mock('../../rendering/volcano_material.js', () => ({
    createVolcanoMaterial: vi.fn(() => ({
        uniforms: {
            u_disp_scale: { value: 2.5 },
            u_disp_freq: { value: 0.5 },
            u_rock_color: { value: makeColor('afafaf') },
            u_crack_color: { value: makeColor('0a0a0a') },
        },
    })),
    updateVolcanoLight: vi.fn(),
}));

import { createVolcano } from '../volcano_object.js';
import { createVolcanoGeometry } from '../../geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight } from '../../rendering/volcano_material.js';

function makeScene() { return { add: vi.fn() }; }

beforeEach(() => vi.clearAllMocks());

describe('createVolcano', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const volcano = createVolcano(scene);
        expect(createVolcanoMaterial).toHaveBeenCalledTimes(1);
        expect(createVolcanoGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(volcano.mesh);
    });

    test('update() forwards to updateVolcanoLight with the material and camera', () => {
        const volcano = createVolcano(makeScene());
        const camera = {};
        volcano.update(camera);
        expect(updateVolcanoLight).toHaveBeenCalledWith(expect.any(Object), camera);
    });

    test('getVisible/setVisible toggle mesh.visible', () => {
        const volcano = createVolcano(makeScene());
        expect(volcano.getVisible()).toBe(true);
        volcano.setVisible(false);
        expect(volcano.getVisible()).toBe(false);
    });

    test('color and displacement getters/setters forward to the material uniforms', () => {
        const volcano = createVolcano(makeScene());

        volcano.setRockColor('#123456');
        expect(volcano.getRockColor()).toBe('#123456');

        volcano.setCrackColor('#654321');
        expect(volcano.getCrackColor()).toBe('#654321');

        volcano.setDisplacementScale(3.3);
        expect(volcano.getDisplacementScale()).toBe(3.3);

        volcano.setDisplacementFrequency(0.9);
        expect(volcano.getDisplacementFrequency()).toBe(0.9);
    });
});
