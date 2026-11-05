import * as THREE from 'three';
import {
    SUN_LIGHT_POSITION, SUN_VISUAL_RADIUS,
    SUN_ORBIT_RADIUS, SUN_ORBIT_HEIGHT, SUN_ORBIT_START_ANGLE, SUN_ORBIT_SPEED,
} from '../config.js';
import { createSunMaterial, updateSunMaterial } from '../rendering/sun_material.js';

export function createSun(scene) {
    const material = createSunMaterial();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(SUN_VISUAL_RADIUS, 32, 32), material);
    mesh.position.set(SUN_LIGHT_POSITION.x, SUN_LIGHT_POSITION.y, SUN_LIGHT_POSITION.z);

    scene.add(mesh);

    return {
        mesh,
        position: mesh.position,
        update(time) {
            const angle = SUN_ORBIT_START_ANGLE + time * SUN_ORBIT_SPEED;
            mesh.position.set(SUN_ORBIT_RADIUS * Math.cos(angle), SUN_ORBIT_HEIGHT, SUN_ORBIT_RADIUS * Math.sin(angle));
            updateSunMaterial(material, time);
        },
        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
    };
}
