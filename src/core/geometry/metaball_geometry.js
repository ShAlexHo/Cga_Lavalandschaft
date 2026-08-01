import * as THREE from 'three';
import { METABALL_SCALE_XY, METABALL_SCALE_Z, METABALL_RAYMARCH_BOUNDING_RADIUS } from '../config.js';

export function createMetaballGeometry(scene, material) {
    const geometry = new THREE.SphereGeometry(METABALL_RAYMARCH_BOUNDING_RADIUS, 24, 16);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    scene.add(mesh);
    return mesh;
}
