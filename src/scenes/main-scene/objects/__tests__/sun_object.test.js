import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MockVector3 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => {
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = new MockVector3();
            this.visible = true;
        }
    }
    class SphereGeometry { constructor(radius, width_segments, height_segments) { this.radius = radius; this.width_segments = width_segments; this.height_segments = height_segments; } }
    return { Vector3: MockVector3, Mesh, SphereGeometry };
});

vi.mock('../../rendering/sun_material.js', () => ({
    createSunMaterial: vi.fn(() => ({ uniforms: { u_time: { value: 0.0 } } })),
    updateSunMaterial: vi.fn(),
}));

import { createSun } from '../sun_object.js';
import { createSunMaterial, updateSunMaterial } from '../../rendering/sun_material.js';
import {
    SUN_LIGHT_POSITION, SUN_VISUAL_RADIUS,
    SUN_ORBIT_RADIUS, SUN_ORBIT_HEIGHT, SUN_ORBIT_START_ANGLE, SUN_ORBIT_SPEED,
} from '../../config.js';
import { makeScene } from '../../test-utils/three_mocks.js';

beforeEach(() => vi.clearAllMocks());

describe('createSun', () => {
    test('adds the visual disc mesh to the scene, at the configured sky position', () => {
        const scene = makeScene();
        const sun = createSun(scene);
        expect(scene.add).toHaveBeenCalledWith(sun.mesh);
        expect(sun.position).toBe(sun.mesh.position);
        expect(sun.position).toEqual({ x: SUN_LIGHT_POSITION.x, y: SUN_LIGHT_POSITION.y, z: SUN_LIGHT_POSITION.z });
    });

    test('visual disc mesh uses a freshly created sun material and the configured radius', () => {
        const sun = createSun(makeScene());
        expect(createSunMaterial).toHaveBeenCalledTimes(1);
        expect(sun.mesh.material).toBe(createSunMaterial.mock.results[0].value);
        expect(sun.mesh.geometry.radius).toBe(SUN_VISUAL_RADIUS);
    });

    test('update() forwards to updateSunMaterial with the material and time', () => {
        const sun = createSun(makeScene());
        sun.update(12.5);
        expect(updateSunMaterial).toHaveBeenCalledWith(sun.mesh.material, 12.5);
    });

    test('update() moves the sun along the configured orbit', () => {
        const sun = createSun(makeScene());
        sun.update(37.0);

        const expected_angle = SUN_ORBIT_START_ANGLE + 37.0 * SUN_ORBIT_SPEED;
        expect(sun.position.x).toBeCloseTo(SUN_ORBIT_RADIUS * Math.cos(expected_angle), 9);
        expect(sun.position.y).toBeCloseTo(SUN_ORBIT_HEIGHT, 9);
        expect(sun.position.z).toBeCloseTo(SUN_ORBIT_RADIUS * Math.sin(expected_angle), 9);
    });

    test('update() with different times places the sun at different positions', () => {
        const sun = createSun(makeScene());
        sun.update(0);
        const first_position = { ...sun.position };
        sun.update(15);
        expect(sun.position).not.toEqual(first_position);
    });

    test('getVisible/setVisible show and hide the sun', () => {
        const sun = createSun(makeScene());
        expect(sun.getVisible()).toBe(true);

        sun.setVisible(false);
        expect(sun.getVisible()).toBe(false);
        expect(sun.mesh.visible).toBe(false);

        sun.setVisible(true);
        expect(sun.getVisible()).toBe(true);
        expect(sun.mesh.visible).toBe(true);
    });
});
