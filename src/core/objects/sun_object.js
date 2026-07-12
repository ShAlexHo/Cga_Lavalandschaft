import * as THREE from 'three';
import { SUN_LIGHT_POSITION, SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY, SUN_LIGHT_DISTANCE, SUN_VISUAL_RADIUS } from '../config.js';
import { createSunMaterial, updateSunMaterial } from '../rendering/sun_material.js';

export function createSun(scene) {
    const light = new THREE.PointLight(SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY, SUN_LIGHT_DISTANCE);
    light.position.set(SUN_LIGHT_POSITION.x, SUN_LIGHT_POSITION.y, SUN_LIGHT_POSITION.z);

    const material = createSunMaterial();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(SUN_VISUAL_RADIUS, 32, 32), material);
    mesh.position.copy(light.position);

    scene.add(light, mesh);

    return {
        light,
        mesh,
        update(time) {
            updateSunMaterial(material, time);
        },
        getVisible: () => light.visible,
        setVisible: value => { light.visible = value; mesh.visible = value; },
    };
}
