import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

vi.mock('../../../main-scene/objects/metaball_field_object.js', () => ({
    createMetaballField: vi.fn((scene, { animation, camera_arc_culling }) => {
        const field = {
            animation,
            camera_arc_culling,
            mesh: { position: new THREE.Vector3() },
            update: vi.fn(time => field.animation.stepMetaballAnimation(time)),
            getEruptionIntensity: vi.fn(time => field.animation.getEruptionIntensity(time)),
            fastForward: vi.fn((duration, step, camera, volcano_position) => {
                for (let i = 0; i <= Math.floor(duration / step); i++) field.update(i * step, camera, volcano_position);
            }),
            renderFieldTexture: vi.fn(),
            setCameraArcCulling: vi.fn(value => { field.camera_arc_culling = value; }),
            setAnimation: vi.fn(next_animation => { field.animation = next_animation; }),
        };
        return field;
    }),
}));

import { createMetaballField } from '../../../main-scene/objects/metaball_field_object.js';
import * as main_scene_animation from '../../../main-scene/animation/metaball_animation.js';
import { settings as main_scene_smoke_settings } from '../../../main-scene/animation/smoke_particles.js';
import { createRandom } from '../../../main-scene/random.js';
import {
    RANDOM_SEED, SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_HEIGHT_ABOVE_VOLCANO, VOLCANO_AMBIENT_STRENGTH, SMOKE_SPAWN_HEIGHT,
} from '../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';
import { createLandscapeController } from '../landscape_controller.js';
import { DETAIL_BACKGROUND_COLOR } from '../../shared/config.js';
import { LANDSCAPE_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH, LANDSCAPE_FOG_DEFAULT } from '../config.js';

let metaball_animation;
let scene;
let camera;
let renderer;
let controller;

function metaballField() {
    return createMetaballField.mock.results.at(-1).value;
}

function meshOf(target_scene, predicate) {
    return target_scene.children.find(child => child.isMesh && predicate(child));
}

function landscapeVolcanoOf(target_scene) {
    return meshOf(target_scene, child => child.material.isShaderMaterial && child.geometry.type === 'LatheGeometry');
}

function groundPlateOf(target_scene) {
    return meshOf(target_scene, child => child.geometry.type === 'BoxGeometry');
}

function crackGroundOf(target_scene) {
    return meshOf(target_scene, child => child.geometry.type === 'PlaneGeometry');
}

function smokePointsOf(target_scene) {
    return target_scene.children.find(child => child.isPoints);
}

function sunMeshOf(target_scene) {
    return meshOf(target_scene, child => child.geometry.type === 'SphereGeometry');
}

function sceneMesh(predicate) {
    return meshOf(scene, predicate);
}

function landscapeVolcano() {
    return landscapeVolcanoOf(scene);
}

function simplifiedVolcano() {
    return sceneMesh(child => child.geometry.type === 'LatheGeometry' && !child.material.isShaderMaterial);
}

function makeGodRaysPass() {
    const values = {};
    const pass = { enabled: true, setTargets: vi.fn() };
    for (const name of ['Weight', 'Exposure', 'Decay', 'Density', 'TintColor']) {
        pass[`get${name}`] = () => values[name];
        pass[`set${name}`] = vi.fn(value => { values[name] = value; });
    }
    return pass;
}

function createInMode(mode, options = {}) {
    const target_scene = new THREE.Scene();
    target_scene.background = new THREE.Color('#000000');
    const created = createLandscapeController(target_scene, {
        renderer, mode: { metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)), ...mode }, ...options,
    });
    return { target_scene, created };
}

beforeEach(() => {
    vi.clearAllMocks();
    metaball_animation = main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED));
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 2000);
    camera.position.set(0, 4.5, 25.6);
    camera.updateMatrixWorld();
    renderer = {};
    controller = createLandscapeController(scene, { renderer, mode: { metaball_animation } });
});

