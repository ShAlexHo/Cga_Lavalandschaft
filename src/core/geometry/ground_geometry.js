import * as THREE from 'three';
import { GROUND_SIZE, GROUND_SEGMENTS } from '../config.js';
import { crackDisplacementNoise, warpedFractalBrownianMotion } from './terrain_crack_noise.js';

const _world_position = new THREE.Vector3();

function smoothstep(edge0, edge1, x) {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
}

export function createGroundGeometry(scene, material) {
    const geometry = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE, GROUND_SEGMENTS, GROUND_SEGMENTS);
    geometry.setAttribute('a_bump', new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count), 1));
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -6;
    mesh.receiveShadow = true;
    mesh.pristine_positions = geometry.attributes.position.array.slice();
    scene.add(mesh);
    return mesh;
}

export function bakeGroundDisplacement(mesh, {
    frequency, scale, volcano_crack_frequency, volcano_crack_scale, volcano_position, proximity_radius,
}) {
    mesh.updateMatrixWorld(true);
    const pristine = mesh.pristine_positions;
    const position_attribute = mesh.geometry.attributes.position;
    const bump_attribute = mesh.geometry.attributes.a_bump;

    for (let i = 0; i < position_attribute.count; i++) {
        const local_x = pristine[i * 3];
        const local_y = pristine[i * 3 + 1];
        const local_z = pristine[i * 3 + 2];
        _world_position.set(local_x, local_y, local_z).applyMatrix4(mesh.matrixWorld);

        const bump_base = warpedFractalBrownianMotion(local_x * frequency, local_y * frequency, local_z * frequency, 0.6) * 2 - 1;
        const volcano_style_bump = crackDisplacementNoise(_world_position.x, _world_position.y, _world_position.z, volcano_crack_frequency) * 2 - 1;

        const volcano_distance = Math.hypot(_world_position.x - volcano_position.x, _world_position.z - volcano_position.z);
        const proximity = 1 - smoothstep(0, proximity_radius, volcano_distance);

        const bump = bump_base + (volcano_style_bump - bump_base) * proximity;
        const blended_scale = scale + (volcano_crack_scale - scale) * proximity;

        position_attribute.setXYZ(i, local_x, local_y, local_z + bump * blended_scale);
        bump_attribute.setX(i, bump);
    }
    position_attribute.needsUpdate = true;
    bump_attribute.needsUpdate = true;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
}
