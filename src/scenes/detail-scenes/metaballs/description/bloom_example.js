import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

export const BLOOM_THRESHOLD = MAIN_SCENE_DEFAULTS.bloomThreshold;
export const BLOOM_STRENGTH = MAIN_SCENE_DEFAULTS.bloomStrength;

const GROUND_BRIGHTNESS = 0.08;
const LAVA_BRIGHTNESS = 0.85;
const LAVA_EDGE_WIDTH = 0.15;
const LAVA_RANGES = [[1.6, 3.4], [5, 6.2]];
const BLUR_SIGMA = 0.45;

function smoothstep(edge_0, edge_1, x) {
    const t = Math.min(Math.max((x - edge_0) / (edge_1 - edge_0), 0), 1);
    return t * t * (3 - 2 * t);
}

export function sceneBrightness(x) {
    const lava = Math.max(...LAVA_RANGES.map(([start, end]) =>
        smoothstep(start - LAVA_EDGE_WIDTH, start + LAVA_EDGE_WIDTH, x) * (1 - smoothstep(end - LAVA_EDGE_WIDTH, end + LAVA_EDGE_WIDTH, x))));
    return GROUND_BRIGHTNESS + (LAVA_BRIGHTNESS - GROUND_BRIGHTNESS) * lava;
}

export function brightParts(brightness) {
    return brightness > BLOOM_THRESHOLD ? brightness : 0;
}

function blur(values, step) {
    const radius = Math.ceil(3 * BLUR_SIGMA / step);
    const weights = Array.from({ length: 2 * radius + 1 }, (_, i) => Math.exp(-(((i - radius) * step) ** 2) / (2 * BLUR_SIGMA ** 2)));
    const weight_sum = weights.reduce((sum, weight) => sum + weight, 0);
    return values.map((_, i) => weights.reduce((sum, weight, j) => {
        const index = Math.min(Math.max(i + j - radius, 0), values.length - 1);
        return sum + weight * values[index];
    }, 0) / weight_sum);
}

export function bloomCurves(x_max, samples_per_unit) {
    const sample_count = Math.round(x_max * samples_per_unit);
    const x_values = Array.from({ length: sample_count + 1 }, (_, i) => i / samples_per_unit);
    const original = x_values.map(sceneBrightness);
    const glow = blur(original.map(brightParts), 1 / samples_per_unit);
    const toPoints = values => values.map((y, i) => ({ x: x_values[i], y }));
    return {
        original: toPoints(original),
        glow: toPoints(glow),
        result: toPoints(original.map((brightness, i) => brightness + BLOOM_STRENGTH * glow[i])),
    };
}
