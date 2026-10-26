import { describe, test, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController } from '../metaballs_controller.js';
import { computeBalls } from '../metaballs_animation.js';
import {
    EFFECT_SCALE, BOX_HALF_EXTENT, DEFAULTS, MAX_BALL_COUNT, SURFACE_DEFAULTS, GROUND_DEFAULTS, GROUND_PLATE_SIZE, GROUND_PATH_SPEED_SCALE,
} from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';

let scene;
let camera;
let controller;

beforeEach(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    camera.position.set(0, 7, 24);
    camera.updateMatrixWorld();
    controller = createMetaballsController(scene);
});

function uniforms() {
    return controller.effect.material.uniforms;
}

function activeBallCount() {
    return Array.from(uniforms().u_ball_strength.value).filter(strength => strength > 0).length;
}

describe('createMetaballsController', () => {
    test('adds the main scene’s metaball effect at the lava’s world scale, its shader sized for this scene’s balls only', () => {
        expect(scene.children).toContain(controller.effect);
        expect(controller.effect.scale.x).toBe(EFFECT_SCALE);
        expect(uniforms().u_ball_strength.value.length).toBe(MAX_BALL_COUNT);
        expect(controller.effect.material.fragmentShader).toContain(`u_ball_center[${MAX_BALL_COUNT}]`);
    });

    test('update() fits the raymarch box around every ball’s whole field, much tighter than the fallback cube', () => {
        controller.update(0, camera);
        const center = uniforms().u_box_center.value;
        const half_extent = uniforms().u_box_half_extent.value;

        computeBalls(controller.getElapsedTime(), { count: DEFAULTS.count, spread: DEFAULTS.spread, subtract_scale: DEFAULTS.subtract_scale })
            .forEach(ball => {
                const reach = 2 * controller.effect.radius_scale * Math.sqrt(ball.strength / ball.subtract);
                for (const axis of ['x', 'y', 'z']) {
                    const local = 2 * ball[axis] - 1;
                    expect(local - reach).toBeGreaterThanOrEqual(center[axis] - half_extent[axis]);
                    expect(local + reach).toBeLessThanOrEqual(center[axis] + half_extent[axis]);
                }
            });
        expect(half_extent.x * half_extent.y * half_extent.z).toBeLessThan(BOX_HALF_EXTENT ** 3 / 4);
    });

    test('the box geometry follows the fitted box, so the rasterized proxy matches what the shader marches', () => {
        controller.update(3, camera);
        const center = uniforms().u_box_center.value;
        const half_extent = uniforms().u_box_half_extent.value;
        controller.effect.geometry.computeBoundingBox();
        const bounds = controller.effect.geometry.boundingBox;

        expect(bounds.min.x).toBeCloseTo(center.x - half_extent.x);
        expect(bounds.max.y).toBeCloseTo(center.y + half_extent.y);
        expect(bounds.max.z).toBeCloseTo(center.z + half_extent.z);
    });

    test('without a field cutoff, the field reaches everywhere and the box falls back to the wide cube', () => {
        controller.setSubtractScale(0);
        controller.update(0, camera);
        expect(uniforms().u_box_half_extent.value.toArray()).toEqual([BOX_HALF_EXTENT, BOX_HALF_EXTENT, BOX_HALF_EXTENT]);
    });

    test('starts with the main scene’s lava look and the demo defaults', () => {
        expect(controller.getColorHot()).toBe(MAIN_SCENE_DEFAULTS.colorHot);
        expect(controller.getGlowColor()).toBe(MAIN_SCENE_DEFAULTS.glowColor);
        expect(controller.getIsolation()).toBe(MAIN_SCENE_DEFAULTS.metaballIsolation);
        expect(controller.getRadius()).toBe(MAIN_SCENE_DEFAULTS.metaballRadius);
        expect(controller.getCount()).toBe(DEFAULTS.count);
        expect(controller.getRaymarchSteps()).toBe(DEFAULTS.raymarch_steps);
    });

    test('update() uploads as many balls as the count asks for', () => {
        controller.update(0, camera);
        expect(activeBallCount()).toBe(DEFAULTS.count);

        controller.setCount(3);
        controller.update(0, camera);
        expect(activeBallCount()).toBe(3);
    });

    test('update() advances time by speed, and not at all while paused', () => {
        controller.setSpeed(2);
        controller.update(0.5, camera);
        expect(controller.getElapsedTime()).toBe(1);

        controller.setPaused(true);
        controller.update(0.5, camera);
        expect(controller.getElapsedTime()).toBe(1);
    });

    test('isolation and radius feed the shader on the next update', () => {
        controller.setIsolation(80);
        controller.setRadius(2);
        controller.update(0, camera);
        expect(uniforms().u_isolation.value).toBe(80);
        expect(controller.effect.radius_scale).toBe(2);
    });

    test('color and raymarch setters write the material uniforms', () => {
        controller.setColorHot('#123456');
        controller.setGlowEnabled(false);
        controller.setRaymarchSteps(12);

        expect(controller.getColorHot()).toBe('#123456');
        expect(uniforms().u_glow_enabled.value).toBe(0.0);
        expect(uniforms().u_raymarch_steps.value).toBe(12);
    });

    test('renders without the main scene’s crust noise, bumping and displacement, also after a reset', () => {
        controller.update(0, camera);
        controller.resetToDefaults();
        controller.update(0, camera);

        expect(uniforms().u_noise_enabled.value).toBe(0.0);
        expect(uniforms().u_bump_enabled.value).toBe(0.0);
        expect(uniforms().u_displacement.value).toBe(0.0);
        expect(Object.keys(controller.getSnapshot()).filter(key => /noise|bump|displacement/.test(key))).toEqual([]);
    });

    test('a snapshot rebuilds an identical controller, so a closed scene resumes as it was left', () => {
        controller.setCount(4);
        controller.setIsolation(90);
        controller.setColorHot('#112233');
        controller.setGlowEnabled(false);
        const snapshot = controller.getSnapshot();

        const rebuilt = createMetaballsController(new THREE.Scene());
        rebuilt.applySnapshot(snapshot);

        expect(rebuilt.getSnapshot()).toEqual(snapshot);
        expect(rebuilt.getCount()).toBe(4);
        expect(rebuilt.getColorHot()).toBe('#112233');
    });

    test('resetToDefaults() restores every parameter', () => {
        controller.setCount(1);
        controller.setIsolation(120);
        controller.setSpeed(0);
        controller.setSubtractScale(0);
        controller.setColorCool('#ffffff');
        controller.setGlowEnabled(false);
        controller.setRaymarchSteps(4);

        controller.resetToDefaults();

        expect(controller.getCount()).toBe(DEFAULTS.count);
        expect(controller.getIsolation()).toBe(MAIN_SCENE_DEFAULTS.metaballIsolation);
        expect(controller.getSpeed()).toBe(DEFAULTS.speed);
        expect(controller.getSubtractScale()).toBe(DEFAULTS.subtract_scale);
        expect(controller.getColorCool()).toBe(MAIN_SCENE_DEFAULTS.colorCool);
        expect(controller.getGlowEnabled()).toBe(MAIN_SCENE_DEFAULTS.glowEnabled);
        expect(controller.getRaymarchSteps()).toBe(DEFAULTS.raymarch_steps);
    });
});

