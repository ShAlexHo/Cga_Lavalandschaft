import { CAMERA_FAR as MAIN_SCENE_CAMERA_FAR, CAMERA_INITIAL_POSITION as MAIN_SCENE_CAMERA_INITIAL_POSITION } from '../main-scene/config.js';
import { LAVA_LANDSCAPE_CAMERA_SETUP } from '../lava-landscape-scene/config.js';

export const SUN_GOD_RAYS_CAMERA_SETUP = {
    ...LAVA_LANDSCAPE_CAMERA_SETUP,
    far: MAIN_SCENE_CAMERA_FAR,
    position: { ...LAVA_LANDSCAPE_CAMERA_SETUP.position, x: MAIN_SCENE_CAMERA_INITIAL_POSITION.x, z: MAIN_SCENE_CAMERA_INITIAL_POSITION.z },
};
export const SUN_STRENGTH_RANGE = { min: 0, max: 0.3, step: 0.005 };
export const SUN_FOCUS_RANGE = { min: 1, max: 25, step: 0.1 };
export const GOD_RAYS_WEIGHT_RANGE = { min: 0, max: 1, step: 0.01 };
export const GOD_RAYS_EXPOSURE_RANGE = { min: 0, max: 1.5, step: 0.01 };
export const GOD_RAYS_DECAY_RANGE = { min: 0.8, max: 0.99, step: 0.001 };
export const GOD_RAYS_DENSITY_RANGE = { min: 0.5, max: 1.2, step: 0.01 };
