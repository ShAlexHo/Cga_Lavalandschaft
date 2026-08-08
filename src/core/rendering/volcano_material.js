import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/volcano.vert?raw';
import fragment_glsl from '../shaders/volcano.frag?raw';
import { VOLCANO_LIGHT_POSITION, SUN_LIGHT_COLOR } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();
const _sun_view_position = new THREE.Vector3();

export function createVolcanoMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_sun_position: { value: new THREE.Vector3() },
            u_sun_color: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
            u_sun_focus: { value: DEFAULT_SETTINGS.sunFocus },
            u_displacement_scale: { value: DEFAULT_SETTINGS.volcanoDisplacementScale },
            u_displacement_frequency: { value: DEFAULT_SETTINGS.volcanoDisplacementFrequency },
            u_rock_color: { value: new THREE.Color(DEFAULT_SETTINGS.volcanoRockColor) },
        },
        side: THREE.DoubleSide,
    });
}

export function updateVolcanoLight(material, camera, sun_world_position) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    computeLightViewPosition(camera, sun_world_position, _sun_view_position);
    material.uniforms.u_sun_position.value.copy(_sun_view_position);
}
