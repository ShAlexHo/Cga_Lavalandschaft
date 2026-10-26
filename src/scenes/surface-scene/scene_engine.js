import { createMetaballsEngine } from '../metaballs-scene/metaballs_engine.js';
import { setupSurfaceGui } from './surface_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createMetaballsEngine({ resume_state, noise: true, surface: true, setupGui: setupSurfaceGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('surface-scene', createSceneEngine);
