import { defineLandscapeSceneEngine } from './landscape_scene_engine.js';
import { setupVolcanoIrregularitiesGui } from './volcano_irregularities_gui.js';

export const { createSceneEngine, getSceneEngine, closeSceneEngine } = defineLandscapeSceneEngine('volcano-irregularities-scene', {
    setupGui: setupVolcanoIrregularitiesGui,
});
