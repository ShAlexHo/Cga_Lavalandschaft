import {
    CAMERA_MIN_DISTANCE as MAIN_SCENE_CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE as MAIN_SCENE_CAMERA_MAX_DISTANCE,
    CAMERA_MIN_POLAR_ANGLE as MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE as MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE,
    CAMERA_FAR as MAIN_SCENE_CAMERA_FAR, CAMERA_INITIAL_POSITION as MAIN_SCENE_CAMERA_INITIAL_POSITION, SMOKE_MAX_PARTICLES,
} from '../../main-scene/config.js';
import { VOLCANO_CAMERA_SETUP } from '../volcano/config.js';

export const LANDSCAPE_CAMERA_SETUP = {
    ...VOLCANO_CAMERA_SETUP,
    auto_rotate: false,
    zoom_distance: { min: MAIN_SCENE_CAMERA_MIN_DISTANCE, max: MAIN_SCENE_CAMERA_MAX_DISTANCE },
};
export const LANDSCAPE_DEFAULTS = {
    paused: false,
    speed: 6,
    surface_irregularities: true,
    metaballs_visible: true,
};
export const LANDSCAPE_SPEED_RANGE = { min: 0, max: 8, step: 0.05 };
export const LANDSCAPE_VOLCANO_AMBIENT_STRENGTH = 0.6;
export const LANDSCAPE_FOG_DEFAULT = true;

export const SMOKE_COUNT_RANGE = { min: 1, max: SMOKE_MAX_PARTICLES, step: 1 };
export const SMOKE_RISE_SPEED_RANGE = { min: 0, max: 0.1, step: 0.001 };
export const SMOKE_EMBER_COOLING_TIME_RANGE = { min: 1, max: 600, step: 1 };

export const LAVA_LANDSCAPE_CAMERA_SETUP = {
    ...LANDSCAPE_CAMERA_SETUP,
    polar_angle: { min: MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, max: MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE },
};
export const GROUND_ROUGHNESS_RANGE = { min: 0, max: 3, step: 0.05 };
export const GROUND_STRUCTURE_FREQUENCY_RANGE = { min: 0.01, max: 0.5, step: 0.01 };
export const GROUND_PROXIMITY_RADIUS_RANGE = { min: 0, max: 40, step: 0.5 };
export const CRACK_SOFTNESS_RANGE = { min: 0, max: 0.1, step: 0.001 };

export const SUN_GOD_RAYS_CAMERA_SETUP = {
    ...LAVA_LANDSCAPE_CAMERA_SETUP,
    far: MAIN_SCENE_CAMERA_FAR,
    position: { ...LAVA_LANDSCAPE_CAMERA_SETUP.position, x: MAIN_SCENE_CAMERA_INITIAL_POSITION.x, z: MAIN_SCENE_CAMERA_INITIAL_POSITION.z },
};
export const GOD_RAYS_WEIGHT_RANGE = { min: 0, max: 1, step: 0.01 };
export const GOD_RAYS_DECAY_RANGE = { min: 0.8, max: 0.99, step: 0.001 };
export const GOD_RAYS_DENSITY_RANGE = { min: 0.5, max: 1.2, step: 0.01 };
