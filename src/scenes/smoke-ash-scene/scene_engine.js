import { defineLandscapeSceneEngine } from '../volcano-irregularities-scene/landscape_scene_engine.js';
import { setupSmokeAshGui } from './smoke_ash_gui.js';

export const { createSceneEngine, getSceneEngine, closeSceneEngine } = defineLandscapeSceneEngine('smoke-ash-scene', {
    controller_options: { with_smoke: true },
    setupGui: setupSmokeAshGui,
});
