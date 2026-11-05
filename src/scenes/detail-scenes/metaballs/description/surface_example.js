import { gradientNoise } from './noise_example.js';

const PHASE = 0.35;
const SLOPE_STEP = 0.001;

function surfaceHeight(x) {
    return gradientNoise(x + PHASE);
}

function surfaceSlope(x) {
    return (surfaceHeight(x + SLOPE_STEP) - surfaceHeight(x - SLOPE_STEP)) / (2 * SLOPE_STEP);
}

export function surfaceProfile(x_max, samples_per_unit, normal_count) {
    const sample_count = Math.round(x_max * samples_per_unit);
    const surface = Array.from({ length: sample_count + 1 }, (_, i) => {
        const x = i / samples_per_unit;
        return { x, height: surfaceHeight(x) };
    });
    const peak = Math.max(...surface.map(({ height }) => Math.abs(height)));
    const normal_spacing = x_max / normal_count;
    const normals = Array.from({ length: normal_count }, (_, i) => {
        const x = (i + 0.5) * normal_spacing;
        return { x, height: surfaceHeight(x) / peak, slope: surfaceSlope(x) / peak };
    });
    return {
        surface: surface.map(({ x, height }) => ({ x, height: height / peak })),
        normals,
    };
}