describe('createMetaballsController – with noise', () => {
    let noisy;

    beforeEach(() => {
        noisy = createMetaballsController(new THREE.Scene(), { noise: true });
    });

    test('the plain controller offers no noise parameters at all', () => {
        expect(controller.getNoiseEnabled).toBeUndefined();
        expect(controller.setNoiseColor1).toBeUndefined();
    });

    test('starts with the main scene’s colour noise', () => {
        expect(noisy.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);
        expect(noisy.getNoiseColor1()).toBe(MAIN_SCENE_DEFAULTS.noiseColor1);
        expect(noisy.getNoiseColor2()).toBe(MAIN_SCENE_DEFAULTS.noiseColor2);
    });

    test('noise setters write the material uniforms', () => {
        noisy.setNoiseEnabled(false);
        noisy.setNoiseColor1('#102030');

        expect(noisy.effect.material.uniforms.u_noise_enabled.value).toBe(0.0);
        expect(noisy.getNoiseColor1()).toBe('#102030');
    });

    test('bumping and displacement stay off, and are no parameters', () => {
        noisy.update(0, camera);
        noisy.resetToDefaults();
        noisy.update(0, camera);

        expect(noisy.effect.material.uniforms.u_bump_enabled.value).toBe(0.0);
        expect(noisy.effect.material.uniforms.u_displacement.value).toBe(0.0);
        expect(noisy.setBumpEnabled).toBeUndefined();
        expect(noisy.setDisplacementStrength).toBeUndefined();
        expect(Object.keys(noisy.getSnapshot()).filter(key => /bump|displacement/.test(key))).toEqual([]);
    });

    test('noise settings are part of the snapshot and of the reset', () => {
        noisy.setNoiseColor2('#abcdef');
        noisy.setNoiseEnabled(false);
        const snapshot = noisy.getSnapshot();
        expect(snapshot).toMatchObject({ noise_color_2: '#abcdef', noise_enabled: false });

        noisy.resetToDefaults();
        expect(noisy.getNoiseColor2()).toBe(MAIN_SCENE_DEFAULTS.noiseColor2);
        expect(noisy.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);

        noisy.applySnapshot(snapshot);
        expect(noisy.getSnapshot()).toEqual(snapshot);
    });
});

