import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { createMetaballAnimation } from '../main-scene/animation/metaball_animation.js';
import { createRandom } from '../main-scene/random.js';
import { RANDOM_SEED } from '../main-scene/config.js';
import { createLandscapeVolcanoController } from './landscape_volcano_controller.js';
import { LANDSCAPE_VOLCANO_CAMERA_SETUP } from './config.js';
import { defineSceneEngine } from '../scene_registry.js';

export function defineLandscapeSceneEngine(scene_name, { controller_options = {}, camera_setup = LANDSCAPE_VOLCANO_CAMERA_SETUP, setupGui }) {
    const metaball_animation = createMetaballAnimation(createRandom(RANDOM_SEED));

    function createSceneEngine(resume_state = null) {
        return createDetailSceneEngine({
            resume_state,
            createController: createLandscapeVolcanoController,
            controller_options: { ...controller_options, metaball_animation },
            camera_setup,
            with_god_rays: Boolean(controller_options.with_sun),
            setupGui,
        });
    }

    return { createSceneEngine, ...defineSceneEngine(scene_name, createSceneEngine) };
}
