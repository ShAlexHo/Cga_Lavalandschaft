export function computeLightViewPosition(camera, world_position, target) {
    return target.copy(world_position).applyMatrix4(camera.matrixWorldInverse);
}
