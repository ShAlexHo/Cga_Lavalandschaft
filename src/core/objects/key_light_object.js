import * as THREE from 'three';
import {
    KEY_LIGHT_COLOR, KEY_LIGHT_INTENSITY, VOLCANO_LIGHT_POSITION,
    AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY,
    KEY_LIGHT_SHADOW_MAP_SIZE, KEY_LIGHT_SHADOW_FRUSTUM, KEY_LIGHT_SHADOW_NEAR, KEY_LIGHT_SHADOW_FAR, KEY_LIGHT_SHADOW_BIAS,
} from '../config.js';

export function createKeyLight(scene) {
    const ambient_light = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
    const key_light = new THREE.DirectionalLight(KEY_LIGHT_COLOR, KEY_LIGHT_INTENSITY);
    key_light.position.set(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);

    key_light.castShadow = true;
    key_light.shadow.mapSize.set(KEY_LIGHT_SHADOW_MAP_SIZE, KEY_LIGHT_SHADOW_MAP_SIZE);
    key_light.shadow.camera.near = KEY_LIGHT_SHADOW_NEAR;
    key_light.shadow.camera.far = KEY_LIGHT_SHADOW_FAR;
    key_light.shadow.camera.left = -KEY_LIGHT_SHADOW_FRUSTUM;
    key_light.shadow.camera.right = KEY_LIGHT_SHADOW_FRUSTUM;
    key_light.shadow.camera.top = KEY_LIGHT_SHADOW_FRUSTUM;
    key_light.shadow.camera.bottom = -KEY_LIGHT_SHADOW_FRUSTUM;
    key_light.shadow.bias = KEY_LIGHT_SHADOW_BIAS;

    scene.add(ambient_light, key_light);

    return { ambient_light, key_light };
}
