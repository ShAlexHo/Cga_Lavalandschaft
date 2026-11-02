import {
    CAMERA_MIN_DISTANCE as MAIN_SCENE_CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE as MAIN_SCENE_CAMERA_MAX_DISTANCE,
} from '../main-scene/config.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';

export const LANDSCAPE_VOLCANO_CAMERA_SETUP = {
    ...VOLCANO_CAMERA_SETUP,
    auto_rotate: false,
    zoom_distance: { min: MAIN_SCENE_CAMERA_MIN_DISTANCE, max: MAIN_SCENE_CAMERA_MAX_DISTANCE },
};
export const LANDSCAPE_VOLCANO_DEFAULTS = {
    paused: false,
    speed: 6,
    surface_irregularities: true,
};
export const LANDSCAPE_VOLCANO_SPEED_RANGE = { min: 0, max: 8, step: 0.05 };
export const LANDSCAPE_VOLCANO_AMBIENT_STRENGTH = 0.6;
export const LANDSCAPE_FOG_DEFAULT = true;
