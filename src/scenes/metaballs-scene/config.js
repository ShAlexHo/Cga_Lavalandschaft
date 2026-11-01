import {
    METABALL_SCALE_XY, METABALL_STRENGTH_SCALE, METABALL_RAYMARCH_STEPS, VOLCANO_PROFILE,
    CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE,
    CAMERA_INITIAL_ELEVATION as MAIN_SCENE_CAMERA_ELEVATION, GROUND_SIZE as MAIN_SCENE_GROUND_SIZE,
} from '../main-scene/config.js';

export const EFFECT_SCALE = METABALL_SCALE_XY;
export const BALL_STRENGTH = (METABALL_STRENGTH_SCALE / METABALL_SCALE_XY) ** 2;
export const BOX_HALF_EXTENT = 0.6;
export const BOX_MARGIN = 0.01;
export const MAX_PIXEL_RATIO = 1.5;

export const MAX_BALL_COUNT = 30;
export const BALL_COUNT_RANGE = { min: 1, max: 24, step: 1 };
export const PATH_AMPLITUDE = { x: 0.16, y: 0.07, z: 0.12 };
export const PATH_MIN_FREQUENCY = 0.09;
export const PATH_FREQUENCY_RANGE = 0.15;
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

export const SURFACE_DEFAULTS = {
    bump_enabled: true,
    displacement_enabled: true,
    displacement_strength: 0.005,
};
export const DISPLACEMENT_STRENGTH_RANGE = { min: 0, max: 0.04, step: 0.001 };

export const GROUND_DEFAULTS = {
    count: 20,
    ground_visible: true,
    ground_height: 0.68,
};
export const GROUND_HEIGHT_RANGE = { min: -3, max: 3, step: 0.05 };
export const GROUND_BALL_COUNT_RANGE = { min: 10, max: 30, step: 1 };
export const GROUND_PATH_SPEED_SCALE = 0.5;
export const GROUND_PLATE_SIZE = { width: 20, depth: 16, thickness: 1.2 };
export const GROUND_COLOR = '#4a2216';
export const GROUND_GLOW_LIGHT_POSITION = { x: 0, y: 0.5, z: 0 };

export const LAVA_AMBIENT_LIGHT = { color: '#ffd9c7', intensity: 0.35 };
export const LAVA_KEY_LIGHT = { color: '#ffffff', intensity: 1.2, position: { x: 10, y: 20, z: 8 } };
export const LAVA_GLOW_LIGHT = { color: '#ff5b00', intensity: 120, distance: 40 };

export const VOLCANO_DEFAULTS = {
    speed: 2,
    count: 30,
    spawn_height: 4.4,
    flow_slope: 0.51,
};
export const SPAWN_HEIGHT_RANGE = { min: 0, max: 10, step: 0.1 };
export const FLOW_SLOPE_RANGE = { min: 0, max: 2, step: 0.01 };
export const VOLCANO_COLOR = '#3a302c';
export const VOLCANO_CAMERA_SETUP = {
    fov: MAIN_SCENE_CAMERA_FOV,
    position: {
        x: 0,
        y: MAIN_SCENE_CAMERA_DISTANCE * Math.sin(MAIN_SCENE_CAMERA_ELEVATION),
        z: MAIN_SCENE_CAMERA_DISTANCE * Math.cos(MAIN_SCENE_CAMERA_ELEVATION),
    },
};
export const VOLCANO_GLOW_LIGHT_POSITION = { x: 6, y: 4, z: 0 };
export const VOLCANO_GROUND_PLATE_SIZE = { width: MAIN_SCENE_GROUND_SIZE, depth: MAIN_SCENE_GROUND_SIZE, thickness: GROUND_PLATE_SIZE.thickness };
export const FLOW_SPEED = 1.3;
export const FLOW_MAX_DISTANCE = 2 * VOLCANO_PROFILE[0].x;
export const FLOW_END_DEPTH = 4;
export const FLOW_GROW_DURATION = 0.8;

export const BACKGROUND_COLOR = '#140504';
export const CAMERA_FOV = 45;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 500;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 7, z: 24 };
export const CAMERA_SETUP = { fov: CAMERA_FOV, position: CAMERA_INITIAL_POSITION };
export const CAMERA_MIN_DISTANCE = 12;
export const CAMERA_MAX_DISTANCE = 50;
export const CAMERA_AUTO_ROTATE_SPEED = 0.35;