describe('createMetaballsController – with surface relief', () => {
    let relief;

    function reliefUniforms() {
        return relief.effect.material.uniforms;
    }

    beforeEach(() => {
        relief = createMetaballsController(new THREE.Scene(), { noise: true, surface: true });
    });

    test('starts with the main scene’s colour noise, with bump mapping and with a moderate displacement', () => {
        expect(relief.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);
        expect(relief.getBumpEnabled()).toBe(SURFACE_DEFAULTS.bump_enabled);
        expect(relief.getDisplacementEnabled()).toBe(SURFACE_DEFAULTS.displacement_enabled);
        expect(reliefUniforms().u_bump_enabled.value).toBe(1.0);
        expect(reliefUniforms().u_displacement.value).toBe(SURFACE_DEFAULTS.displacement_strength);
    });

    test('the displacement only reaches the shader while it is switched on', () => {
        relief.setDisplacementStrength(0.03);
        expect(reliefUniforms().u_displacement.value).toBe(0.03);

        relief.setDisplacementEnabled(false);
        expect(reliefUniforms().u_displacement.value).toBe(0.0);
        expect(relief.getDisplacementStrength()).toBe(0.03);

        relief.setDisplacementEnabled(true);
        expect(reliefUniforms().u_displacement.value).toBe(0.03);
    });

    test('bump mapping can be switched off', () => {
        relief.setBumpEnabled(false);
        expect(reliefUniforms().u_bump_enabled.value).toBe(0.0);
    });

    test('the raymarch box grows with the displacement, so the pushed-out crust is never cut off', () => {
        relief.setDisplacementEnabled(false);
        relief.update(0, camera);
        const flat_half_extent = reliefUniforms().u_box_half_extent.value.clone();

        relief.setDisplacementEnabled(true);
        relief.setDisplacementStrength(0.04);
        relief.update(0, camera);

        expect(reliefUniforms().u_box_half_extent.value.x).toBeCloseTo(flat_half_extent.x + 0.04, 9);
    });

    test('surface settings are part of the snapshot and of the reset', () => {
        relief.setBumpEnabled(false);
        relief.setDisplacementStrength(0.02);
        relief.setNoiseEnabled(false);
        const snapshot = relief.getSnapshot();
        expect(snapshot).toMatchObject({ bump_enabled: false, displacement_enabled: true, displacement_strength: 0.02, noise_enabled: false });

        relief.resetToDefaults();
        expect(relief.getBumpEnabled()).toBe(SURFACE_DEFAULTS.bump_enabled);
        expect(relief.getDisplacementStrength()).toBe(SURFACE_DEFAULTS.displacement_strength);
        expect(relief.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);

        relief.applySnapshot(snapshot);
        expect(relief.getSnapshot()).toEqual(snapshot);
    });
});

describe('createMetaballsController – with a bloom pass', () => {
    test('without a bloom pass there is no bloom switch', () => {
        expect(controller.setBloomEnabled).toBeUndefined();
        expect(controller.getSnapshot()).not.toHaveProperty('bloom_enabled');
    });

    test('switches the glow off by zeroing the bloom strength, so the path to the screen and its colours stay the same', () => {
        const bloom_pass = { enabled: true, strength: 0 };
        const with_bloom = createMetaballsController(new THREE.Scene(), { bloom_pass });
        expect(with_bloom.getBloomEnabled()).toBe(true);
        expect(bloom_pass.strength).toBe(MAIN_SCENE_DEFAULTS.bloomStrength);

        with_bloom.setBloomEnabled(false);
        expect(bloom_pass.strength).toBe(0);
        expect(bloom_pass.enabled).toBe(true);
        const snapshot = with_bloom.getSnapshot();
        expect(snapshot).toMatchObject({ bloom_enabled: false });

        with_bloom.resetToDefaults();
        expect(bloom_pass.strength).toBe(MAIN_SCENE_DEFAULTS.bloomStrength);

        with_bloom.applySnapshot(snapshot);
        expect(bloom_pass.strength).toBe(0);
    });
});

