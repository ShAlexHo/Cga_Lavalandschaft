import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeScene } from '../../test-utils/three_mocks.js';

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
            u_displacement_scale: { value: 2.5 },
            u_displacement_frequency: { value: 0.5 },
            u_rock_color: { value: makeColor('afafaf') },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_sun_focus: { value: 8.0 },
        },
    })),
    updateVolcanoLight: vi.fn(),
    updateVolcanoInteraction: vi.fn(),
}));

import { createVolcano } from '../volcano_object.js';
import { createVolcanoGeometry } from '../../geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight, updateVolcanoInteraction } from '../../rendering/volcano_material.js';

beforeEach(() => vi.clearAllMocks());

describe('createVolcano', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const volcano = createVolcano(scene);
        expect(createVolcanoMaterial).toHaveBeenCalledTimes(1);
        expect(createVolcanoGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(volcano.mesh);
    });

    test('update() forwards to updateVolcanoLight with the material, camera and sun world position', () => {
        const volcano = createVolcano(makeScene());
        const camera = {};
        const sun_position = { x: 1, y: 2, z: 3 };
        volcano.update(camera, sun_position);
        expect(updateVolcanoLight).toHaveBeenCalledWith(expect.any(Object), camera, sun_position);
    });

    test('update() forwards interaction points to updateVolcanoInteraction, defaulting to an empty list', () => {
        const volcano = createVolcano(makeScene());
        volcano.update({}, { x: 0, y: 0, z: 0 });
        expect(updateVolcanoInteraction).toHaveBeenCalledWith(expect.any(Object), []);

        const points = [{ x: 1, y: 1, z: 1, strength: 0.4 }];
        volcano.update({}, { x: 0, y: 0, z: 0 }, points);
        expect(updateVolcanoInteraction).toHaveBeenCalledWith(expect.any(Object), points);
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

        volcano.setDisplacementScale(3.3);
        expect(volcano.getDisplacementScale()).toBe(3.3);

        volcano.setDisplacementFrequency(0.9);
        expect(volcano.getDisplacementFrequency()).toBe(0.9);

        volcano.setSunStrength(0.08);
        expect(volcano.getSunStrength()).toBe(0.08);

        volcano.setSunFocus(7.0);
        expect(volcano.getSunFocus()).toBe(7.0);
    });

    test('getSunEnabled/setSunEnabled toggle the sun tint uniform', () => {
        const volcano = createVolcano(makeScene());
        expect(volcano.getSunEnabled()).toBe(true);
        volcano.setSunEnabled(false);
        expect(volcano.getSunEnabled()).toBe(false);
        volcano.setSunEnabled(true);
        expect(volcano.getSunEnabled()).toBe(true);
    });
});
