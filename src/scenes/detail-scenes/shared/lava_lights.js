import * as THREE from 'three';
import { LAVA_AMBIENT_LIGHT, LAVA_KEY_LIGHT, LAVA_GLOW_LIGHT } from './config.js';

export function createLavaLights(scene, glow_position) {
    const ambient_light = new THREE.AmbientLight(LAVA_AMBIENT_LIGHT.color, LAVA_AMBIENT_LIGHT.intensity);
    const key_light = new THREE.DirectionalLight(LAVA_KEY_LIGHT.color, LAVA_KEY_LIGHT.intensity);
    key_light.position.set(LAVA_KEY_LIGHT.position.x, LAVA_KEY_LIGHT.position.y, LAVA_KEY_LIGHT.position.z);
    const glow_light = new THREE.PointLight(LAVA_GLOW_LIGHT.color, LAVA_GLOW_LIGHT.intensity, LAVA_GLOW_LIGHT.distance);
    glow_light.position.set(glow_position.x, glow_position.y, glow_position.z);

    scene.add(ambient_light, key_light, glow_light);
}
