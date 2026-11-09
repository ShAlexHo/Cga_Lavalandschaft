import { smoothstep } from '../../../main-scene/animation/math_utils.js';
import { SMOKE_LIFETIME, SMOKE_FADE_IN_END, SMOKE_FADE_OUT_START } from '../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

export const RISE_SPEED = MAIN_SCENE_DEFAULTS.smokeRiseSpeed;
export const EMBER_COOLING_TIME = MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime;
export const ASH_COLOR = MAIN_SCENE_DEFAULTS.smokeColor1;
export const SMOKE_COLOR = MAIN_SCENE_DEFAULTS.smokeColor2;

export function particleLifetime(lifetime_multiplier = 1, rise_speed = RISE_SPEED) {
    return SMOKE_LIFETIME * lifetime_multiplier / rise_speed;
}

export function particleOpacity(age_fraction) {
    return smoothstep(0, SMOKE_FADE_IN_END, age_fraction) * (1 - smoothstep(SMOKE_FADE_OUT_START, 1, age_fraction));
}

export function emberGlow(age_fraction, cooling_time = EMBER_COOLING_TIME) {
    return 1 - smoothstep(0, cooling_time, age_fraction * particleLifetime());
}

export function lifetimeCurves(sample_count) {
    return Array.from({ length: sample_count + 1 }, (_, i) => {
        const age_fraction = i / sample_count;
        return { age_fraction, opacity: particleOpacity(age_fraction), glow: emberGlow(age_fraction) };
    });
}
