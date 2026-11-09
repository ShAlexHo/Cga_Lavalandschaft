import { VOLCANO_PROFILE } from '../../../main-scene/config.js';
import { VOLCANO_DEFAULTS } from '../config.js';
import { flowDistance } from '../flow_animation.js';

export const PROFILE_POINTS = VOLCANO_PROFILE;
export const SPAWN_HEIGHT = VOLCANO_DEFAULTS.spawn_height;
export const FLOW_SLOPE = VOLCANO_DEFAULTS.flow_slope;

const EXAMPLE_RIM_CLEARANCE = 0.5;
const CROSSING_SEARCH_STEP = 0.01;

const [FOOT, RIM] = PROFILE_POINTS;

export const EXAMPLE_FLOW = {
    flow_slope: FLOW_SLOPE,
    spawn_height: RIM.y + EXAMPLE_RIM_CLEARANCE + FLOW_SLOPE * RIM.x,
};

export function flankHeight(x) {
    if (x <= RIM.x) return RIM.y;
    if (x >= FOOT.x) return 0;
    return RIM.y + (FOOT.y - RIM.y) * (x - RIM.x) / (FOOT.x - RIM.x);
}

export function flowLine({ spawn_height, flow_slope } = VOLCANO_DEFAULTS) {
    const end_distance = flowDistance({ spawn_height, flow_slope });
    const ground_distance = flow_slope > 0 ? Math.min(spawn_height / flow_slope, end_distance) : end_distance;
    const heightAt = distance => spawn_height - flow_slope * distance;
    let crossing_distance = RIM.x;
    while (crossing_distance < FOOT.x && heightAt(crossing_distance) > flankHeight(crossing_distance)) crossing_distance += CROSSING_SEARCH_STEP;
    const ball_distance = (crossing_distance + FOOT.x) / 2;
    return {
        heightAt,
        start: { x: 0, y: spawn_height },
        ground: { x: ground_distance, y: heightAt(ground_distance) },
        end: { x: end_distance, y: heightAt(end_distance) },
        crossing: { x: crossing_distance, y: heightAt(crossing_distance) },
        ball: { x: ball_distance, y: heightAt(ball_distance) },
    };
}
