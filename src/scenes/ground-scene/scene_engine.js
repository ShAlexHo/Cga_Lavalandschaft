import { createMetaballsEngine } from '../metaballs-scene/metaballs_engine.js';
import { setupGroundGui } from './ground_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createMetaballsEngine({ resume_state, noise: true, surface: true, ground: true, setupGui: setupGroundGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('ground-scene', createSceneEngine);
