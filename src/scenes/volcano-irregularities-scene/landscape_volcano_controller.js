import * as THREE from 'three';
import { createSettingSnapshots } from '../setting_snapshots.js';
import { createVolcano } from '../main-scene/objects/volcano_object.js';
import { createMetaballField } from '../main-scene/objects/metaball_field_object.js';
import { createGround } from '../main-scene/objects/ground_object.js';
import { createSmoke } from '../main-scene/objects/smoke_object.js';
import { createSmokeSettings } from '../main-scene/animation/smoke_particles.js';
import {
    SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO, SMOKE_SPAWN_HEIGHT,
} from '../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../main-scene/default_settings.json';
import { createVolcanoLandscape } from '../metaballs-scene/volcano_landscape.js';
import { averagedLatheProfile } from '../metaballs-scene/volcano_lathe.js';
import { LANDSCAPE_VOLCANO_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH, LANDSCAPE_FOG_DEFAULT } from './config.js';

const UNUSED_SUN_POSITION = new THREE.Vector3();

const CRACK_GROUND_SETTINGS = [
    ['ground_color', 'Color', 'groundColor'],
    ['ground_color_2', 'Color2', 'groundColor2'],
    ['ground_color_3', 'Color3', 'groundColor3'],
    ['ground_color_4', 'Color4', 'groundColor4'],
    ['ground_crack_color', 'CrackColor', 'groundCrackColor'],
    ['ground_crack_color_2', 'CrackColor2', 'groundCrackColor2'],
    ['ground_crack_color_3', 'CrackColor3', 'groundCrackColor3'],
    ['ground_crack_color_4', 'CrackColor4', 'groundCrackColor4'],
    ['ground_crack_softness', 'CrackSoftness', 'groundCrackSoftness'],
    ['ground_proximity_radius', 'ProximityRadius', 'groundProximityRadius'],
    ['ground_displacement_scale', 'DisplacementScale', 'groundDisplacementScale'],
    ['ground_displacement_frequency', 'DisplacementFrequency', 'groundDisplacementFrequency'],
];

function createCrackGround(scene, volcano_position) {
    scene.background.set(MAIN_SCENE_DEFAULTS.skyColor);
    const crack_ground = createGround(scene);
    crack_ground.setSunEnabled(false);
    crack_ground.mesh.position.y = volcano_position.y;
    crack_ground.rebakeDisplacement(volcano_position);
    return crack_ground;
}

function createAshSmoke(scene, volcano_position) {
    const smoke = createSmoke(scene, { settings: createSmokeSettings() });
    smoke.setSunEnabled(false);
    smoke.effect.position.y = volcano_position.y + SMOKE_SPAWN_HEIGHT;
    return smoke;
}

export function createLandscapeVolcanoController(scene, { renderer, metaball_animation, with_smoke = false, with_crack_ground = false }) {
    const volcano = createVolcano(scene);
    volcano.setSunEnabled(false);
    volcano.setAmbientStrength(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
    volcano.rebakeCrackDisplacement();
    const { volcano_lathe } = createVolcanoLandscape(scene, {
        volcano_profile: averagedLatheProfile(volcano.mesh.geometry), with_ground_plate: !with_crack_ground,
    });
    const crack_ground = with_crack_ground ? createCrackGround(scene, volcano.mesh.position) : null;
    const smoke = with_smoke ? createAshSmoke(scene, volcano.mesh.position) : null;
    const metaball_field = createMetaballField(scene, { animation: metaball_animation, camera_arc_culling: false });
    metaball_field.effect.position.y = METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO + MAIN_SCENE_DEFAULTS.metaballHeight;

    const settings = {};
    let elapsed_time = SCENE_WARM_UP_SECONDS;

    function warmUp(camera) {
        if (metaball_animation.getSpawnCount() > 0) return;
        metaball_field.fastForward(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, camera, volcano.mesh.position);
    }

    function resetCrackGroundSettings() {
        for (const [, method_suffix, default_key] of CRACK_GROUND_SETTINGS) {
            const default_value = MAIN_SCENE_DEFAULTS[default_key];
            if (crack_ground[`get${method_suffix}`]() !== default_value) crack_ground[`set${method_suffix}`](default_value);
        }
    }

    function applySurfaceIrregularities() {
        volcano.setVisible(settings.surface_irregularities);
        volcano_lathe.visible = !settings.surface_irregularities;
    }

    const controller = {
        update(delta_seconds, camera) {
            warmUp(camera);
            if (!settings.paused) elapsed_time += delta_seconds * settings.speed;
            metaball_field.update(elapsed_time, camera, volcano.mesh.position);
            metaball_field.renderFieldTexture(renderer);
            volcano.update(camera, UNUSED_SUN_POSITION);
            crack_ground?.update(camera, volcano.mesh.position, UNUSED_SUN_POSITION, elapsed_time, scene.background);
            smoke?.update(camera, UNUSED_SUN_POSITION, elapsed_time, metaball_field.getEruptionIntensity(elapsed_time));
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

        resetToDefaults() {
            Object.assign(settings, LANDSCAPE_VOLCANO_DEFAULTS);
            applySurfaceIrregularities();
            if (crack_ground) {
                crack_ground.setEdgeFadeEnabled(LANDSCAPE_FOG_DEFAULT);
                resetCrackGroundSettings();
            }
            smoke?.setCount(MAIN_SCENE_DEFAULTS.smokeCount);
            smoke?.setRiseSpeed(MAIN_SCENE_DEFAULTS.smokeRiseSpeed);
            smoke?.setEmberCoolingTime(MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime);
        },
    };

    const setting_accessors = {
        paused: [controller.isPaused, controller.setPaused],
        speed: [controller.getSpeed, controller.setSpeed],
        surface_irregularities: [controller.getSurfaceIrregularities, controller.setSurfaceIrregularities],
    };
    Object.assign(controller, createSettingSnapshots(setting_accessors));

    if (crack_ground) {
        Object.assign(controller, { getFog: crack_ground.getEdgeFadeEnabled, setFog: crack_ground.setEdgeFadeEnabled });
        setting_accessors.fog = [controller.getFog, controller.setFog];
        for (const [key, method_suffix] of CRACK_GROUND_SETTINGS) {
            controller[`getGround${method_suffix}`] = crack_ground[`get${method_suffix}`];
            controller[`setGround${method_suffix}`] = crack_ground[`set${method_suffix}`];
            setting_accessors[key] = [controller[`getGround${method_suffix}`], controller[`setGround${method_suffix}`]];
        }
    }

    if (smoke) {
        Object.assign(controller, {
            getSmokeCount: smoke.getCount,
            setSmokeCount: smoke.setCount,
            getSmokeRiseSpeed: smoke.getRiseSpeed,
            setSmokeRiseSpeed: smoke.setRiseSpeed,
            getSmokeEmberCoolingTime: smoke.getEmberCoolingTime,
            setSmokeEmberCoolingTime: smoke.setEmberCoolingTime,
        });
        Object.assign(setting_accessors, {
            smoke_count: [controller.getSmokeCount, controller.setSmokeCount],
            smoke_rise_speed: [controller.getSmokeRiseSpeed, controller.setSmokeRiseSpeed],
            smoke_ember_cooling_time: [controller.getSmokeEmberCoolingTime, controller.setSmokeEmberCoolingTime],
        });
    }

    controller.resetToDefaults();
    return controller;
}
