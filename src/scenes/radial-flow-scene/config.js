import { METABALL_SECTORS as MAIN_SCENE_SECTOR_COUNT } from '../main-scene/config.js';
import { MAX_BALL_COUNT } from '../metaballs-scene/config.js';
import { VOLCANO_DEFAULTS } from '../volcano-scene/config.js';

export const SECTOR_COUNT_MINIMUM = 1;
export const RADIAL_FLOW_DEFAULTS = {
    speed: 1,
    count: MAX_BALL_COUNT,
    spawn_height: 5.4,
    flow_slope: VOLCANO_DEFAULTS.flow_slope,
    slow_down: false,
    sectors_enabled: false,
    sector_count: MAIN_SCENE_SECTOR_COUNT,
};
export const RADIAL_FLOW_BALL_RADIUS = 1.0;
