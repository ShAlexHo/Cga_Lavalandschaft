import * as THREE from 'three';
import passthrough_vert from '../shaders/god_rays_passthrough.vert?raw';
import generate_frag from '../shaders/god_rays_generate.frag?raw';
import sun_disc_vert from '../shaders/god_rays_sun_disc.vert?raw';
import sun_disc_frag from '../shaders/god_rays_sun_disc.frag?raw';
import combine_frag from '../shaders/god_rays_combine.frag?raw';
import { GOD_RAYS_NUM_SAMPLES } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

// GLSL for-loops need a compile-time-constant bound, so this is baked in as text rather than a uniform.
const generate_frag_resolved = generate_frag.replaceAll('NUM_SAMPLES', GOD_RAYS_NUM_SAMPLES);

export function createGodRaysOcclusionMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x000000 });
}

export function createGodRaysSunDiscMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: sun_disc_vert,
        fragmentShader: sun_disc_frag,
        depthWrite: false,
    });
}

export function createGodRaysGenerateMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            u_occlusion: { value: null },
            u_light_uv: { value: new THREE.Vector2(0.5, 0.5) },
            u_exposure: { value: DEFAULT_SETTINGS.godRaysExposure },
            u_decay: { value: DEFAULT_SETTINGS.godRaysDecay },
            u_density: { value: DEFAULT_SETTINGS.godRaysDensity },
            u_weight: { value: DEFAULT_SETTINGS.godRaysWeight },
            u_visibility: { value: 1.0 },
            u_aspect: { value: 1.0 },
        },
        vertexShader: passthrough_vert,
        fragmentShader: generate_frag_resolved,
    });
}

export function createGodRaysCombineMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            u_base: { value: null },
            u_god_rays: { value: null },
            u_depth: { value: null },
            u_tint: { value: new THREE.Color(DEFAULT_SETTINGS.godRaysTintColor) },
        },
        vertexShader: passthrough_vert,
        fragmentShader: combine_frag,
    });
}
