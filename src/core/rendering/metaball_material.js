import * as THREE from 'three';
import vertex_glsl from '../shaders/metaball.vert?raw';
import noise_glsl from '../shaders/noise.glsl?raw';
import fragment_glsl from '../shaders/metaball.frag?raw';
import { METABALL_LIGHT_POSITION } from '../config.js';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(METABALL_LIGHT_POSITION.x, METABALL_LIGHT_POSITION.y, METABALL_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();

export function createMetaballMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: 1.0 },
            u_glow_color: { value: new THREE.Color(0xff3f00) },
            u_color_hot: { value: new THREE.Color(0xa01500) },
            u_color_cool: { value: new THREE.Color(0x7c3027) },
            u_noise_enabled: { value: 1.0 },
            u_noise_color_1: { value: new THREE.Color(0x7c3027) },
            u_noise_color_2: { value: new THREE.Color(0xea6927) },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
        },
        side: THREE.DoubleSide,
    });
}

export function updateMetaballLight(material, camera, time) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}
