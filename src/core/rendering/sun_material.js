import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/sun.vert?raw';
import fragment_glsl from '../shaders/sun.frag?raw';
import { SUN_LIGHT_COLOR, SUN_CORE_COLOR, SUN_BLOOD_ORANGE_COLOR } from '../config.js';

export function createSunMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_color_core: { value: new THREE.Color(SUN_CORE_COLOR) },
            u_color_edge: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_color_blood_orange: { value: new THREE.Color(SUN_BLOOD_ORANGE_COLOR) },
            u_time: { value: 0.0 },
        },
    });
}

export function updateSunMaterial(material, time) {
    material.uniforms.u_time.value = time;
}
