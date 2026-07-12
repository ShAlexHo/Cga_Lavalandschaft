import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/ground.vert?raw';
import fragment_glsl from '../shaders/ground.frag?raw';
import { VOLCANO_LIGHT_POSITION, GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY, GROUND_DEFAULT_CRACK_SOFTNESS } from '../config.js';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();

export function createGroundMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_disp_scale: { value: GROUND_DEFAULT_DISPLACEMENT_SCALE },
            u_disp_freq: { value: GROUND_DEFAULT_DISPLACEMENT_FREQUENCY },
            u_crack_freq: { value: GROUND_CRACK_FREQUENCY },
            u_crack_softness: { value: GROUND_DEFAULT_CRACK_SOFTNESS },
            u_rock_color: { value: new THREE.Color(0x2b1412) },
            u_crack_color: { value: new THREE.Color(0xff5b2c) },
        },
        side: THREE.DoubleSide,
    });
}

export function updateGroundLight(material, camera) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
}
