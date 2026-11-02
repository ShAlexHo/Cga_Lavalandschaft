import { createDetailSceneEngine } from './detail_scene_engine.js';
import { setupMetaballsGui } from './metaballs_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({ resume_state, setupGui: setupMetaballsGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('metaballs-scene', createSceneEngine);
