import { smoothstep } from '../main-scene/animation/math_utils.js';
import { BALL_PATHS, lowDiscrepancySequence } from './metaballs_animation.js';
import {
    MAX_BALL_COUNT, EFFECT_SCALE, FLOW_SPEED, FLOW_MAX_DISTANCE, FLOW_END_DEPTH, FLOW_GROW_DURATION, FLOW_SLOWING_DISTANCE, FLOW_SECTOR_SPREAD,
} from './config.js';

function standardNormalQuantile(probability) {
    return Math.sqrt(3) / Math.PI * Math.log(probability / (1 - probability));
}

function worldToField(world_coordinate) {
    return 0.5 + world_coordinate / (2 * EFFECT_SCALE);
}

export function flowDistance({ spawn_height, flow_slope }) {
    if (flow_slope <= 0) return FLOW_MAX_DISTANCE;
    return Math.min(FLOW_MAX_DISTANCE, (spawn_height + FLOW_END_DEPTH) / flow_slope);
}

function slowingTime(path_length) {
    return (path_length + path_length ** 2 / (2 * FLOW_SLOWING_DISTANCE)) / FLOW_SPEED;
}

function slowingLength(time) {
    return FLOW_SLOWING_DISTANCE * (Math.sqrt(1 + 2 * FLOW_SPEED * time / FLOW_SLOWING_DISTANCE) - 1);
}

export function flowTiming({ spawn_height, flow_slope, slow_down = false }) {
    const flow_distance = flowDistance({ spawn_height, flow_slope });
    const path_scale = Math.hypot(1, flow_slope);
    const path_length = flow_distance * path_scale;
    const above_ground_length = flow_slope > 0 ? Math.min(path_length, spawn_height / flow_slope * path_scale) : path_length;
    const slowing_length = slow_down ? above_ground_length : 0;
    const slowing_duration = slowingTime(slowing_length);
    const duration = slowing_duration + (path_length - slowing_length) / FLOW_SPEED;

    function travelledLength(age) {
        if (age < slowing_duration) return slowingLength(age);
        return slowing_length + FLOW_SPEED * (age - slowing_duration);
    }

    return { duration, path_scale, travelledLength };
}

export function sectorOffset(sector, member) {
    return standardNormalQuantile(lowDiscrepancySequence(sector * MAX_BALL_COUNT + member + 1, 0.6180339887));
}

export function flowAngle(i, { flow_angle }, { sectors_enabled = false, sector_count = 1 } = {}) {
    if (!sectors_enabled) return flow_angle;
    const sector = i % sector_count;
    const sector_width = 2 * Math.PI / sector_count;
    return sector * sector_width + FLOW_SECTOR_SPREAD * sector_width * sectorOffset(sector, Math.floor(i / sector_count));
}

export function computeFlowBalls(time, { count, spawn_height, flow_slope, slow_down = false, sectors_enabled = false, sector_count = 1 }, { radial = false } = {}) {
    const timing = flowTiming({ spawn_height, flow_slope, slow_down });
    return BALL_PATHS.slice(0, count).map((path, i) => {
        const { strength, subtract } = path;
        const age = (time + timing.duration * i / count) % timing.duration;
        const travelled_distance = timing.travelledLength(age) / timing.path_scale;
        const angle = radial ? flowAngle(i, path, { sectors_enabled, sector_count }) : 0;
        return {
            x: worldToField(travelled_distance * Math.cos(angle)),
            y: worldToField(spawn_height - flow_slope * travelled_distance),
            z: worldToField(travelled_distance * Math.sin(angle)),
            strength: strength * smoothstep(0, FLOW_GROW_DURATION, age),
            subtract,
        };
    });
}
