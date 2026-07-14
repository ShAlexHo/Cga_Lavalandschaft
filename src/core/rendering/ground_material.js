import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/ground.vert?raw';
import fragment_glsl from '../shaders/ground.frag?raw';
import { VOLCANO_LIGHT_POSITION, GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY, GROUND_DEFAULT_CRACK_SOFTNESS, SUN_LIGHT_POSITION, SUN_LIGHT_COLOR } from '../config.js';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const SUN_WORLD_POSITION = new THREE.Vector3(SUN_LIGHT_POSITION.x, SUN_LIGHT_POSITION.y, SUN_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();
const _sun_view_position = new THREE.Vector3();

export function createGroundMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_sun_position: { value: new THREE.Vector3() },
            u_sun_color: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_sun_focus: { value: 8.0 },
            u_displacement_scale: { value: GROUND_DEFAULT_DISPLACEMENT_SCALE },
            u_displacement_frequency: { value: GROUND_DEFAULT_DISPLACEMENT_FREQUENCY },
            u_crack_frequency: { value: GROUND_CRACK_FREQUENCY },
            u_crack_softness: { value: GROUND_DEFAULT_CRACK_SOFTNESS },
            u_rock_color: { value: new THREE.Color(0x211616) },
            u_crack_color: { value: new THREE.Color(0xff5b00) },
            u_crack_color_2: { value: new THREE.Color(0xe5a400) },
        },
        side: THREE.DoubleSide,
    });
}

export function updateGroundLight(material, camera) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    computeLightViewPosition(camera, SUN_WORLD_POSITION, _sun_view_position);
    material.uniforms.u_sun_position.value.copy(_sun_view_position);
}
