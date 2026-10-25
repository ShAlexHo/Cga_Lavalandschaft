import {
    METABALL_SCALE_XY, METABALL_STRENGTH_SCALE, METABALL_RAYMARCH_STEPS,
} from '../main-scene/config.js';

export const EFFECT_SCALE = METABALL_SCALE_XY;
export const BALL_STRENGTH = (METABALL_STRENGTH_SCALE / METABALL_SCALE_XY) ** 2;
export const BOX_HALF_EXTENT = 0.6;
export const BOX_MARGIN = 0.01;
export const MAX_PIXEL_RATIO = 1.5;

export const MAX_BALL_COUNT = 24;
export const PATH_AMPLITUDE = { x: 0.16, y: 0.07, z: 0.12 };
export const PATH_MIN_FREQUENCY = 0.18;
export const PATH_FREQUENCY_RANGE = 0.3;
export const STRENGTH_VARIANCE = { min: 0.75, max: 1.25 };
export const SUBTRACT_RANGE = { min: 25, max: 45 };

export const DEFAULTS = {
    paused: false,
    speed: 1,
    count: 7,
    spread: 1,
    subtract_scale: 1,
    raymarch_steps: METABALL_RAYMARCH_STEPS,
};

export const BACKGROUND_COLOR = '#140504';
export const CAMERA_FOV = 45;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 500;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 7, z: 24 };
export const CAMERA_MIN_DISTANCE = 12;
export const CAMERA_MAX_DISTANCE = 50;
export const CAMERA_AUTO_ROTATE_SPEED = 0.35;
