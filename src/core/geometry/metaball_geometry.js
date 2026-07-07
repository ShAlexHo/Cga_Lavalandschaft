import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import {
    METABALL_SCALE_XY,
    METABALL_SCALE_Z,
    METABALL_RESOLUTION,
    METABALL_MAX_POLYGON_COUNT,
    METABALL_DEFAULT_ISOLATION,
} from '../config.js';

export function createMetaballGeometry(scene, material) {
    const effect = new MarchingCubes(METABALL_RESOLUTION, material, false, false, METABALL_MAX_POLYGON_COUNT);
    effect.isolation = METABALL_DEFAULT_ISOLATION;
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
