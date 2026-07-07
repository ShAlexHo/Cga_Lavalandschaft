import * as THREE from 'three';

const toHexColor = color => '#' + color.getHexString();

export function createGround(scene) {
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
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
