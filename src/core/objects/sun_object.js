import * as THREE from 'three';
import { SUN_LIGHT_POSITION, SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY, SUN_LIGHT_DISTANCE, SUN_VISUAL_RADIUS } from '../config.js';

export function createSun(scene) {
    const light = new THREE.PointLight(SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY, SUN_LIGHT_DISTANCE);
    light.position.set(SUN_LIGHT_POSITION.x, SUN_LIGHT_POSITION.y, SUN_LIGHT_POSITION.z);

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(SUN_VISUAL_RADIUS, 24, 24),
        new THREE.MeshBasicMaterial({ color: SUN_LIGHT_COLOR })
    );
    mesh.position.copy(light.position);

    scene.add(light, mesh);

    return {
        light,
        mesh,
        getVisible: () => light.visible,
        setVisible: value => { light.visible = value; mesh.visible = value; },
    };
}
