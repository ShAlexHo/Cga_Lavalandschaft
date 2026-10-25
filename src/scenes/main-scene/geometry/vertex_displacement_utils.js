import * as THREE from 'three';

const scratch_world_position = new THREE.Vector3();

export function bakeVertexDisplacement(mesh, computeVertex) {
    mesh.updateMatrixWorld(true);
    const pristine_positions = mesh.pristine_positions;
    const position_attribute = mesh.geometry.attributes.position;
    const bump_attribute = mesh.geometry.attributes.a_bump;

    for (let i = 0; i < position_attribute.count; i++) {
        const local_x = pristine_positions[i * 3];
        const local_y = pristine_positions[i * 3 + 1];
        const local_z = pristine_positions[i * 3 + 2];
        scratch_world_position.set(local_x, local_y, local_z).applyMatrix4(mesh.matrixWorld);

        const { x, y, z, bump } = computeVertex(local_x, local_y, local_z, scratch_world_position);
        position_attribute.setXYZ(i, x, y, z);
        if (bump_attribute) bump_attribute.setX(i, bump);
    }
    position_attribute.needsUpdate = true;
    if (bump_attribute) bump_attribute.needsUpdate = true;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
}
