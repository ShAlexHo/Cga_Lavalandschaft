import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { createLandscapeVolcanoController } from './landscape_volcano_controller.js';
import { setupLandscapeVolcanoGui } from './landscape_volcano_gui.js';
import { LANDSCAPE_VOLCANO_CAMERA_SETUP } from './config.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({
        resume_state, createController: createLandscapeVolcanoController, camera_setup: LANDSCAPE_VOLCANO_CAMERA_SETUP, setupGui: setupLandscapeVolcanoGui,
    });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('landscape-volcano-scene', createSceneEngine);
