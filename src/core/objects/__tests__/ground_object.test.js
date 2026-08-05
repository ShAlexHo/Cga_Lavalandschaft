import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeScene, MockMesh, MockPlaneGeometry } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Mesh: MockMesh, PlaneGeometry: MockPlaneGeometry }));

vi.mock('../../rendering/ground_material.js', () => ({
    createGroundMaterial: vi.fn(() => ({
        uniforms: {
            u_displacement_scale: { value: 0.6 },
            u_displacement_frequency: { value: 0.08 },
            u_rock_color: { value: makeColor('220500') },
            u_crack_color: { value: makeColor('050505') },
            u_crack_color_2: { value: makeColor('ffaa00') },
            u_crack_color_3: { value: makeColor('ffd700') },
            u_crack_color_4: { value: makeColor('dd0000') },
            u_crack_softness: { value: 0.25 },
            u_proximity_color: { value: makeColor('9b9696') },
            u_proximity_noise_color: { value: makeColor('8a3a1a') },
            u_proximity_radius: { value: 18.0 },
            u_sun_focus_radius: { value: 4.5 },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_sun_focus: { value: 8.0 },
        },
    })),
    updateGroundLight: vi.fn(),
}));

import { createGround } from '../ground_object.js';
import { createGroundMaterial, updateGroundLight } from '../../rendering/ground_material.js';

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

    test('update() forwards to updateGroundLight with the material, camera, volcano position, sun position and time', () => {
        const ground = createGround(makeScene());
        const camera = {};
        const volcano_position = {};
        const sun_position = {};
        ground.update(camera, volcano_position, sun_position, 3.5);
        expect(updateGroundLight).toHaveBeenCalledWith(expect.any(Object), camera, volcano_position, sun_position, 3.5);
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

        ground.setCrackColor3('#333333');
        expect(ground.getCrackColor3()).toBe('#333333');

        ground.setCrackColor4('#444400');
        expect(ground.getCrackColor4()).toBe('#444400');

        ground.setCrackSoftness(0.6);
        expect(ground.getCrackSoftness()).toBe(0.6);

        ground.setProximityColor('#444444');
        expect(ground.getProximityColor()).toBe('#444444');

        ground.setProximityNoiseColor('#555555');
        expect(ground.getProximityNoiseColor()).toBe('#555555');

        ground.setProximityRadius(25.0);
        expect(ground.getProximityRadius()).toBe(25.0);

        ground.setSunFocusRadius(6.0);
        expect(ground.getSunFocusRadius()).toBe(6.0);

        ground.setDisplacementScale(1.2);
        expect(ground.getDisplacementScale()).toBe(1.2);

        ground.setDisplacementFrequency(0.3);
        expect(ground.getDisplacementFrequency()).toBe(0.3);

        ground.setSunStrength(0.08);
        expect(ground.getSunStrength()).toBe(0.08);

        ground.setSunFocus(7.0);
        expect(ground.getSunFocus()).toBe(7.0);
    });

    test('getSunEnabled/setSunEnabled toggle the sun tint uniform', () => {
        const ground = createGround(makeScene());
        expect(ground.getSunEnabled()).toBe(true);
        ground.setSunEnabled(false);
        expect(ground.getSunEnabled()).toBe(false);
        ground.setSunEnabled(true);
        expect(ground.getSunEnabled()).toBe(true);
    });
});
