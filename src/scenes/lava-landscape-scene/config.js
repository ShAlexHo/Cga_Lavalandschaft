import { CAMERA_MIN_POLAR_ANGLE as MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE as MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE } from '../main-scene/config.js';
import { LANDSCAPE_VOLCANO_CAMERA_SETUP } from '../volcano-irregularities-scene/config.js';

export const LAVA_LANDSCAPE_CAMERA_SETUP = {
    ...LANDSCAPE_VOLCANO_CAMERA_SETUP,
    polar_angle: { min: MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, max: MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE },
};
export const GROUND_ROUGHNESS_RANGE = { min: 0, max: 3, step: 0.05 };
export const GROUND_STRUCTURE_FREQUENCY_RANGE = { min: 0.01, max: 0.5, step: 0.01 };
export const GROUND_PROXIMITY_RADIUS_RANGE = { min: 0, max: 40, step: 0.5 };
export const CRACK_SOFTNESS_RANGE = { min: 0, max: 0.1, step: 0.001 };
