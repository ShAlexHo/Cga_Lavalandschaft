import { createMetaballsEngine } from './metaballs_engine.js';
import { setupMetaballsGui } from './metaballs_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createMetaballsEngine({ resume_state, noise: false, setupGui: setupMetaballsGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('metaballs-scene', createSceneEngine);
