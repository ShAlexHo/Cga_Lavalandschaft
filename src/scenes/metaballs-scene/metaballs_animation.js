import { smoothstep } from '../main-scene/animation/math_utils.js';
import {
    MAX_BALL_COUNT, PATH_AMPLITUDE, PATH_MIN_FREQUENCY, PATH_FREQUENCY_RANGE, STRENGTH_VARIANCE, SUBTRACT_RANGE, BALL_STRENGTH,
    EFFECT_SCALE, FLOW_SPEED, FLOW_MAX_DISTANCE, FLOW_END_DEPTH, FLOW_GROW_DURATION,
} from './config.js';

function lowDiscrepancySequence(index, step) {
    return (index * step) % 1;
}

function interpolate(min, max, fraction) {
    return min + (max - min) * fraction;
}

export const BALL_PATHS = Array.from({ length: MAX_BALL_COUNT }, (_, i) => ({
    frequency: {
        x: PATH_MIN_FREQUENCY + PATH_FREQUENCY_RANGE * lowDiscrepancySequence(i + 1, 0.7548776662),
        y: PATH_MIN_FREQUENCY + PATH_FREQUENCY_RANGE * lowDiscrepancySequence(i + 1, 0.5698402910),
        z: PATH_MIN_FREQUENCY + PATH_FREQUENCY_RANGE * lowDiscrepancySequence(i + 1, 0.6180339887),
    },
    phase: {
        x: 2 * Math.PI * lowDiscrepancySequence(i + 1, 0.4142135624),
        y: 2 * Math.PI * lowDiscrepancySequence(i + 1, 0.7320508076),
        z: 2 * Math.PI * lowDiscrepancySequence(i + 1, 0.2360679775),
    },
    strength: BALL_STRENGTH * interpolate(STRENGTH_VARIANCE.min, STRENGTH_VARIANCE.max, lowDiscrepancySequence(i + 1, 0.3819660113)),
    subtract: interpolate(SUBTRACT_RANGE.min, SUBTRACT_RANGE.max, lowDiscrepancySequence(i + 1, 0.8541019662)),
}));

function worldToField(world_coordinate) {
    return 0.5 + world_coordinate / (2 * EFFECT_SCALE);
}

export function flowDistance({ spawn_height, flow_slope }) {
    if (flow_slope <= 0) return FLOW_MAX_DISTANCE;
    return Math.min(FLOW_MAX_DISTANCE, (spawn_height + FLOW_END_DEPTH) / flow_slope);
}

export function computeBalls(time, { count, spread, subtract_scale }, { planar = false } = {}) {
    return BALL_PATHS.slice(0, count).map(({ frequency, phase, strength, subtract }) => ({
        x: 0.5 + 0.5 * spread * PATH_AMPLITUDE.x * Math.sin(frequency.x * time + phase.x),
        y: planar ? 0.5 : 0.5 + 0.5 * spread * PATH_AMPLITUDE.y * Math.sin(frequency.y * time + phase.y),
        z: 0.5 + 0.5 * spread * PATH_AMPLITUDE.z * Math.cos(frequency.z * time + phase.z),
        strength,
        subtract: subtract * subtract_scale,
    }));
}

export function computeFlowBalls(time, { count, spawn_height, flow_slope }) {
    const flow_distance = flowDistance({ spawn_height, flow_slope });
    const flow_duration = flow_distance * Math.hypot(1, flow_slope) / FLOW_SPEED;
    return BALL_PATHS.slice(0, count).map(({ strength, subtract }, i) => {
        const age = (time + flow_duration * i / count) % flow_duration;
        const travelled_distance = flow_distance * age / flow_duration;
        return {
            x: worldToField(travelled_distance),
            y: worldToField(spawn_height - flow_slope * travelled_distance),
            z: worldToField(0),
            strength: strength * smoothstep(0, FLOW_GROW_DURATION, age),
            subtract,
        };
    });
}
