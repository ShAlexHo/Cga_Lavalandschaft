import * as THREE from 'three';
import { createSettingSnapshots } from '../../setting_snapshots.js';
import { createVolcano } from '../../main-scene/objects/volcano_object.js';
import { createMetaballField } from '../../main-scene/objects/metaball_field_object.js';
import { createGround } from '../../main-scene/objects/ground_object.js';
import { createSmoke } from '../../main-scene/objects/smoke_object.js';
import { createSun } from '../../main-scene/objects/sun_object.js';
import { createSmokeSettings } from '../../main-scene/animation/smoke_particles.js';
import {
    SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_HEIGHT_ABOVE_VOLCANO, SMOKE_SPAWN_HEIGHT, VOLCANO_AMBIENT_STRENGTH,
} from '../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';
import { createVolcanoLandscape } from '../volcano/volcano_landscape.js';
import { averagedLatheProfile } from '../volcano/volcano_lathe.js';
import { DETAIL_BACKGROUND_COLOR } from '../shared/config.js';
import { LANDSCAPE_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH, LANDSCAPE_FOG_DEFAULT } from './config.js';

const UNUSED_SUN_POSITION = new THREE.Vector3();

const GOD_RAYS_SETTINGS = [
    ['god_rays_weight', 'GodRaysWeight', 'godRaysWeight'],
    ['god_rays_decay', 'GodRaysDecay', 'godRaysDecay'],
    ['god_rays_density', 'GodRaysDensity', 'godRaysDensity'],
    ['god_rays_tint_color', 'GodRaysTintColor', 'godRaysTintColor'],
];

const CRACK_GROUND_SETTINGS = [
    ['ground_color', 'Color', 'groundColor'],
    ['ground_color_2', 'Color2', 'groundColor2'],
    ['ground_crack_color', 'CrackColor', 'groundCrackColor'],
    ['ground_crack_color_2', 'CrackColor2', 'groundCrackColor2'],
    ['ground_crack_softness', 'CrackSoftness', 'groundCrackSoftness'],
    ['ground_proximity_radius', 'ProximityRadius', 'groundProximityRadius'],
    ['ground_displacement_scale', 'DisplacementScale', 'groundDisplacementScale'],
    ['ground_displacement_frequency', 'DisplacementFrequency', 'groundDisplacementFrequency'],
];

const FIXED_CRACK_GROUND_SETTINGS = [
    ['ground_color_3', 'Color3', 'groundColor3'],
    ['ground_color_4', 'Color4', 'groundColor4'],
    ['ground_crack_color_3', 'CrackColor3', 'groundCrackColor3'],
    ['ground_crack_color_4', 'CrackColor4', 'groundCrackColor4'],
];

function createCrackGround(scene, volcano_position) {
    const crack_ground = createGround(scene);
    crack_ground.mesh.position.y = volcano_position.y;
    crack_ground.rebakeDisplacement(volcano_position);
    return crack_ground;
}

function createAshSmoke(scene, volcano_position) {
    const smoke = createSmoke(scene, { settings: createSmokeSettings() });
    smoke.points.position.y = volcano_position.y + SMOKE_SPAWN_HEIGHT;
    return smoke;
}

function bindGodRays(god_rays_pass) {
    return {
        getGodRaysWeight: () => god_rays_pass.getWeight(),
        setGodRaysWeight: value => god_rays_pass.setWeight(value),
        getGodRaysDecay: () => god_rays_pass.getDecay(),
        setGodRaysDecay: value => god_rays_pass.setDecay(value),
        getGodRaysDensity: () => god_rays_pass.getDensity(),
        setGodRaysDensity: value => god_rays_pass.setDensity(value),
        getGodRaysTintColor: () => god_rays_pass.getTintColor(),
        setGodRaysTintColor: value => god_rays_pass.setTintColor(value),
    };
}

