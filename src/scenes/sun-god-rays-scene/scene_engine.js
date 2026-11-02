import { defineLandscapeSceneEngine } from '../volcano-irregularities-scene/landscape_scene_engine.js';
import { setupSunGodRaysGui } from './sun_god_rays_gui.js';
import { SUN_GOD_RAYS_CAMERA_SETUP } from './config.js';

export const { createSceneEngine, getSceneEngine, closeSceneEngine } = defineLandscapeSceneEngine('sun-god-rays-scene', {
    controller_options: { with_smoke: true, with_crack_ground: true, with_sun: true, like_main_scene: true },
    camera_setup: SUN_GOD_RAYS_CAMERA_SETUP,
    setupGui: setupSunGodRaysGui,
});
