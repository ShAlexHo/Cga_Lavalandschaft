import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

vi.mock('../../main-scene/objects/metaball_field_object.js', () => ({
    createMetaballField: vi.fn((scene, { animation, camera_arc_culling }) => {
        const field = {
            animation,
            camera_arc_culling,
            effect: { position: new THREE.Vector3() },
            update: vi.fn(time => animation.stepMetaballAnimation(time)),
            fastForward: vi.fn((duration, step, camera, volcano_position) => {
                for (let i = 0; i <= Math.floor(duration / step); i++) field.update(i * step, camera, volcano_position);
            }),
            renderFieldTexture: vi.fn(),
        };
        return field;
    }),
}));

import { createMetaballField } from '../../main-scene/objects/metaball_field_object.js';
import * as main_scene_animation from '../../main-scene/animation/metaball_animation.js';
import {
    SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO, VOLCANO_AMBIENT_STRENGTH,
} from '../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';
import { LANDSCAPE_VOLCANO_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH } from '../config.js';

let createLandscapeVolcanoController;
let scene;
let camera;
let renderer;
let controller;

function metaballField() {
    return createMetaballField.mock.results.at(-1).value;
}

function sceneMesh(predicate) {
    return scene.children.find(child => child.isMesh && predicate(child));
}

function landscapeVolcano() {
    return sceneMesh(child => child.material.isShaderMaterial);
}

function simplifiedVolcano() {
    return sceneMesh(child => child.geometry.type === 'LatheGeometry' && !child.material.isShaderMaterial);
}

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    ({ createLandscapeVolcanoController } = await import('../landscape_volcano_controller.js'));
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 2000);
    camera.position.set(0, 4.5, 25.6);
    camera.updateMatrixWorld();
    renderer = {};
    controller = createLandscapeVolcanoController(scene, { renderer });
});

describe('createLandscapeVolcanoController', () => {
    test('shows the landscape’s cracked volcano, without its sun, on the simple ground of the volcano scenes', () => {
        const volcano = landscapeVolcano();
        const positions = volcano.geometry.attributes.position.array;
        expect(positions.some((value, i) => Math.abs(value - volcano.pristine_positions[i]) > 1e-6)).toBe(true);
        expect(volcano.material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(scene.children.some(child => child.isMesh && child.geometry.type === 'SphereGeometry')).toBe(false);
        expect(sceneMesh(child => child.geometry.type === 'BoxGeometry')).toBeDefined();
        expect(scene.children.filter(child => child.isLight)).toHaveLength(3);
    });

    test('lets the landscape’s metaballs flow from the landscape’s height at their own speed, six times as fast by default, with an animation of their own', () => {
        const { animation, effect, camera_arc_culling } = metaballField();
        expect(animation).not.toBe(main_scene_animation);
        expect(camera_arc_culling).toBe(false);
        expect(animation.settings.speed_factor).toBe(MAIN_SCENE_DEFAULTS.metaballSpeed);
        expect(controller.getSpeed()).toBe(6);
        expect(animation.settings.count).toBe(MAIN_SCENE_DEFAULTS.metaballCount);
        expect(effect.position.y).toBeCloseTo(METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO + MAIN_SCENE_DEFAULTS.metaballHeight, 9);
    });

    test('brightens the volcano evenly from every side with more ambient light than in the landscape', () => {
        expect(landscapeVolcano().material.uniforms.u_ambient_strength.value).toBe(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
        expect(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH).toBeGreaterThan(VOLCANO_AMBIENT_STRENGTH);
    });

    test('warms the lava up once, like the landscape, and then runs on at the chosen speed', () => {
        controller.update(0, camera);
        const field = metaballField();
        const warm_up_steps = Math.floor(SCENE_WARM_UP_SECONDS / SCENE_WARM_UP_STEP_SECONDS) + 1;
        expect(field.fastForward).toHaveBeenCalledTimes(1);
        expect(field.fastForward).toHaveBeenCalledWith(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, camera, expect.anything());
        expect(field.update).toHaveBeenCalledTimes(warm_up_steps + 1);
        expect(field.update).toHaveBeenLastCalledWith(SCENE_WARM_UP_SECONDS, camera, expect.anything());
        expect(field.renderFieldTexture).toHaveBeenCalledWith(renderer);

        controller.update(2, camera);
        expect(field.update).toHaveBeenCalledTimes(warm_up_steps + 2);
        expect(controller.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2 * LANDSCAPE_VOLCANO_DEFAULTS.speed);

        controller.setPaused(true);
        controller.update(2, camera);
        expect(controller.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2 * LANDSCAPE_VOLCANO_DEFAULTS.speed);
    });

    test('the simplified volcano lies, ring by ring, at the average height of the cracked one', () => {
        const cracked = landscapeVolcano().geometry;
        const { points, segments } = cracked.parameters;
        const simplified_profile = simplifiedVolcano().geometry.parameters.points;
        expect(simplified_profile).toHaveLength(points.length);

        simplified_profile.forEach((point, j) => {
            const ring_heights = Array.from({ length: segments }, (_, i) => cracked.attributes.position.getY(i * points.length + j));
            expect(point.x).toBeCloseTo(points[j].x, 9);
            expect(point.y).toBeCloseTo(ring_heights.reduce((sum, height) => sum + height, 0) / segments, 9);
            expect(point.y).toBeLessThanOrEqual(points[j].y + 1e-9);
        });
        expect(simplified_profile.some((point, j) => point.y < points[j].y - 0.1)).toBe(true);
    });

    test('switches between the cracked and the simplified volcano', () => {
        expect(controller.getSurfaceIrregularities()).toBe(true);
        expect(landscapeVolcano().visible).toBe(true);
        expect(simplifiedVolcano().visible).toBe(false);

        controller.setSurfaceIrregularities(false);
        expect(landscapeVolcano().visible).toBe(false);
        expect(simplifiedVolcano().visible).toBe(true);
    });

    test('the volcano choice and the speed are part of the snapshot and of the reset, the ground always stays', () => {
        controller.setSurfaceIrregularities(false);
        controller.setSpeed(2.5);
        const snapshot = controller.getSnapshot();
        expect(snapshot).toEqual({ paused: false, speed: 2.5, surface_irregularities: false });
        expect(controller.setGroundVisible).toBeUndefined();

        controller.resetToDefaults();
        expect(controller.getSurfaceIrregularities()).toBe(true);
        expect(sceneMesh(child => child.geometry.type === 'BoxGeometry').visible).toBe(true);
        expect(controller.getSpeed()).toBe(LANDSCAPE_VOLCANO_DEFAULTS.speed);

        controller.applySnapshot(snapshot);
        expect(controller.getSnapshot()).toEqual(snapshot);
        expect(simplifiedVolcano().visible).toBe(true);
    });
});