export function createLandscapeController(scene, { renderer, god_rays_pass = null, mode }) {
    const volcano = createVolcano(scene);
    volcano.rebakeCrackDisplacement();
    const { ground_plate, volcano_lathe } = createVolcanoLandscape(scene, { volcano_profile: averagedLatheProfile(volcano.mesh.geometry) });
    const crack_ground = createCrackGround(scene, volcano.mesh.position);
    const smoke = createAshSmoke(scene, volcano.mesh.position);
    const sun_lit_objects = [volcano, crack_ground, smoke];
    const sun = createSun(scene);
    god_rays_pass?.setTargets({ sun_mesh: sun.mesh, occluder_meshes: [crack_ground.mesh, volcano.mesh] });
    const metaball_field = createMetaballField(scene, { animation: mode.metaball_animation });
    metaball_field.mesh.position.y = METABALL_HEIGHT_ABOVE_VOLCANO + MAIN_SCENE_DEFAULTS.metaballHeight;

    const settings = {};
    let active_mode = null;
    let active_animation = mode.metaball_animation;
    let elapsed_time = SCENE_WARM_UP_SECONDS;

    function warmUp(camera) {
        if (active_animation.getSpawnCount() > 0) return;
        metaball_field.fastForward(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, camera, volcano.mesh.position);
    }

    function resetCrackGroundSettings() {
        for (const [, method_suffix, default_key] of [...CRACK_GROUND_SETTINGS, ...FIXED_CRACK_GROUND_SETTINGS]) {
            const default_value = MAIN_SCENE_DEFAULTS[default_key];
            if (crack_ground[`get${method_suffix}`]() !== default_value) crack_ground[`set${method_suffix}`](default_value);
        }
    }

    function setSunEnabled(value) {
        sun.setVisible(value);
        if (god_rays_pass) god_rays_pass.enabled = value;
        for (const object of sun_lit_objects) object.setSunEnabled(value);
    }

    function resetSunSettings() {
        for (const object of sun_lit_objects) {
            object.setSunStrength(MAIN_SCENE_DEFAULTS.sunStrength);
            object.setSunFocus?.(MAIN_SCENE_DEFAULTS.sunFocus);
        }
        god_rays_pass.setExposure(MAIN_SCENE_DEFAULTS.godRaysExposure);
    }

    function applyMetaballsVisible() {
        metaball_field.mesh.visible = settings.metaballs_visible;
    }

    function applySurfaceIrregularities() {
        volcano.setVisible(settings.surface_irregularities);
        volcano_lathe.visible = !settings.surface_irregularities;
    }

    const controller = {
        applyMode(mode) {
            active_mode = { with_smoke: false, with_crack_ground: false, with_sun: false, like_main_scene: false, ...mode };
            const { with_smoke, with_crack_ground, with_sun, like_main_scene } = active_mode;
            const mode_animation = mode.metaball_animation ?? active_animation;
            if (mode_animation !== active_animation) {
                active_animation = mode_animation;
                metaball_field.setAnimation(active_animation);
                elapsed_time = SCENE_WARM_UP_SECONDS;
            }
            ground_plate.setVisible(!with_crack_ground);
            crack_ground.setVisible(with_crack_ground);
            scene.background = new THREE.Color(with_crack_ground ? MAIN_SCENE_DEFAULTS.skyColor : DETAIL_BACKGROUND_COLOR);
            smoke.setVisible(with_smoke);
            volcano.setAmbientStrength(like_main_scene ? VOLCANO_AMBIENT_STRENGTH : LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
            metaball_field.setCameraArcCulling(like_main_scene);
            setSunEnabled(with_sun);
            collectSettingAccessors();
        },

        update(delta_seconds, camera) {
            warmUp(camera);
            if (!settings.paused) elapsed_time += delta_seconds * settings.speed;
            metaball_field.update(elapsed_time, camera, volcano.mesh.position);
            if (settings.metaballs_visible) metaball_field.renderFieldTexture(renderer);
            const { with_smoke, with_crack_ground, with_sun } = active_mode;
            if (with_sun) sun.update(elapsed_time);
            const sun_position = with_sun ? sun.position : UNUSED_SUN_POSITION;
            volcano.update(camera, sun_position);
            if (with_crack_ground) crack_ground.update(camera, volcano.mesh.position, sun_position, elapsed_time, scene.background);
            if (with_smoke) smoke.update(camera, sun_position, elapsed_time, metaball_field.getEruptionIntensity(elapsed_time));
        },
        getElapsedTime: () => elapsed_time,
        setElapsedTime: value => { elapsed_time = value; },

        isPaused: () => settings.paused,
        setPaused: value => { settings.paused = value; },
        getSpeed: () => settings.speed,
        setSpeed: value => { settings.speed = value; },
        getSurfaceIrregularities: () => settings.surface_irregularities,
        setSurfaceIrregularities(value) {
            settings.surface_irregularities = value;
            applySurfaceIrregularities();
        },
        getMetaballsVisible: () => settings.metaballs_visible,
        setMetaballsVisible(value) {
            settings.metaballs_visible = value;
            applyMetaballsVisible();
        },

        getFog: crack_ground.getEdgeFadeEnabled,
        setFog: crack_ground.setEdgeFadeEnabled,

        getSmokeCount: smoke.getCount,
        setSmokeCount: smoke.setCount,
        getSmokeRiseSpeed: smoke.getRiseSpeed,
        setSmokeRiseSpeed: smoke.setRiseSpeed,
        getSmokeEmberCoolingTime: smoke.getEmberCoolingTime,
        setSmokeEmberCoolingTime: smoke.setEmberCoolingTime,

        ...bindGodRays(god_rays_pass),

        resetToDefaults() {
            Object.assign(settings, LANDSCAPE_DEFAULTS);
            applySurfaceIrregularities();
            applyMetaballsVisible();
            const { with_smoke, with_crack_ground, with_sun } = active_mode;
            if (with_crack_ground) {
                crack_ground.setEdgeFadeEnabled(LANDSCAPE_FOG_DEFAULT);
                resetCrackGroundSettings();
            }
            if (with_smoke) {
                smoke.setCount(MAIN_SCENE_DEFAULTS.smokeCount);
                smoke.setRiseSpeed(MAIN_SCENE_DEFAULTS.smokeRiseSpeed);
                smoke.setEmberCoolingTime(MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime);
            }
            if (with_sun) {
                resetSunSettings();
                for (const [, method_suffix, default_key] of GOD_RAYS_SETTINGS) controller[`set${method_suffix}`](MAIN_SCENE_DEFAULTS[default_key]);
            }
        },
    };

    for (const [, method_suffix] of CRACK_GROUND_SETTINGS) {
        controller[`getGround${method_suffix}`] = crack_ground[`get${method_suffix}`];
        controller[`setGround${method_suffix}`] = crack_ground[`set${method_suffix}`];
    }

    const base_accessors = {
        paused: [controller.isPaused, controller.setPaused],
        speed: [controller.getSpeed, controller.setSpeed],
        surface_irregularities: [controller.getSurfaceIrregularities, controller.setSurfaceIrregularities],
        metaballs_visible: [controller.getMetaballsVisible, controller.setMetaballsVisible],
    };
    const crack_ground_accessors = {
        fog: [controller.getFog, controller.setFog],
        ...Object.fromEntries(CRACK_GROUND_SETTINGS.map(([key, method_suffix]) => [
            key, [controller[`getGround${method_suffix}`], controller[`setGround${method_suffix}`]],
        ])),
    };
    const smoke_accessors = {
        smoke_count: [controller.getSmokeCount, controller.setSmokeCount],
        smoke_rise_speed: [controller.getSmokeRiseSpeed, controller.setSmokeRiseSpeed],
        smoke_ember_cooling_time: [controller.getSmokeEmberCoolingTime, controller.setSmokeEmberCoolingTime],
    };
    const god_rays_accessors = Object.fromEntries(GOD_RAYS_SETTINGS.map(([key, method_suffix]) => [
        key, [controller[`get${method_suffix}`], controller[`set${method_suffix}`]],
    ]));

    const setting_accessors = {};
    Object.assign(controller, createSettingSnapshots(setting_accessors));

    function collectSettingAccessors() {
        for (const key of Object.keys(setting_accessors)) delete setting_accessors[key];
        Object.assign(
            setting_accessors,
            base_accessors,
            active_mode.with_crack_ground ? crack_ground_accessors : {},
            active_mode.with_smoke ? smoke_accessors : {},
            active_mode.with_sun ? god_rays_accessors : {},
        );
    }

    controller.applyMode(mode);
    controller.resetToDefaults();
    return controller;
}
