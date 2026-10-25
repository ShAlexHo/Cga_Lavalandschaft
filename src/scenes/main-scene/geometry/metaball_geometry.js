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
    const effect = new THREE.Mesh(geometry, material);
    effect.isolation = DEFAULT_SETTINGS.metaballIsolation;
    effect.radius_scale = DEFAULT_SETTINGS.metaballRadius;
    effect.scale.set(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    scene.add(effect);
    return effect;
}

export function ballToWorldPosition(ball, effect) {
    return {
        x: effect.position.x + effect.scale.x * (2 * ball.x - 1),
        y: effect.position.y + effect.scale.y * (2 * ball.y - 1),
        z: effect.position.z + effect.scale.z * (2 * ball.z - 1),
    };
}

export function ballToWorldRadius(ball, effect) {
    const field_radius = Math.sqrt(ball.strength / (effect.isolation + ball.subtract));
    return 2 * effect.scale.x * field_radius * effect.radius_scale;
}