describe('createMetaballsController – on the ground', () => {
    let ground_scene;
    let on_ground;

    function groundMesh() {
        return ground_scene.children.find(child => child.isMesh && child !== on_ground.effect);
    }

    beforeEach(() => {
        ground_scene = new THREE.Scene();
        on_ground = createMetaballsController(ground_scene, { ground: true });
    });

    test('the other scenes get no ground and no ground parameters', () => {
        expect(scene.children.filter(child => child.isMesh)).toEqual([controller.effect]);
        expect(controller.setGroundHeight).toBeUndefined();
    });

    test('moves the balls along their paths more slowly, while the shown speed stays 1', () => {
        on_ground.update(10, camera);
        const expected = computeBalls(10 * GROUND_PATH_SPEED_SCALE, { ...DEFAULTS, count: GROUND_DEFAULTS.count }, { planar: true });
        const center = on_ground.effect.material.uniforms.u_ball_center.value[0];

        expect(on_ground.getSpeed()).toBe(DEFAULTS.speed);
        expect(on_ground.getElapsedTime()).toBe(10);
        expect(center.x).toBeCloseTo(2 * expected[0].x - 1, 9);
        expect(center.z).toBeCloseTo(2 * expected[0].z - 1, 9);
    });

    test('starts with its own, larger number of balls', () => {
        expect(on_ground.getCount()).toBe(GROUND_DEFAULTS.count);
        on_ground.setCount(12);
        on_ground.resetToDefaults();
        expect(on_ground.getCount()).toBe(GROUND_DEFAULTS.count);
    });

    test('adds a small, bounded plate whose top lies at the default height, lit for the standard material', () => {
        expect(groundMesh().geometry.parameters).toMatchObject({
            width: GROUND_PLATE_SIZE.width, height: GROUND_PLATE_SIZE.thickness, depth: GROUND_PLATE_SIZE.depth,
        });
        expect(groundMesh().position.y + GROUND_PLATE_SIZE.thickness / 2).toBeCloseTo(GROUND_DEFAULTS.ground_height, 9);
        expect(on_ground.getGroundHeight()).toBeCloseTo(GROUND_DEFAULTS.ground_height, 9);
        expect(on_ground.getGroundVisible()).toBe(GROUND_DEFAULTS.ground_visible);
        expect(ground_scene.children.some(child => child.isLight)).toBe(true);
    });

    test('moves every ball on one horizontal plane', () => {
        on_ground.setCount(MAX_BALL_COUNT);
        for (const delta_seconds of [0, 3.7, 12]) {
            on_ground.update(delta_seconds, camera);
            const centers = on_ground.effect.material.uniforms.u_ball_center.value.slice(0, MAX_BALL_COUNT);
            expect(new Set(centers.map(center => center.y)).size).toBe(1);
            expect(new Set(centers.map(center => center.x)).size).toBeGreaterThan(1);
        }
    });

    test('height and visibility move and hide the floor, and are part of the snapshot and of the reset', () => {
        on_ground.setGroundHeight(0.5);
        on_ground.setGroundVisible(false);
        expect(groundMesh().position.y).toBeCloseTo(0.5 - GROUND_PLATE_SIZE.thickness / 2, 9);
        expect(groundMesh().visible).toBe(false);
        const snapshot = on_ground.getSnapshot();
        expect(snapshot).toMatchObject({ ground_height: 0.5, ground_visible: false });

        on_ground.resetToDefaults();
        expect(on_ground.getGroundHeight()).toBe(GROUND_DEFAULTS.ground_height);
        expect(on_ground.getGroundVisible()).toBe(true);

        on_ground.applySnapshot(snapshot);
        expect(on_ground.getSnapshot()).toEqual(snapshot);
    });
});