describe('createLandscapeController', () => {
    test('shows the landscape’s cracked volcano, without its sun, on the simple ground of the volcano scenes, under their dark sky', () => {
        const volcano = landscapeVolcano();
        const positions = volcano.geometry.attributes.position.array;
        expect(positions.some((value, i) => Math.abs(value - volcano.pristine_positions[i]) > 1e-6)).toBe(true);
        expect(volcano.material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(sunMeshOf(scene).visible).toBe(false);
        expect(groundPlateOf(scene).visible).toBe(true);
        expect(crackGroundOf(scene).visible).toBe(false);
        expect(smokePointsOf(scene).visible).toBe(false);
        expect(`#${scene.background.getHexString()}`).toBe(DETAIL_BACKGROUND_COLOR);
    });

    test('lets the landscape’s metaballs flow from the landscape’s height at their own speed, six times as fast by default, with an animation of their own', () => {
        const { animation, mesh, camera_arc_culling } = metaballField();
        expect(animation).toBe(metaball_animation);
        expect(animation).not.toBe(main_scene_animation);
        expect(camera_arc_culling).toBe(false);
        expect(animation.settings.speed_factor).toBe(MAIN_SCENE_DEFAULTS.metaballSpeed);
        expect(controller.getSpeed()).toBe(6);
        expect(animation.settings.count).toBe(MAIN_SCENE_DEFAULTS.metaballCount);
        expect(mesh.position.y).toBeCloseTo(METABALL_HEIGHT_ABOVE_VOLCANO + MAIN_SCENE_DEFAULTS.metaballHeight, 9);
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
        expect(controller.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2 * LANDSCAPE_DEFAULTS.speed);

        controller.setPaused(true);
        controller.update(2, camera);
        expect(controller.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2 * LANDSCAPE_DEFAULTS.speed);
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
        expect(snapshot).toEqual({ paused: false, speed: 2.5, surface_irregularities: false, metaballs_visible: true });
        expect(controller.setGroundVisible).toBeUndefined();

        controller.resetToDefaults();
        expect(controller.getSurfaceIrregularities()).toBe(true);
        expect(sceneMesh(child => child.geometry.type === 'BoxGeometry').visible).toBe(true);
        expect(controller.getSpeed()).toBe(LANDSCAPE_DEFAULTS.speed);

        controller.applySnapshot(snapshot);
        expect(controller.getSnapshot()).toEqual(snapshot);
        expect(simplifiedVolcano().visible).toBe(true);
    });

    test('hides all metaballs, while the lava keeps flowing underneath, and the reset shows them again', () => {
        const field = metaballField();
        expect(controller.getMetaballsVisible()).toBe(true);
        expect(field.mesh.visible).toBe(true);
        controller.update(0, camera);

        controller.setMetaballsVisible(false);
        expect(field.mesh.visible).toBe(false);
        expect(controller.getSnapshot()).toMatchObject({ metaballs_visible: false });
        field.update.mockClear();
        field.renderFieldTexture.mockClear();
        controller.update(1, camera);
        expect(field.update).toHaveBeenCalledWith(controller.getElapsedTime(), camera, expect.anything());
        expect(field.renderFieldTexture).not.toHaveBeenCalled();

        controller.resetToDefaults();
        expect(field.mesh.visible).toBe(true);
    });

    test('its snapshot holds only its own settings, none of the fog, the crack ground, the smoke or the sun', () => {
        expect(Object.keys(controller.getSnapshot())).toEqual(['paused', 'speed', 'surface_irregularities', 'metaballs_visible']);
    });
});

describe('createLandscapeController – with the crack ground', () => {
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
        with_cracks = createLandscapeController(crack_scene, {
            renderer, mode: { with_crack_ground: true, metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)) },
        });
    });

    test('lays the landscape’s cracked ground at the volcano’s foot, displaced by noise, without its sun', () => {
        const ground = crackGround();
        expect(ground.position.y).toBe(0);
        const positions = ground.geometry.attributes.position.array;
        expect(positions.some((value, i) => Math.abs(value - ground.pristine_positions[i]) > 1e-6)).toBe(true);
        expect(ground.material.uniforms.u_sun_enabled.value).toBe(0.0);
    });

    test('shows only the crack ground, hiding the simple ground of the earlier scenes', () => {
        expect(crackGround().visible).toBe(true);
        expect(groundPlate().visible).toBe(false);
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

    test('offers two rock colours, two crack colours, softness, roughness and range, starting at the landscape’s values', () => {
        expect(with_cracks.getGroundColor()).toBe(MAIN_SCENE_DEFAULTS.groundColor);
        expect(with_cracks.getGroundColor2()).toBe(MAIN_SCENE_DEFAULTS.groundColor2);
        expect(with_cracks.getGroundCrackColor2()).toBe(MAIN_SCENE_DEFAULTS.groundCrackColor2);
        expect(with_cracks.getGroundCrackSoftness()).toBe(MAIN_SCENE_DEFAULTS.groundCrackSoftness);
        expect(with_cracks.getGroundProximityRadius()).toBe(MAIN_SCENE_DEFAULTS.groundProximityRadius);
        expect(with_cracks.getGroundDisplacementScale()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementScale);
        expect(with_cracks.getGroundDisplacementFrequency()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementFrequency);

        with_cracks.setGroundCrackColor('#00ff00');
        expect(crackGround().material.uniforms.u_crack_color.value.getHexString()).toBe('00ff00');
    });

    test('the third and fourth rock and crack colours are not adjustable, stay out of the snapshot and keep the landscape’s values', () => {
        for (const method_suffix of ['Color3', 'Color4', 'CrackColor3', 'CrackColor4']) {
            expect(with_cracks[`setGround${method_suffix}`]).toBeUndefined();
        }
        for (const key of ['ground_color_3', 'ground_color_4', 'ground_crack_color_3', 'ground_crack_color_4']) {
            expect(with_cracks.getSnapshot()).not.toHaveProperty(key);
        }

        crackGround().material.uniforms.u_rock_color_3.value.set('#abcdef');
        with_cracks.resetToDefaults();
        expect(`#${crackGround().material.uniforms.u_rock_color_3.value.getHexString()}`).toBe(MAIN_SCENE_DEFAULTS.groundColor3.toLowerCase());
    });

    test('changing the roughness reshapes the ground, and the reset brings back the landscape’s ground', () => {
        const before = crackGround().geometry.attributes.position.array.slice();
        with_cracks.setGroundDisplacementScale(2.5);
        expect(crackGround().geometry.attributes.position.array.some((value, i) => Math.abs(value - before[i]) > 1e-4)).toBe(true);

        with_cracks.setGroundColor2('#abcdef');
        const snapshot = with_cracks.getSnapshot();
        expect(snapshot).toMatchObject({ ground_displacement_scale: 2.5, ground_color_2: '#abcdef' });

        with_cracks.resetToDefaults();
        expect(with_cracks.getGroundDisplacementScale()).toBe(MAIN_SCENE_DEFAULTS.groundDisplacementScale);
        expect(with_cracks.getGroundColor2()).toBe(MAIN_SCENE_DEFAULTS.groundColor2);
        crackGround().geometry.attributes.position.array.forEach((value, i) => expect(value).toBeCloseTo(before[i], 5));

        with_cracks.applySnapshot(snapshot);
        expect(with_cracks.getSnapshot()).toEqual(snapshot);
    });

});

