import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeGroundMaterialUniformsMock, makeScene } from '../../test-utils/three_mocks.js';

vi.mock('../../geometry/ground_geometry.js', () => ({
    createGroundGeometry: vi.fn((scene, material) => {
        const mesh = { material, position: { x: 0, y: -6, z: 0 }, rotation: { x: -Math.PI / 2 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
    bakeGroundDisplacement: vi.fn(),
}));

vi.mock('../../rendering/ground_material.js', () => ({
    createGroundMaterial: vi.fn(() => ({ uniforms: makeGroundMaterialUniformsMock() })),
    updateGroundLight: vi.fn(),
}));

import { createGround } from '../ground_object.js';
import { createGroundGeometry, bakeGroundDisplacement } from '../../geometry/ground_geometry.js';
import { createGroundMaterial, updateGroundLight } from '../../rendering/ground_material.js';

beforeEach(() => vi.clearAllMocks());

describe('createGround', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const ground = createGround(scene);
        expect(createGroundMaterial).toHaveBeenCalledTimes(1);
        expect(createGroundGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(ground.mesh);
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

        ground.setColor2('#aabbcc');
        expect(ground.getColor2()).toBe('#aabbcc');

        ground.setColor3('#ccbbaa');
        expect(ground.getColor3()).toBe('#ccbbaa');

        ground.setColor4('#334455');
        expect(ground.getColor4()).toBe('#334455');

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

        ground.setRockVarianceRadius(50.0);
        expect(ground.getRockVarianceRadius()).toBe(50.0);

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

    test('getVolcanoCrackScale/getVolcanoCrackFrequency read the mirrored volcano uniforms', () => {
        const ground = createGround(makeScene());
        expect(ground.getVolcanoCrackScale()).toBe(2.5);
        expect(ground.getVolcanoCrackFrequency()).toBe(0.5);
    });

    test('setDisplacementScale/setDisplacementFrequency/setProximityRadius/setVolcanoCrackScale/setVolcanoCrackFrequency each trigger a rebake', () => {
        const ground = createGround(makeScene());
        bakeGroundDisplacement.mockClear();

        ground.setDisplacementScale(1.2);
        expect(bakeGroundDisplacement).toHaveBeenCalledTimes(1);

        ground.setDisplacementFrequency(0.3);
        expect(bakeGroundDisplacement).toHaveBeenCalledTimes(2);

        ground.setProximityRadius(25.0);
        expect(bakeGroundDisplacement).toHaveBeenCalledTimes(3);

        ground.setVolcanoCrackScale(3.0);
        expect(bakeGroundDisplacement).toHaveBeenCalledTimes(4);
        expect(ground.getVolcanoCrackScale()).toBe(3.0);

        ground.setVolcanoCrackFrequency(0.6);
        expect(bakeGroundDisplacement).toHaveBeenCalledTimes(5);
        expect(ground.getVolcanoCrackFrequency()).toBe(0.6);
    });

    test('rebakeDisplacement forwards the mesh and current settings, reusing the last known volcano position', () => {
        const ground = createGround(makeScene());
        bakeGroundDisplacement.mockClear();

        const volcano_position = { x: 3, y: 0, z: -4 };
        ground.rebakeDisplacement(volcano_position);
        expect(bakeGroundDisplacement).toHaveBeenCalledWith(ground.mesh, {
            frequency: 0.08, scale: 0.6, volcano_crack_frequency: 0.5, volcano_crack_scale: 2.5,
            volcano_position, proximity_radius: 18.0,
        });

        ground.rebakeDisplacement();
        expect(bakeGroundDisplacement).toHaveBeenLastCalledWith(ground.mesh, expect.objectContaining({ volcano_position }));
    });

    test('update() caches the volcano position for the next no-argument rebake', () => {
        const ground = createGround(makeScene());
        const volcano_position = { x: 1, y: 2, z: 3 };
        ground.update({}, volcano_position, {}, 0);

        bakeGroundDisplacement.mockClear();
        ground.rebakeDisplacement();
        expect(bakeGroundDisplacement).toHaveBeenCalledWith(ground.mesh, expect.objectContaining({ volcano_position }));
    });
});
