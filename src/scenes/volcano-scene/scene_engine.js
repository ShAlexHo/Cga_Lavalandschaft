import { createMetaballsEngine } from '../metaballs-scene/metaballs_engine.js';
import { setupVolcanoGui } from './volcano_gui.js';
import { createVolcanoScenery } from './volcano_scenery.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createMetaballsEngine({
        resume_state, noise: true, surface: true, createScenery: createVolcanoScenery, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupVolcanoGui,
    });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('volcano-scene', createSceneEngine);
