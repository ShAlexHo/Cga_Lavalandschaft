import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/smoke.vert?raw';
import fragment_glsl from '../shaders/smoke.frag?raw';
import { SMOKE_COLOR_1, SMOKE_COLOR_2, SMOKE_COLOR_3, SMOKE_PARTICLE_SIZE, SMOKE_EMBER_GLOW_STRENGTH, SUN_LIGHT_COLOR } from '../config.js';

export function createSmokeMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_color_1: { value: new THREE.Color(SMOKE_COLOR_1) },
            u_color_2: { value: new THREE.Color(SMOKE_COLOR_2) },
            u_color_3: { value: new THREE.Color(SMOKE_COLOR_3) },
            u_size: { value: SMOKE_PARTICLE_SIZE },
            u_ember_glow_strength: { value: SMOKE_EMBER_GLOW_STRENGTH },
            u_sun_color: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
        },
        transparent: true,
        depthWrite: false,
    });
}
