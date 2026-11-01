import * as THREE from 'three';
import { VOLCANO_PROFILE, VOLCANO_LATHE_SEGMENTS } from '../main-scene/config.js';
import { VOLCANO_COLOR } from './config.js';

export function createVolcanoLathe(scene) {
    const profile = VOLCANO_PROFILE.map(point => new THREE.Vector2(point.x, point.y));
    scene.add(new THREE.Mesh(
        new THREE.LatheGeometry(profile, VOLCANO_LATHE_SEGMENTS),
        new THREE.MeshStandardMaterial({ color: VOLCANO_COLOR, roughness: 1, metalness: 0, side: THREE.DoubleSide }),
    ));
}
