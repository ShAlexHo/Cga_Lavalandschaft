import * as THREE from 'three';
import { VOLCANO_PROFILE, VOLCANO_LATHE_SEGMENTS } from '../../main-scene/config.js';
import { VOLCANO_COLOR } from './config.js';

export function createVolcanoLathe(scene, volcano_profile = VOLCANO_PROFILE) {
    const profile = volcano_profile.map(point => new THREE.Vector2(point.x, point.y));
    const mesh = new THREE.Mesh(
        new THREE.LatheGeometry(profile, VOLCANO_LATHE_SEGMENTS),
        new THREE.MeshStandardMaterial({ color: VOLCANO_COLOR, roughness: 1, metalness: 0, side: THREE.DoubleSide }),
    );
    scene.add(mesh);
    return mesh;
}

export function averagedLatheProfile(lathe_geometry) {
    const { points, segments } = lathe_geometry.parameters;
    const positions = lathe_geometry.attributes.position;
    return points.map((point, j) => {
        let height_sum = 0;
        for (let i = 0; i < segments; i++) height_sum += positions.getY(i * points.length + j);
        return { x: point.x, y: height_sum / segments };
    });
}
