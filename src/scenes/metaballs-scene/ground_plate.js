import * as THREE from 'three';
import { GROUND_PLATE_SIZE, GROUND_COLOR, GROUND_AMBIENT_LIGHT, GROUND_KEY_LIGHT, GROUND_GLOW_LIGHT } from './config.js';

export function createGroundPlate(scene) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(GROUND_PLATE_SIZE.width, GROUND_PLATE_SIZE.thickness, GROUND_PLATE_SIZE.depth),
        new THREE.MeshStandardMaterial({ color: GROUND_COLOR, roughness: 1, metalness: 0 }),
    );

    const ambient_light = new THREE.AmbientLight(GROUND_AMBIENT_LIGHT.color, GROUND_AMBIENT_LIGHT.intensity);
    const key_light = new THREE.DirectionalLight(GROUND_KEY_LIGHT.color, GROUND_KEY_LIGHT.intensity);
    key_light.position.set(GROUND_KEY_LIGHT.position.x, GROUND_KEY_LIGHT.position.y, GROUND_KEY_LIGHT.position.z);
    const glow_light = new THREE.PointLight(GROUND_GLOW_LIGHT.color, GROUND_GLOW_LIGHT.intensity, GROUND_GLOW_LIGHT.distance);
    glow_light.position.y = GROUND_GLOW_LIGHT.height;

    scene.add(mesh, ambient_light, key_light, glow_light);

    return {
        mesh,
        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getHeight: () => mesh.position.y + GROUND_PLATE_SIZE.thickness / 2,
        setHeight: value => { mesh.position.y = value - GROUND_PLATE_SIZE.thickness / 2; },
    };
}
