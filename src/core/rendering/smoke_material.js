import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/smoke.vert?raw';
import fragment_glsl from '../shaders/smoke.frag?raw';
import {
    SMOKE_EMBER_GLOW_STRENGTH, SUN_ASH_TINT_COLOR, SMOKE_LIFETIME, SMOKE_CORE_SPREAD, SMOKE_RISE_HEIGHT,
    SMOKE_FADE_IN_END, SMOKE_FADE_OUT_START, SMOKE_AMBIENT_RADIUS, SMOKE_AMBIENT_HEIGHT_MIN, SMOKE_AMBIENT_HEIGHT_MAX,
    SMOKE_AMBIENT_OPACITY,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createSmokeMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_color_1: { value: new THREE.Color(DEFAULT_SETTINGS.smokeColor1) },
            u_color_2: { value: new THREE.Color(DEFAULT_SETTINGS.smokeColor2) },
            u_color_3: { value: new THREE.Color(DEFAULT_SETTINGS.smokeColor3) },
            u_size: { value: DEFAULT_SETTINGS.smokeParticleSize },
            u_ember_glow_strength: { value: SMOKE_EMBER_GLOW_STRENGTH },
            u_sun_color: { value: new THREE.Color(SUN_ASH_TINT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
            u_time: { value: 0.0 },
            u_plume_opacity_factor: { value: 1.0 },
            u_spread: { value: DEFAULT_SETTINGS.smokeSpread },
            u_rise_speed: { value: DEFAULT_SETTINGS.smokeRiseSpeed },
            u_lifetime: { value: SMOKE_LIFETIME },
            u_core_spread: { value: SMOKE_CORE_SPREAD },
            u_rise_height: { value: SMOKE_RISE_HEIGHT },
            u_fade_in_end: { value: SMOKE_FADE_IN_END },
            u_fade_out_start: { value: SMOKE_FADE_OUT_START },
            u_ambient_radius: { value: SMOKE_AMBIENT_RADIUS },
            u_ambient_height_min: { value: SMOKE_AMBIENT_HEIGHT_MIN },
            u_ambient_height_max: { value: SMOKE_AMBIENT_HEIGHT_MAX },
            u_ambient_opacity: { value: SMOKE_AMBIENT_OPACITY },
            u_ember_cooling_time: { value: DEFAULT_SETTINGS.smokeEmberCoolingTime },
        },
        transparent: true,
        depthWrite: false,
        precision: 'highp',
    });
}

export function updateSmokeMaterial(material, time, plume_opacity_factor) {
    material.uniforms.u_time.value = time;
    material.uniforms.u_plume_opacity_factor.value = plume_opacity_factor;
}
