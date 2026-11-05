import { METABALL_SCALE_XY, METABALL_STRENGTH_SCALE, METABALL_RAYMARCH_STEPS } from '../../main-scene/config.js';
import { GROUND_PLATE_THICKNESS } from '../shared/config.js';

export const MESH_SCALE = METABALL_SCALE_XY;
export const BALL_STRENGTH = (METABALL_STRENGTH_SCALE / METABALL_SCALE_XY) ** 2;
export const BOX_HALF_EXTENT = 0.6;
export const BOX_MARGIN = 0.01;

export const MAX_BALL_COUNT = 30;
export const BALL_COUNT_RANGE = { min: 1, max: 24, step: 1 };
export const ISOLATION_RANGE = { min: 10, max: 150, step: 1 };
export const SPREAD_RANGE = { min: 0, max: 2, step: 0.05 };
export const PATH_AMPLITUDE = { x: 0.16, y: 0.07, z: 0.12 };
export const PATH_MIN_FREQUENCY = 0.09;
export const PATH_FREQUENCY_RANGE = 0.15;
export const STRENGTH_VARIANCE = { min: 0.75, max: 1.25 };
export const SUBTRACT_RANGE = { min: 25, max: 45 };

export const METABALLS_DEFAULTS = {
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
export const DISPLACEMENT_STRENGTH_RANGE = { min: 0, max: 0.1, step: 0.001 };

export const GROUND_DEFAULTS = {
    count: 20,
    ground_visible: true,
    ground_height: 0.68,
};
export const GROUND_HEIGHT_RANGE = { min: -3, max: 3, step: 0.05 };
export const GROUND_BALL_COUNT_RANGE = { min: 10, max: 30, step: 1 };
export const GROUND_PATH_SPEED_SCALE = 0.5;
export const GROUND_PLATE_SIZE = { width: 20, depth: 16, thickness: GROUND_PLATE_THICKNESS };
export const GROUND_GLOW_LIGHT_POSITION = { x: 0, y: 0.5, z: 0 };
