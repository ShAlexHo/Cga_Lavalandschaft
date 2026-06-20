import * as THREE from 'three';

const PROFILE = [
    new THREE.Vector2(14.0, 0.000),
    new THREE.Vector2(11.0, 0.875),
    new THREE.Vector2(8.0, 1.875),
    new THREE.Vector2(5.0, 2.875),
    new THREE.Vector2(2.5, 3.750),
    new THREE.Vector2(1.1, 4.500),
    new THREE.Vector2(0.8, 4.875),
    new THREE.Vector2(0.95, 5.000),
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
