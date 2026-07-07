import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

export const SCALE_XY = 30.0;
export const SCALE_Z  = 30.0;

const RESOLUTION         = 180;
const MAX_POLYGON_COUNT  = 250_000;
const DEFAULT_ISOLATION  = 50;

export function createMetaballGeometry(scene, material) {
    const effect = new MarchingCubes(RESOLUTION, material, false, false, MAX_POLYGON_COUNT);
    effect.isolation = DEFAULT_ISOLATION;
    effect.scale.set(SCALE_XY, SCALE_XY, SCALE_Z);
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
