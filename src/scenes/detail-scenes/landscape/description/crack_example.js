import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';
import { CRACK_SHARPNESS_EXPONENT } from '../../../main-scene/geometry/terrain_crack_noise.js';
import { VOLCANO_CRACK_THRESHOLD } from '../../../main-scene/geometry/volcano_geometry.js';
import { gradientNoise } from '../../metaballs/description/noise_example.js';

export { CRACK_SHARPNESS_EXPONENT, VOLCANO_CRACK_THRESHOLD };
export const DISPLACEMENT_SCALE = MAIN_SCENE_DEFAULTS.volcanoDisplacementScale;

export function crackValue(noise) {
    return Math.abs(noise) ** CRACK_SHARPNESS_EXPONENT;
}

export function crackDepth(noise) {
    return DISPLACEMENT_SCALE * Math.max(0, VOLCANO_CRACK_THRESHOLD - crackValue(noise));
}

export function crackCurves(x_max, samples_per_unit) {
    const sample_count = Math.round(x_max * samples_per_unit);
    const noise = Array.from({ length: sample_count + 1 }, (_, i) => {
        const x = i / samples_per_unit;
        return { x, y: gradientNoise(x) };
    });
    return {
        noise,
        crack: noise.map(({ x, y }) => ({ x, y: crackValue(y) })),
        depth: noise.map(({ x, y }) => ({ x, y: -crackDepth(y) })),
    };
}
