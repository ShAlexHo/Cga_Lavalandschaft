import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { setupGroundGui } from './ground_gui.js';
import { createGroundScenery } from './ground_scenery.js';
import { defineSceneEngine } from '../scene_registry.js';

export function createSceneEngine(resume_state = null) {
    return createDetailSceneEngine({
        resume_state, controller_options: { noise: true, surface: true, createScenery: createGroundScenery }, setupGui: setupGroundGui,
    });
}

export const { getSceneEngine, closeSceneEngine } = defineSceneEngine('ground-scene', createSceneEngine);
