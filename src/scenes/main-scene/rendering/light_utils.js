import * as THREE from 'three';
import { VOLCANO_LIGHT_POSITION } from '../config.js';

export function computeLightViewPosition(camera, world_position, target) {
    return target.copy(world_position).applyMatrix4(camera.matrixWorldInverse);
}

const KEY_LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const scratch_key_light_view_position = new THREE.Vector3();
const scratch_sun_view_position = new THREE.Vector3();

export function updateSunLightUniform(material, camera, sun_world_position) {
    computeLightViewPosition(camera, sun_world_position, scratch_sun_view_position);
    material.uniforms.u_sun_position.value.copy(scratch_sun_view_position);
}

export function updateKeyAndSunLightUniforms(material, camera, sun_world_position) {
    computeLightViewPosition(camera, KEY_LIGHT_WORLD_POSITION, scratch_key_light_view_position);
    material.uniforms.u_light_position.value.copy(scratch_key_light_view_position);
    updateSunLightUniform(material, camera, sun_world_position);
}
