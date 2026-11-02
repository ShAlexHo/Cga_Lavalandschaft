import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { setupLavaFlowGui } from './lava_flow_gui.js';
import { createLavaFlowScenery } from './lava_flow_scenery.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({
        resume_state,
        controller_options: { noise: true, surface: true, createScenery: createLavaFlowScenery },
        camera_setup: VOLCANO_CAMERA_SETUP,
        setupGui: setupLavaFlowGui,
    });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('lava-flow-scene', createSceneEngine);
