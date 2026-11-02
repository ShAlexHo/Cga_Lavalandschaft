import { defineLandscapeSceneEngine } from '../volcano-irregularities-scene/landscape_scene_engine.js';
import { setupLavaLandscapeGui } from './lava_landscape_gui.js';
import { LAVA_LANDSCAPE_CAMERA_SETUP } from './config.js';

export const { createSceneEngine, getSceneEngine, closeSceneEngine } = defineLandscapeSceneEngine('lava-landscape-scene', {
    controller_options: { with_smoke: true, with_crack_ground: true },
    camera_setup: LAVA_LANDSCAPE_CAMERA_SETUP,
    setupGui: setupLavaLandscapeGui,
});
