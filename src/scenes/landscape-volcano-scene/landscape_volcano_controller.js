import * as THREE from 'three';
import { createSettingSnapshots } from '../setting_snapshots.js';
import { createVolcano } from '../main-scene/objects/volcano_object.js';
import { createMetaballField } from '../main-scene/objects/metaball_field_object.js';
import { createMetaballAnimation } from '../main-scene/animation/metaball_animation.js';
import { createRandom } from '../main-scene/random.js';
import {
    RANDOM_SEED, SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO,
} from '../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../main-scene/default_settings.json';
import { createVolcanoLandscape } from '../metaballs-scene/volcano_landscape.js';
import { averagedLatheProfile } from '../metaballs-scene/volcano_lathe.js';
import { LANDSCAPE_VOLCANO_DEFAULTS, LANDSCAPE_VOLCANO_AMBIENT_STRENGTH } from './config.js';

const UNUSED_SUN_POSITION = new THREE.Vector3();

const metaball_animation = createMetaballAnimation(createRandom(RANDOM_SEED));

export function createLandscapeVolcanoController(scene, { renderer }) {
    const volcano = createVolcano(scene);
    volcano.setSunEnabled(false);
    volcano.setAmbientStrength(LANDSCAPE_VOLCANO_AMBIENT_STRENGTH);
    volcano.rebakeCrackDisplacement();
    const { volcano_lathe } = createVolcanoLandscape(scene, { volcano_profile: averagedLatheProfile(volcano.mesh.geometry) });
    const metaball_field = createMetaballField(scene, { animation: metaball_animation, camera_arc_culling: false });
    metaball_field.effect.position.y = METABALL_EFFECT_HEIGHT_ABOVE_VOLCANO + MAIN_SCENE_DEFAULTS.metaballHeight;

    const settings = {};
    let elapsed_time = SCENE_WARM_UP_SECONDS;

    function warmUp(camera) {
        if (metaball_animation.getSpawnCount() > 0) return;
        metaball_field.fastForward(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS, camera, volcano.mesh.position);
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
        },
    };

    const setting_accessors = {
        paused: [controller.isPaused, controller.setPaused],
        speed: [controller.getSpeed, controller.setSpeed],
        surface_irregularities: [controller.getSurfaceIrregularities, controller.setSurfaceIrregularities],
    };
    Object.assign(controller, createSettingSnapshots(setting_accessors));

    controller.resetToDefaults();
    return controller;
}
