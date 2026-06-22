import * as THREE from 'three';

const PROFILE = [
    new THREE.Vector2(14.0, 0.0),
    new THREE.Vector2(2.5,  5.0),
    new THREE.Vector2(1.0,  4.2),
];

export function create_volcano(scene) {
    const geometry = new THREE.LatheGeometry(PROFILE, 48);
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    return mesh;
}
