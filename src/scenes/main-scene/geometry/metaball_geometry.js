import * as THREE from 'three';
import {
    METABALL_SCALE_XY, METABALL_SCALE_Z,
    METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createMetaballGeometry(scene, material) {
    const geometry = new THREE.BoxGeometry(
        2 * METABALL_PROXY_HALF_EXTENT_X,
        2 * METABALL_PROXY_HALF_EXTENT_Y,
        2 * METABALL_PROXY_HALF_EXTENT_Z,
    );
    geometry.translate(METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.isolation = DEFAULT_SETTINGS.metaballIsolation;
    mesh.radius_scale = DEFAULT_SETTINGS.metaballRadius;
    mesh.scale.set(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    scene.add(mesh);
    return mesh;
}

export function ballToWorldPosition(ball, mesh) {
    return {
        x: mesh.position.x + mesh.scale.x * (2 * ball.x - 1),
        y: mesh.position.y + mesh.scale.y * (2 * ball.y - 1),
        z: mesh.position.z + mesh.scale.z * (2 * ball.z - 1),
    };
}

export function ballToWorldRadius(ball, mesh) {
    const field_radius = Math.sqrt(ball.strength / (mesh.isolation + ball.subtract));
    return 2 * mesh.scale.x * field_radius * mesh.radius_scale;
}
