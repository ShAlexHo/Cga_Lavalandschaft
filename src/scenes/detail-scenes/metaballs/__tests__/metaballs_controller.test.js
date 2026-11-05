import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController, createFloatingScenery } from '../metaballs_controller.js';
import { computeBalls } from '../metaballs_animation.js';
import { MESH_SCALE, BOX_HALF_EXTENT, METABALLS_DEFAULTS, MAX_BALL_COUNT, SURFACE_DEFAULTS, BALL_STRENGTH } from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

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
    return controller.mesh.material.uniforms;
}

function activeBallCount() {
    return Array.from(uniforms().u_ball_strength.value).filter(strength => strength > 0).length;
}

describe('createMetaballsController', () => {
    test('adds the main scene’s metaball mesh at the lava’s world scale, its shader sized for this scene’s balls only', () => {
        expect(scene.children).toContain(controller.mesh);
        expect(controller.mesh.scale.x).toBe(MESH_SCALE);
        expect(uniforms().u_ball_strength.value.length).toBe(MAX_BALL_COUNT);
        expect(controller.mesh.material.fragmentShader).toContain(`u_ball_center[${MAX_BALL_COUNT}]`);
    });

    test('update() fits the raymarch box around every ball’s whole field, much tighter than the fallback cube', () => {
        controller.update(0, camera);
        const center = uniforms().u_box_center.value;
        const half_extent = uniforms().u_box_half_extent.value;

        computeBalls(controller.getElapsedTime(), { count: METABALLS_DEFAULTS.count, spread: METABALLS_DEFAULTS.spread, subtract_scale: METABALLS_DEFAULTS.subtract_scale })
            .forEach(ball => {
                const reach = 2 * controller.mesh.radius_scale * Math.sqrt(ball.strength / ball.subtract);
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
        controller.mesh.geometry.computeBoundingBox();
        const bounds = controller.mesh.geometry.boundingBox;

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
        expect(controller.getCount()).toBe(METABALLS_DEFAULTS.count);
        expect(controller.getRaymarchSteps()).toBe(METABALLS_DEFAULTS.raymarch_steps);
    });

    test('update() uploads as many balls as the count asks for', () => {
        controller.update(0, camera);
        expect(activeBallCount()).toBe(METABALLS_DEFAULTS.count);

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
        expect(controller.mesh.radius_scale).toBe(2);
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

        expect(controller.getCount()).toBe(METABALLS_DEFAULTS.count);
        expect(controller.getIsolation()).toBe(MAIN_SCENE_DEFAULTS.metaballIsolation);
        expect(controller.getSpeed()).toBe(METABALLS_DEFAULTS.speed);
        expect(controller.getSubtractScale()).toBe(METABALLS_DEFAULTS.subtract_scale);
        expect(controller.getColorCool()).toBe(MAIN_SCENE_DEFAULTS.colorCool);
        expect(controller.getGlowEnabled()).toBe(MAIN_SCENE_DEFAULTS.glowEnabled);
        expect(controller.getRaymarchSteps()).toBe(METABALLS_DEFAULTS.raymarch_steps);
    });
});

describe('createMetaballsController – with noise', () => {
    let noisy;

    beforeEach(() => {
        noisy = createMetaballsController(new THREE.Scene(), { mode: { with_noise: true } });
    });

    test('the plain controller keeps the noise off, and its noise settings out of the snapshot', () => {
        expect(controller.mesh.material.uniforms.u_noise_enabled.value).toBe(0.0);
        expect(Object.keys(controller.getSnapshot()).filter(key => key.startsWith('noise'))).toEqual([]);
    });

    test('starts with the main scene’s colour noise', () => {
        expect(noisy.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);
        expect(noisy.getNoiseColor1()).toBe(MAIN_SCENE_DEFAULTS.noiseColor1);
        expect(noisy.getNoiseColor2()).toBe(MAIN_SCENE_DEFAULTS.noiseColor2);
    });

    test('noise setters write the material uniforms', () => {
        noisy.setNoiseEnabled(false);
        noisy.setNoiseColor1('#102030');

        expect(noisy.mesh.material.uniforms.u_noise_enabled.value).toBe(0.0);
        expect(noisy.getNoiseColor1()).toBe('#102030');
    });

    test('bumping and displacement stay off, and stay out of the snapshot', () => {
        noisy.update(0, camera);
        noisy.resetToDefaults();
        noisy.update(0, camera);

        expect(noisy.mesh.material.uniforms.u_bump_enabled.value).toBe(0.0);
        expect(noisy.mesh.material.uniforms.u_displacement.value).toBe(0.0);
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
        return relief.mesh.material.uniforms;
    }

    beforeEach(() => {
        relief = createMetaballsController(new THREE.Scene(), { mode: { with_noise: true, with_surface: true } });
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

describe('createMetaballsController – with a scenery', () => {
    function makeScenery(created_in) {
        const scenery_settings = { shown: true };
        return vi.fn((scenery_scene, settings) => {
            created_in.push({ scenery_scene, settings });
            return {
                activate: vi.fn(),
                deactivate: vi.fn(),
                computeBalls: vi.fn(elapsed_time => [{ x: 0.5 + elapsed_time / 100, y: 0.5, z: 0.5, strength: BALL_STRENGTH, subtract: 30 }]),
                resetToDefaults: vi.fn(controller => { settings.count = 2; scenery_settings.shown = true; controller.setRaymarchSteps(7); }),
                methods: { getShown: () => scenery_settings.shown, setShown: value => { scenery_settings.shown = value; } },
                setting_accessors: { shown: [() => scenery_settings.shown, value => { scenery_settings.shown = value; }] },
            };
        });
    }

    test('without a scenery, the balls float alone: no further meshes, no lights, no scenery parameters', () => {
        expect(scene.children.filter(child => child.isMesh)).toEqual([controller.mesh]);
        expect(scene.children.some(child => child.isLight)).toBe(false);
        expect(controller.setGroundVisible).toBeUndefined();
        expect(controller.setSpawnHeight).toBeUndefined();
    });

    test('builds the scenery on its scene, moves the balls by it and resets with it, after its own defaults', () => {
        const created_in = [];
        const createScenery = makeScenery(created_in);
        const with_scenery = createMetaballsController(scene, { sceneries: { custom: createScenery } });
        const scenery = createScenery.mock.results[0].value;

        expect(created_in[0].scenery_scene).toBe(scene);
        expect(with_scenery.getCount()).toBe(2);
        expect(with_scenery.getRaymarchSteps()).toBe(7);

        with_scenery.setSpeed(2);
        with_scenery.update(1.5, camera);
        expect(scenery.computeBalls).toHaveBeenLastCalledWith(3);
        expect(with_scenery.mesh.material.uniforms.u_ball_center.value[0].x).toBeCloseTo(2 * (0.5 + 3 / 100) - 1, 9);
    });

    test('its parameters become controller methods and part of the snapshot and of the reset', () => {
        const with_scenery = createMetaballsController(scene, { sceneries: { custom: makeScenery([]) } });
        with_scenery.setShown(false);
        const snapshot = with_scenery.getSnapshot();
        expect(snapshot).toMatchObject({ shown: false });

        with_scenery.resetToDefaults();
        expect(with_scenery.getShown()).toBe(true);

        with_scenery.applySnapshot(snapshot);
        expect(with_scenery.getSnapshot()).toEqual(snapshot);
    });
});

describe('createMetaballsController – switching between the scenes of a group', () => {
    test('noise and surface follow the mode, and so do the settings in the snapshot', () => {
        const shared = createMetaballsController(new THREE.Scene(), { mode: { with_noise: true, with_surface: true } });
        shared.setNoiseColor1('#102030');

        shared.applyMode({});
        shared.resetToDefaults();
        shared.update(0, camera);

        const uniforms = shared.mesh.material.uniforms;
        expect(uniforms.u_noise_enabled.value).toBe(0.0);
        expect(uniforms.u_bump_enabled.value).toBe(0.0);
        expect(uniforms.u_displacement.value).toBe(0.0);
        expect(Object.keys(shared.getSnapshot()).filter(key => /noise|bump|displacement/.test(key))).toEqual([]);

        shared.applyMode({ with_noise: true });
        shared.resetToDefaults();
        expect(shared.getNoiseEnabled()).toBe(MAIN_SCENE_DEFAULTS.noiseEnabled);
        expect(shared.getNoiseColor1()).toBe(MAIN_SCENE_DEFAULTS.noiseColor1);
        expect(shared.getSnapshot()).toHaveProperty('noise_color_1');
        expect(shared.getSnapshot()).not.toHaveProperty('bump_enabled');
    });

    test('every scenery is built once, only the chosen one moves the balls, and the others are put away', () => {
        const created_in = [];
        const scene_for_both = new THREE.Scene();
        const shared = createMetaballsController(scene_for_both, {
            sceneries: { floating: createFloatingScenery, custom: makeSceneryFor(created_in) },
        });
        const custom = created_in[0].scenery;
        expect(created_in).toHaveLength(1);
        expect(custom.deactivate).toHaveBeenCalled();
        expect(shared.getSnapshot()).not.toHaveProperty('shown');

        shared.applyMode({ scenery: 'custom' });
        shared.resetToDefaults();
        expect(custom.activate).toHaveBeenCalledWith(expect.objectContaining({ scenery: 'custom' }));
        shared.update(1, camera);
        expect(custom.computeBalls).toHaveBeenCalled();
        expect(shared.getSnapshot()).toMatchObject({ shown: true });
        expect(created_in).toHaveLength(1);
    });

    function makeSceneryFor(created_in) {
        return (scenery_scene, settings) => {
            const scenery = {
                activate: vi.fn(),
                deactivate: vi.fn(),
                computeBalls: vi.fn(() => [{ x: 0.5, y: 0.5, z: 0.5, strength: BALL_STRENGTH, subtract: 30 }]),
                resetToDefaults: vi.fn(() => { settings.count = 2; }),
                methods: {},
                setting_accessors: { shown: [() => true, () => {}] },
            };
            created_in.push({ scenery_scene, scenery });
            return scenery;
        };
    }
});
