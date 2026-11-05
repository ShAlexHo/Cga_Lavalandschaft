import {
    VOLCANO_PROFILE, METABALL_SECTORS as MAIN_SCENE_SECTOR_COUNT,
    CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE,
    CAMERA_INITIAL_ELEVATION as MAIN_SCENE_CAMERA_ELEVATION, GROUND_SIZE as MAIN_SCENE_GROUND_SIZE,
} from '../../main-scene/config.js';
import { GROUND_PLATE_THICKNESS } from '../shared/config.js';
import { MAX_BALL_COUNT } from '../metaballs/config.js';

export const VOLCANO_COLOR = '#3a302c';
export const VOLCANO_CAMERA_SETUP = {
    fov: MAIN_SCENE_CAMERA_FOV,
    auto_rotate: true,
    position: {
        x: 0,
        y: MAIN_SCENE_CAMERA_DISTANCE * Math.sin(MAIN_SCENE_CAMERA_ELEVATION),
        z: MAIN_SCENE_CAMERA_DISTANCE * Math.cos(MAIN_SCENE_CAMERA_ELEVATION),
    },
};
export const VOLCANO_GLOW_LIGHT_POSITION = { x: 0, y: 7, z: 0 };
export const VOLCANO_GROUND_PLATE_SIZE = { width: MAIN_SCENE_GROUND_SIZE, depth: MAIN_SCENE_GROUND_SIZE, thickness: GROUND_PLATE_THICKNESS };

export const FLOW_SPEED = 1.3;
export const FLOW_MAX_DISTANCE = 2 * VOLCANO_PROFILE[0].x;
export const FLOW_END_DEPTH = 4;
export const FLOW_GROW_DURATION = 0.8;
export const FLOW_SLOWING_DISTANCE = 2;
export const FLOW_SECTOR_SPREAD = 0.12;

export const VOLCANO_DEFAULTS = {
    speed: 2,
    count: MAX_BALL_COUNT,
    spawn_height: 4.4,
    flow_slope: 0.51,
};
export const SPAWN_HEIGHT_RANGE = { min: 0, max: 10, step: 0.1 };
export const FLOW_SLOPE_RANGE = { min: 0, max: 2, step: 0.01 };

export const SECTOR_COUNT_MINIMUM = 1;
export const LAVA_FLOW_DEFAULTS = {
    speed: 1,
    count: MAX_BALL_COUNT,
    spawn_height: 5.4,
    flow_slope: VOLCANO_DEFAULTS.flow_slope,
    slow_down: false,
    sectors_enabled: false,
    sector_count: MAIN_SCENE_SECTOR_COUNT,
};
export const LAVA_FLOW_BALL_RADIUS = 1.0;
