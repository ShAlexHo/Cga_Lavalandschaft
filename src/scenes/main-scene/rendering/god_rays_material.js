import * as THREE from 'three';
import passthrough_vertex_glsl from '../shaders/god_rays_passthrough.vert?raw';
import generate_fragment_glsl from '../shaders/god_rays_generate.frag?raw';
import sun_disc_vertex_glsl from '../shaders/god_rays_sun_disc.vert?raw';
import sun_disc_fragment_glsl from '../shaders/god_rays_sun_disc.frag?raw';
import combine_fragment_glsl from '../shaders/god_rays_combine.frag?raw';
import { GOD_RAYS_SAMPLE_COUNT } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

const generate_fragment_glsl_resolved = generate_fragment_glsl.replaceAll('GOD_RAYS_SAMPLE_COUNT', GOD_RAYS_SAMPLE_COUNT);

export function createGodRaysOcclusionMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x000000 });
}

export function createGodRaysSunDiscMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: sun_disc_vertex_glsl,
        fragmentShader: sun_disc_fragment_glsl,
        depthWrite: false,
        precision: 'highp',
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
        vertexShader: passthrough_vertex_glsl,
        fragmentShader: generate_fragment_glsl_resolved,
        precision: 'highp',
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
        vertexShader: passthrough_vertex_glsl,
        fragmentShader: combine_fragment_glsl,
        precision: 'highp',
    });
}
