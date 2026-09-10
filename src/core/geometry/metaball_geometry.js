import * as THREE from 'three';
import {
    METABALL_SCALE_XY,
    METABALL_SCALE_Z,
    METABALL_GPU_MAX_BALLS,
    METABALL_PROXY_HALF_EXTENT_X,
    METABALL_PROXY_HALF_EXTENT_Y,
    METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_X,
    METABALL_PROXY_CENTER_Y,
    METABALL_PROXY_CENTER_Z,
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

// Field-space ball data, doubled into the raymarcher's local coordinate space (see metaball.frag);
// unused slots get strength 0.
export function rebuildMetaballGeometry(effect, balls) {
    const uniforms = effect.material.uniforms;
    const centers = uniforms.u_ball_center.value;
    const strengths = uniforms.u_ball_strength.value;
    const subtracts = uniforms.u_ball_subtract.value;
    const radius_scale_squared = effect.radius_scale * effect.radius_scale;
    for (let i = 0; i < METABALL_GPU_MAX_BALLS; i++) {
        const ball = balls[i];
        if (ball) {
            centers[i].set(2 * ball.x - 1, 2 * ball.y - 1, 2 * ball.z - 1);
            strengths[i] = ball.strength * radius_scale_squared;
            subtracts[i] = ball.subtract;
        } else {
            strengths[i] = 0.0;
        }
    }
    uniforms.u_isolation.value = effect.isolation;
    uniforms.u_effect_position.value.copy(effect.position);
    uniforms.u_effect_scale.value = effect.scale.x;
}

// ball.x/y/z are normalized field-space coordinates in [0, 1].
export function ballToWorldPosition(ball, effect) {
    return {
        x: effect.position.x + effect.scale.x * (2 * ball.x - 1),
        y: effect.position.y + effect.scale.y * (2 * ball.y - 1),
        z: effect.position.z + effect.scale.z * (2 * ball.z - 1),
    };
}

// Isosurface radius (strength / distance^2 - subtract == effect.isolation), scaled by radius_scale
// to match rebuildMetaballGeometry's strength scaling.
export function ballToWorldRadius(ball, effect) {
    const field_radius = Math.sqrt(ball.strength / (effect.isolation + ball.subtract));
    return 2 * effect.scale.x * field_radius * effect.radius_scale;
}
