import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { setupNoiseGui } from './noise_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({ resume_state, controller_options: { noise: true }, setupGui: setupNoiseGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('noise-scene', createSceneEngine);
