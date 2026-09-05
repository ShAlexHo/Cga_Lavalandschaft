import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import {
    METABALL_SCALE_XY,
    METABALL_SCALE_Z,
    METABALL_RESOLUTION,
    METABALL_MAX_POLYGON_COUNT,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createMetaballGeometry(scene, material) {
    const effect = new MarchingCubes(METABALL_RESOLUTION, material, false, false, METABALL_MAX_POLYGON_COUNT);
    effect.isolation = DEFAULT_SETTINGS.metaballIsolation;
    effect.scale.set(METABALL_SCALE_XY, METABALL_SCALE_XY, METABALL_SCALE_Z);
    scene.add(effect);
    return effect;
}

export function rebuildMetaballGeometry(effect, balls) {
    effect.reset();
    for (const ball of balls) {
        effect.addBall(ball.x, ball.y, ball.z, ball.strength, ball.subtract);
    }
    effect.update();
}

// ball.x/y/z are normalized MarchingCubes field-space coordinates in [0, 1].
export function ballToWorldPosition(ball, effect) {
    return {
        x: effect.position.x + effect.scale.x * (2 * ball.x - 1),
        y: effect.position.y + effect.scale.y * (2 * ball.y - 1),
        z: effect.position.z + effect.scale.z * (2 * ball.z - 1),
    };
}

// Isosurface radius where strength / distance^2 - subtract == effect.isolation, in world space.
export function ballToWorldRadius(ball, effect) {
    const field_radius = Math.sqrt(ball.strength / (effect.isolation + ball.subtract));
    return 2 * effect.scale.x * field_radius;
}
