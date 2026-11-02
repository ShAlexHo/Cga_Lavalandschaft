import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

vi.mock('../../main-scene/objects/metaball_field_object.js', () => ({
    createMetaballField: vi.fn((scene, { animation, camera_arc_culling }) => {
        const field = {
            animation,
            camera_arc_culling,
            effect: { position: new THREE.Vector3() },
            update: vi.fn(time => animation.stepMetaballAnimation(time)),
            getEruptionIntensity: vi.fn(time => animation.getEruptionIntensity(time)),
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
import { settings as main_scene_smoke_settings } from '../../main-scene/animation/smoke_particles.js';
import { createRandom } from '../../main-scene/random.js';
import {
    RANDOM_SEED, SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO, VOLCANO_AMBIENT_STRENGTH, SMOKE_SPAWN_HEIGHT,
} from '../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';
import { createLandscapeVolcanoController } from '../landscape_volcano_controller.js';
import {
    LANDSCAPE_VOLCANO_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH, LANDSCAPE_FOG_DEFAULT,
} from '../config.js';

let metaball_animation;
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

beforeEach(() => {
    vi.clearAllMocks();
    metaball_animation = main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED));
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 2000);
    camera.position.set(0, 4.5, 25.6);
    camera.updateMatrixWorld();
    renderer = {};
    controller = createLandscapeVolcanoController(scene, { renderer, metaball_animation });
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
        expect(animation).toBe(metaball_animation);
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

    test('without the crack ground, keeps the simple ground and offers no fog and no ground settings', () => {
        expect(scene.children.some(child => child.isMesh && child.geometry.type === 'PlaneGeometry')).toBe(false);
        expect(scene.children.some(child => child.isMesh && child.geometry.type === 'BoxGeometry')).toBe(true);
        expect(controller.setFog).toBeUndefined();
        expect(controller.setGroundCrackColor).toBeUndefined();
    });

    test('without smoke, no particles rise and there are no smoke settings', () => {
        expect(scene.children.some(child => child.isPoints)).toBe(false);
        expect(controller.setSmokeCount).toBeUndefined();
        expect(controller.getSnapshot()).not.toHaveProperty('smoke_count');
    });
});

describe('createLandscapeVolcanoController – with the crack ground', () => {
    let crack_scene;
    let with_cracks;

    function crackGround() {
        return crack_scene.children.find(child => child.isMesh && child.geometry.type === 'PlaneGeometry');
    }

    function groundPlate() {
        return crack_scene.children.find(child => child.isMesh && child.geometry.type === 'BoxGeometry');
    }

    beforeEach(() => {
        crack_scene = new THREE.Scene();
        crack_scene.background = new THREE.Color('#140504');
        with_cracks = createLandscapeVolcanoController(crack_scene, {
            renderer, metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)), with_crack_ground: true,
        });
    });

    test('lays the landscape’s cracked ground at the volcano’s foot, displaced by noise, without its sun', () => {
        const ground = crackGround();
        expect(ground.position.y).toBe(0);
        const positions = ground.geometry.attributes.position.array;
        expect(positions.some((value, i) => Math.abs(value - ground.pristine_positions[i]) > 1e-6)).toBe(true);
        expect(ground.material.uniforms.u_sun_enabled.value).toBe(0.0);
    });

    test('lays only the crack ground, without the simple ground of the earlier scenes', () => {
        expect(crackGround().visible).toBe(true);
        expect(groundPlate()).toBeUndefined();
        expect(with_cracks.setCrackGround).toBeUndefined();
        expect(with_cracks.getSnapshot()).not.toHaveProperty('lava_landscape');
    });

    test('lets the cracks glow along with the scene time, under the landscape’s sky', () => {
        with_cracks.update(1, camera);
        const uniforms = crackGround().material.uniforms;
        expect(uniforms.u_time.value).toBe(with_cracks.getElapsedTime());
        expect(`#${crack_scene.background.getHexString()}`).toBe(MAIN_SCENE_DEFAULTS.skyColor);
        expect(uniforms.u_sky_color.value.getHexString()).toBe(crack_scene.background.getHexString());
        expect(uniforms.u_volcano_position.value.toArray()).toEqual([0, 0, 0]);
    });

    test('the fog lets the ground wash out into the sky at the horizon, and can be switched off', () => {
        expect(with_cracks.getFog()).toBe(LANDSCAPE_FOG_DEFAULT);
        expect(crackGround().material.uniforms.u_edge_fade_strength.value).toBe(1.0);

        with_cracks.setFog(false);
        expect(crackGround().material.uniforms.u_edge_fade_strength.value).toBe(0.0);
        expect(with_cracks.getSnapshot()).toMatchObject({ fog: false });

        with_cracks.resetToDefaults();
        expect(with_cracks.getFog()).toBe(true);
    });

    test('offers the landscape’s rock colours, crack colours, softness, roughness and range, starting at the landscape’s values', () => {
        expect(with_cracks.getGroundColor()).toBe(MAIN_SCENE_DEFAULTS.groundColor);
        expect(with_cracks.getGroundColor4()).toBe(MAIN_SCENE_DEFAULTS.groundColor4);
        expect(with_cracks.getGroundCrackColor2()).toBe(MAIN_SCENE_DEFAULTS.groundCrackColor2);
        expect(with_cracks.getGroundCrackSoftness()).toBe(MAIN_SCENE_DEFAULTS.groundCrackSoftness);
        expect(with_cracks.getGroundProximityRadius()).toBe(MAIN_SCENE_DEFAULTS.groundProximityRadius);
        expect(with_cracks.getGroundDisplacementScale()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementScale);
        expect(with_cracks.getGroundDisplacementFrequency()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementFrequency);

        with_cracks.setGroundCrackColor('#00ff00');
        expect(crackGround().material.uniforms.u_crack_color.value.getHexString()).toBe('00ff00');
    });

    test('changing the roughness reshapes the ground, and the reset brings back the landscape’s ground', () => {
        const before = crackGround().geometry.attributes.position.array.slice();
        with_cracks.setGroundDisplacementScale(2.5);
        expect(crackGround().geometry.attributes.position.array.some((value, i) => Math.abs(value - before[i]) > 1e-4)).toBe(true);

        with_cracks.setGroundColor3('#abcdef');
        const snapshot = with_cracks.getSnapshot();
        expect(snapshot).toMatchObject({ ground_displacement_scale: 2.5, ground_color_3: '#abcdef' });

        with_cracks.resetToDefaults();
        expect(with_cracks.getGroundDisplacementScale()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementScale);
        expect(with_cracks.getGroundColor3()).toBe(MAIN_SCENE_DEFAULTS.groundColor3);
        crackGround().geometry.attributes.position.array.forEach((value, i) => expect(value).toBeCloseTo(before[i], 5));

        with_cracks.applySnapshot(snapshot);
        expect(with_cracks.getSnapshot()).toEqual(snapshot);
    });

});

describe('createLandscapeVolcanoController – with smoke and ash', () => {
    let smoke_scene;
    let with_smoke;

    function smokePoints() {
        return smoke_scene.children.find(child => child.isPoints);
    }

    beforeEach(() => {
        smoke_scene = new THREE.Scene();
        with_smoke = createLandscapeVolcanoController(smoke_scene, {
            renderer, metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)), with_smoke: true,
        });
    });

    test('lets the landscape’s smoke and ash rise above the crater, without its sun', () => {
        expect(smokePoints().position.y).toBe(SMOKE_SPAWN_HEIGHT);
        expect(smokePoints().material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(with_smoke.getSmokeCount()).toBe(MAIN_SCENE_DEFAULTS.smokeCount);
        expect(with_smoke.getSmokeRiseSpeed()).toBe(MAIN_SCENE_DEFAULTS.smokeRiseSpeed);
        expect(with_smoke.getSmokeEmberCoolingTime()).toBe(MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime);
    });

    test('moves the smoke along with the scene time, weaker while the lava pauses', () => {
        with_smoke.update(1, camera);
        const uniforms = smokePoints().material.uniforms;
        expect(uniforms.u_time.value).toBe(with_smoke.getElapsedTime());
        expect(metaballField().getEruptionIntensity).toHaveBeenLastCalledWith(with_smoke.getElapsedTime());
    });

    test('keeps its own particle count, leaving the landscape’s smoke untouched', () => {
        const landscape_count = main_scene_smoke_settings.count;
        with_smoke.setSmokeCount(12);
        expect(smokePoints().geometry.drawRange.count).toBe(12);
        expect(main_scene_smoke_settings.count).toBe(landscape_count);
    });

    test('the smoke settings are part of the snapshot and of the reset', () => {
        with_smoke.setSmokeCount(300);
        with_smoke.setSmokeRiseSpeed(0.05);
        with_smoke.setSmokeEmberCoolingTime(90);
        const snapshot = with_smoke.getSnapshot();
        expect(snapshot).toMatchObject({ smoke_count: 300, smoke_rise_speed: 0.05, smoke_ember_cooling_time: 90 });

        with_smoke.resetToDefaults();
        expect(with_smoke.getSmokeCount()).toBe(MAIN_SCENE_DEFAULTS.smokeCount);

        with_smoke.applySnapshot(snapshot);
        expect(with_smoke.getSnapshot()).toEqual(snapshot);
    });
});
