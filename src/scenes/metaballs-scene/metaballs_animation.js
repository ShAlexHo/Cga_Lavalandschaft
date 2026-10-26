import {
    MAX_BALL_COUNT, PATH_AMPLITUDE, PATH_MIN_FREQUENCY, PATH_FREQUENCY_RANGE, STRENGTH_VARIANCE, SUBTRACT_RANGE, BALL_STRENGTH,
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

export function computeBalls(time, { count, spread, subtract_scale }, { planar = false } = {}) {
    return BALL_PATHS.slice(0, count).map(({ frequency, phase, strength, subtract }) => ({
        x: 0.5 + 0.5 * spread * PATH_AMPLITUDE.x * Math.sin(frequency.x * time + phase.x),
        y: planar ? 0.5 : 0.5 + 0.5 * spread * PATH_AMPLITUDE.y * Math.sin(frequency.y * time + phase.y),
        z: 0.5 + 0.5 * spread * PATH_AMPLITUDE.z * Math.cos(frequency.z * time + phase.z),
        strength,
        subtract: subtract * subtract_scale,
    }));
}