describe('createLandscapeController – with smoke and ash', () => {
    let smoke_scene;
    let with_smoke;

    function smokePoints() {
        return smoke_scene.children.find(child => child.isPoints);
    }

    beforeEach(() => {
        smoke_scene = new THREE.Scene();
        with_smoke = createLandscapeController(smoke_scene, {
            renderer, mode: { with_smoke: true, metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)) },
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

describe('createLandscapeController – with the sun and its god rays', () => {
    let sun_scene;
    let with_sun;
    let god_rays_pass;

    function sunMesh() {
        return sun_scene.children.find(child => child.isMesh && child.geometry.type === 'SphereGeometry');
    }

    function sunLitMaterials() {
        return [landscapeVolcanoOf(sun_scene), crackGroundOf(sun_scene), smokePointsOf(sun_scene)].map(object => object.material);
    }

    beforeEach(() => {
        sun_scene = new THREE.Scene();
        sun_scene.background = new THREE.Color('#140504');
        god_rays_pass = makeGodRaysPass();
        with_sun = createLandscapeController(sun_scene, {
            renderer, god_rays_pass,
            mode: { with_smoke: true, with_crack_ground: true, with_sun: true, metaball_animation: main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED)) },
        });
    });

    test('brings the landscape’s sun, which lights the volcano, the ground and the smoke, focused on the volcano and the ground', () => {
        expect(sunMesh()).toBeDefined();
        expect(sunMesh().visible).toBe(true);
        expect(god_rays_pass.enabled).toBe(true);
        for (const material of sunLitMaterials()) {
            expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
            expect(material.uniforms.u_sun_strength.value).toBe(MAIN_SCENE_DEFAULTS.sunStrength);
        }
        expect(landscapeVolcanoOf(sun_scene).material.uniforms.u_sun_focus.value).toBe(MAIN_SCENE_DEFAULTS.sunFocus);
        expect(crackGroundOf(sun_scene).material.uniforms.u_sun_focus.value).toBe(MAIN_SCENE_DEFAULTS.sunFocus);
    });

    test('the god rays start at the sun and are blocked by the ground and the volcano', () => {
        expect(god_rays_pass.setTargets).toHaveBeenCalledWith({
            sun_mesh: sunMesh(), occluder_meshes: [crackGroundOf(sun_scene), landscapeVolcanoOf(sun_scene)],
        });
        expect(with_sun.getGodRaysWeight()).toBe(MAIN_SCENE_DEFAULTS.godRaysWeight);
        expect(with_sun.getGodRaysTintColor()).toBe(MAIN_SCENE_DEFAULTS.godRaysTintColor);
    });

    test('the sun moves along its orbit with the scene time, and its light follows it', () => {
        with_sun.update(0, camera);
        const start = sunMesh().position.clone();
        with_sun.update(100, camera);
        expect(sunMesh().position.distanceTo(start)).toBeGreaterThan(1);

        const expected_view_position = sunMesh().position.clone().applyMatrix4(camera.matrixWorldInverse);
        const uniform = landscapeVolcanoOf(sun_scene).material.uniforms.u_sun_position.value;
        expect(uniform.distanceTo(expected_view_position)).toBeLessThan(1e-6);
    });

    test('leaving the sun’s scene hides the sun and switches off its god rays and its light on every object', () => {
        with_sun.applyMode({ with_smoke: true, with_crack_ground: true });
        expect(sunMesh().visible).toBe(false);
        expect(god_rays_pass.enabled).toBe(false);
        for (const material of sunLitMaterials()) expect(material.uniforms.u_sun_enabled.value).toBe(0.0);

        with_sun.applyMode({ with_smoke: true, with_crack_ground: true, with_sun: true });
        expect(sunMesh().visible).toBe(true);
        expect(god_rays_pass.enabled).toBe(true);
    });

    test('the sun itself is not adjustable, stays out of the snapshot and the reset brings back the landscape’s sun', () => {
        for (const name of ['SunVisible', 'SunStrength', 'SunFocus']) expect(with_sun[`set${name}`]).toBeUndefined();
        for (const key of ['sun_visible', 'sun_strength', 'sun_focus']) expect(with_sun.getSnapshot()).not.toHaveProperty(key);

        for (const material of sunLitMaterials()) material.uniforms.u_sun_strength.value = 0.2;
        landscapeVolcanoOf(sun_scene).material.uniforms.u_sun_focus.value = 9;
        with_sun.resetToDefaults();
        for (const material of sunLitMaterials()) expect(material.uniforms.u_sun_strength.value).toBe(MAIN_SCENE_DEFAULTS.sunStrength);
        expect(landscapeVolcanoOf(sun_scene).material.uniforms.u_sun_focus.value).toBe(MAIN_SCENE_DEFAULTS.sunFocus);
    });

    test('the god ray settings are part of the snapshot and of the reset', () => {
        with_sun.setGodRaysDecay(0.9);
        with_sun.setGodRaysTintColor('#ffaa00');
        const snapshot = with_sun.getSnapshot();
        expect(snapshot).toMatchObject({ god_rays_decay: 0.9, god_rays_tint_color: '#ffaa00' });

        with_sun.resetToDefaults();
        expect(with_sun.getGodRaysDecay()).toBe(MAIN_SCENE_DEFAULTS.godRaysDecay);
        expect(with_sun.getGodRaysTintColor()).toBe(MAIN_SCENE_DEFAULTS.godRaysTintColor);

        with_sun.applySnapshot(snapshot);
        expect(with_sun.getSnapshot()).toEqual(snapshot);
    });

    test('the god rays’ exposure is not adjustable, stays out of the snapshot and keeps the landscape’s value', () => {
        expect(with_sun.setGodRaysExposure).toBeUndefined();
        expect(with_sun.getSnapshot()).not.toHaveProperty('god_rays_exposure');

        god_rays_pass.setExposure(1.1);
        with_sun.resetToDefaults();
        expect(god_rays_pass.getExposure()).toBe(MAIN_SCENE_DEFAULTS.godRaysExposure);
    });

    test('without the sun, the sun stays hidden and its settings are not part of the snapshot', () => {
        expect(sunMeshOf(scene).visible).toBe(false);
        expect(controller.getSnapshot()).not.toHaveProperty('sun_strength');
        expect(controller.getSnapshot()).not.toHaveProperty('god_rays_weight');
    });
});

describe('createLandscapeController – like the main scene', () => {
    let main_like_scene;
    let main_like;
    let animation;

    beforeEach(() => {
        main_like_scene = new THREE.Scene();
        main_like_scene.background = new THREE.Color('#140504');
        animation = main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED));
        main_like = createLandscapeController(main_like_scene, {
            renderer, mode: { with_smoke: true, with_crack_ground: true, like_main_scene: true, metaball_animation: animation },
        });
    });

    test('lights the volcano and hides the metaballs out of the camera’s view exactly like the main scene', () => {
        const volcano = main_like_scene.children.find(child => child.isMesh && child.material.isShaderMaterial && child.geometry.type === 'LatheGeometry');
        expect(volcano.material.uniforms.u_ambient_strength.value).toBe(VOLCANO_AMBIENT_STRENGTH);
        expect(metaballField().camera_arc_culling).toBe(true);
    });

    test('keeps the chosen speed when a new lava wave starts, without the main scene’s boost', () => {
        main_like.update(0, camera);
        const before = main_like.getElapsedTime();
        main_like.update(1, camera);
        main_like.update(1, camera);
        expect(main_like.getElapsedTime() - before).toBe(2 * LANDSCAPE_DEFAULTS.speed);
    });

    test('the other landscape scenes keep their brighter volcano', () => {
        expect(landscapeVolcano().material.uniforms.u_ambient_strength.value).toBe(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
    });
});

describe('createLandscapeController – switching between the landscape scenes', () => {
    test('switching from the sun scene back to the volcano scene hides everything the volcano scene does not have', () => {
        const god_rays_pass = makeGodRaysPass();
        const { target_scene, created } = createInMode({ with_smoke: true, with_crack_ground: true, with_sun: true, like_main_scene: true }, { god_rays_pass });

        created.applyMode({});
        created.resetToDefaults();

        expect(sunMeshOf(target_scene).visible).toBe(false);
        expect(god_rays_pass.enabled).toBe(false);
        expect(landscapeVolcanoOf(target_scene).material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(crackGroundOf(target_scene).visible).toBe(false);
        expect(groundPlateOf(target_scene).visible).toBe(true);
        expect(smokePointsOf(target_scene).visible).toBe(false);
        expect(`#${target_scene.background.getHexString()}`).toBe(DETAIL_BACKGROUND_COLOR);
        expect(landscapeVolcanoOf(target_scene).material.uniforms.u_ambient_strength.value).toBe(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
        expect(metaballField().camera_arc_culling).toBe(false);
        expect(Object.keys(created.getSnapshot())).toEqual(['paused', 'speed', 'surface_irregularities', 'metaballs_visible']);
    });

    test('switching from the volcano scene to the lava landscape brings the crack ground, the smoke and the red sky', () => {
        const { target_scene, created } = createInMode({});

        created.applyMode({ with_smoke: true, with_crack_ground: true });
        created.resetToDefaults();

        expect(crackGroundOf(target_scene).visible).toBe(true);
        expect(groundPlateOf(target_scene).visible).toBe(false);
        expect(smokePointsOf(target_scene).visible).toBe(true);
        expect(`#${target_scene.background.getHexString()}`).toBe(MAIN_SCENE_DEFAULTS.skyColor);
        expect(created.getSnapshot()).toMatchObject({ fog: LANDSCAPE_FOG_DEFAULT, smoke_count: MAIN_SCENE_DEFAULTS.smokeCount });
        expect(created.getSnapshot()).not.toHaveProperty('sun_visible');
    });

    test('only the objects of the current scene move with the scene time', () => {
        const { target_scene, created } = createInMode({});
        const smoke_time = smokePointsOf(target_scene).material.uniforms.u_time.value;

        created.update(1, camera);
        expect(smokePointsOf(target_scene).material.uniforms.u_time.value).toBe(smoke_time);

        created.applyMode({ with_smoke: true });
        created.update(1, camera);
        expect(smokePointsOf(target_scene).material.uniforms.u_time.value).toBe(created.getElapsedTime());
    });

    test('a scene with its own lava swaps it into the shared metaball field, starting it from the warm-up, and switching back resumes the first lava', () => {
        const first_lava = main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED));
        const second_lava = main_scene_animation.createMetaballAnimation(createRandom(RANDOM_SEED));
        const { created } = createInMode({ metaball_animation: first_lava });
        const field = metaballField();
        created.update(0, camera);
        created.update(3, camera);
        const first_lava_spawns = first_lava.getSpawnCount();

        created.applyMode({ with_smoke: true, metaball_animation: second_lava });
        expect(field.setAnimation).toHaveBeenLastCalledWith(second_lava);
        expect(created.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS);
        created.update(0, camera);
        expect(second_lava.getSpawnCount()).toBeGreaterThan(0);
        expect(first_lava.getSpawnCount()).toBe(first_lava_spawns);

        field.fastForward.mockClear();
        created.applyMode({ metaball_animation: first_lava });
        created.update(0, camera);
        expect(field.setAnimation).toHaveBeenLastCalledWith(first_lava);
        expect(field.fastForward).not.toHaveBeenCalled();
    });

    test('switching between scenes that share their lava leaves it and its time alone', () => {
        const { created } = createInMode({});
        created.update(0, camera);
        created.update(2, camera);
        const elapsed_time = created.getElapsedTime();

        created.applyMode({ with_smoke: true });
        expect(metaballField().setAnimation).not.toHaveBeenCalled();
        expect(created.getElapsedTime()).toBe(elapsed_time);
    });
});
