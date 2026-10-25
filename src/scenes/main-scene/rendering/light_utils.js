import * as THREE from 'three';
import { VOLCANO_LIGHT_POSITION } from '../config.js';

export function computeLightViewPosition(camera, world_position, target) {
    return target.copy(world_position).applyMatrix4(camera.matrixWorldInverse);
}

const KEY_LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const _key_light_view_position = new THREE.Vector3();
const _sun_view_position = new THREE.Vector3();

// Shared by every material lit by the orbiting sun (ground, volcano, smoke, impact smoke).
export function updateSunLightUniform(material, camera, sun_world_position) {
    computeLightViewPosition(camera, sun_world_position, _sun_view_position);
    material.uniforms.u_sun_position.value.copy(_sun_view_position);
}

// Shared by every material lit by both the fixed key light and the orbiting sun (ground, volcano).
export function updateKeyAndSunLightUniforms(material, camera, sun_world_position) {
    computeLightViewPosition(camera, KEY_LIGHT_WORLD_POSITION, _key_light_view_position);
    material.uniforms.u_light_position.value.copy(_key_light_view_position);
    updateSunLightUniform(material, camera, sun_world_position);
}
