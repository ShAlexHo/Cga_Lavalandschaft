import * as THREE from 'three';
import vertex_glsl from '../shaders/metaball.vert?raw';
import noise_glsl from '../shaders/noise.glsl?raw';
import fragment_glsl from '../shaders/metaball.frag?raw';
import {
    METABALL_LIGHT_POSITION,
    METABALL_GPU_MAX_BALLS,
    METABALL_RAYMARCH_MAX_STEPS,
    METABALL_RAYMARCH_STEPS,
    METABALL_RAYMARCH_NORMAL_EPSILON,
    METABALL_PROXY_HALF_EXTENT_X,
    METABALL_PROXY_HALF_EXTENT_Y,
    METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_X,
    METABALL_PROXY_CENTER_Y,
    METABALL_PROXY_CENTER_Z,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(METABALL_LIGHT_POSITION.x, METABALL_LIGHT_POSITION.y, METABALL_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();

// Compile-time array/loop sizes for GLSL; mirrors INTERACTION_MAX_POINTS in volcano_material.js.
const fragment_glsl_resolved = fragment_glsl
    .replaceAll('METABALL_GPU_MAX_BALLS', METABALL_GPU_MAX_BALLS)
    .replaceAll('METABALL_RAYMARCH_MAX_STEPS', METABALL_RAYMARCH_MAX_STEPS);

export function createMetaballMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl_resolved,
        glslVersion: THREE.GLSL3,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: DEFAULT_SETTINGS.glowEnabled ? 1.0 : 0.0 },
            u_glow_color: { value: new THREE.Color(DEFAULT_SETTINGS.glowColor) },
            u_color_hot: { value: new THREE.Color(DEFAULT_SETTINGS.colorHot) },
            u_color_cool: { value: new THREE.Color(DEFAULT_SETTINGS.colorCool) },
            u_noise_enabled: { value: DEFAULT_SETTINGS.noiseEnabled ? 1.0 : 0.0 },
            u_noise_color_1: { value: new THREE.Color(DEFAULT_SETTINGS.noiseColor1) },
            u_noise_color_2: { value: new THREE.Color(DEFAULT_SETTINGS.noiseColor2) },
            u_bump_enabled: { value: DEFAULT_SETTINGS.bumpEnabled ? 1.0 : 0.0 },
            u_displacement: { value: DEFAULT_SETTINGS.displacementStrength },
            u_ball_center: { value: Array.from({ length: METABALL_GPU_MAX_BALLS }, () => new THREE.Vector3()) },
            u_ball_strength: { value: new Float32Array(METABALL_GPU_MAX_BALLS) },
            u_ball_subtract: { value: new Float32Array(METABALL_GPU_MAX_BALLS) },
            u_isolation: { value: DEFAULT_SETTINGS.metaballIsolation },
            u_effect_position: { value: new THREE.Vector3() },
            u_effect_scale: { value: 1.0 },
            u_box_half_extent: { value: new THREE.Vector3(METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z) },
            u_box_center: { value: new THREE.Vector3(METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z) },
            u_raymarch_steps: { value: METABALL_RAYMARCH_STEPS },
            u_normal_epsilon: { value: METABALL_RAYMARCH_NORMAL_EPSILON },
            u_projection_matrix: { value: new THREE.Matrix4() },
        },
        side: THREE.BackSide,
        precision: 'highp',
    });
}

export function updateMetaballLight(material, camera, time) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
    material.uniforms.u_projection_matrix.value.copy(camera.projectionMatrix);
}
