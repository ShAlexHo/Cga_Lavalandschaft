import * as THREE from 'three';
import { GROUND_COLOR } from './config.js';

export function createGroundPlate(scene, size) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size.width, size.thickness, size.depth),
        new THREE.MeshStandardMaterial({ color: GROUND_COLOR, roughness: 1, metalness: 0 }),
    );

    scene.add(mesh);

    return {
        mesh,
        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getHeight: () => mesh.position.y + size.thickness / 2,
        setHeight: value => { mesh.position.y = value - size.thickness / 2; },
    };
}
