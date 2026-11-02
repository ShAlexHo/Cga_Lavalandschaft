import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { setupRadialFlowGui } from './radial_flow_gui.js';
import { createRadialFlowScenery } from './radial_flow_scenery.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({
        resume_state,
        controller_options: { noise: true, surface: true, createScenery: createRadialFlowScenery },
        camera_setup: VOLCANO_CAMERA_SETUP,
        setupGui: setupRadialFlowGui,
    });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('radial-flow-scene', createSceneEngine);
