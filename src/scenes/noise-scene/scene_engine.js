import { createMetaballsEngine } from '../metaballs-scene/metaballs_engine.js';
import { setupNoiseGui } from './noise_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createMetaballsEngine({ resume_state, noise: true, setupGui: setupNoiseGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('noise-scene', createSceneEngine);
