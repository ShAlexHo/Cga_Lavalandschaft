import * as THREE from 'three';

const _world_position = new THREE.Vector3();

// computeVertex(local_x, local_y, local_z, world_position) -> { x, y, z, bump? }
// bump is only written when the mesh's geometry has an a_bump attribute (currently just the ground).
export function bakeVertexDisplacement(mesh, computeVertex) {
    mesh.updateMatrixWorld(true);
    const pristine = mesh.pristine_positions;
    const position_attribute = mesh.geometry.attributes.position;
    const bump_attribute = mesh.geometry.attributes.a_bump;

    for (let i = 0; i < position_attribute.count; i++) {
        const local_x = pristine[i * 3];
        const local_y = pristine[i * 3 + 1];
        const local_z = pristine[i * 3 + 2];
        _world_position.set(local_x, local_y, local_z).applyMatrix4(mesh.matrixWorld);

        const { x, y, z, bump } = computeVertex(local_x, local_y, local_z, _world_position);
        position_attribute.setXYZ(i, x, y, z);
        if (bump_attribute) bump_attribute.setX(i, bump);
    }
    position_attribute.needsUpdate = true;
    if (bump_attribute) bump_attribute.needsUpdate = true;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
}
