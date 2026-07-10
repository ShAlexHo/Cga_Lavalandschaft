import * as THREE from 'three';
import { toHexColor } from './color_utils.js';

export function createGround(scene) {
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.MeshStandardMaterial({
            color: 0x220500,
            emissive: 0x2b0800,
            roughness: 0.88,
            metalness: 0.05,
        })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -6;
    scene.add(mesh);

    return {
        mesh,
        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getColor: () => toHexColor(mesh.material.color),
        setColor: value => {
            mesh.material.color.set(value);
            mesh.material.emissive.set(value).multiplyScalar(0.25);
        },
    };
}
