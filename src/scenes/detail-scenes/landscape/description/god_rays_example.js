import { GOD_RAYS_SAMPLE_COUNT } from '../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

export const WEIGHT = MAIN_SCENE_DEFAULTS.godRaysWeight;
export const DECAY = MAIN_SCENE_DEFAULTS.godRaysDecay;
const DENSITY = MAIN_SCENE_DEFAULTS.godRaysDensity;

export function isInsidePolygon(point, polygon) {
    let is_inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const crosses = (polygon[i].y > point.y) !== (polygon[j].y > point.y)
            && point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x;
        if (crosses) is_inside = !is_inside;
    }
    return is_inside;
}

export function createMask(sun, occluder) {
    return point => (Math.hypot(point.x - sun.x, point.y - sun.y) <= sun.radius && !isInsidePolygon(point, occluder) ? 1 : 0);
}

export function sampleTowardsLight(pixel, light, mask) {
    const step = { x: (pixel.x - light.x) * DENSITY / GOD_RAYS_SAMPLE_COUNT, y: (pixel.y - light.y) * DENSITY / GOD_RAYS_SAMPLE_COUNT };
    const samples = Array.from({ length: GOD_RAYS_SAMPLE_COUNT }, (_, i) => {
        const position = { x: pixel.x - (i + 1) * step.x, y: pixel.y - (i + 1) * step.y };
        return { ...position, value: mask(position), weight: WEIGHT * DECAY ** i };
    });
    return { samples, brightness: samples.reduce((sum, sample) => sum + sample.value * sample.weight, 0) };
}
