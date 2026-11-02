import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { setupSurfaceGui } from './surface_gui.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({ resume_state, controller_options: { noise: true, surface: true }, setupGui: setupSurfaceGui });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('surface-scene', createSceneEngine);
