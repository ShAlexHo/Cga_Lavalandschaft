import * as THREE from 'three';
import { GROUND_SIZE, GROUND_SEGMENTS } from '../config.js';
import { crackDisplacementNoise, warpedFractalBrownianMotion } from './terrain_crack_noise.js';
import { bakeVertexDisplacement } from './vertex_displacement_utils.js';
import { smoothstep } from '../animation/math_utils.js';

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
    bakeVertexDisplacement(mesh, (local_x, local_y, local_z, world_position) => {
        const bump_base = warpedFractalBrownianMotion(local_x * frequency, local_y * frequency, local_z * frequency, 0.6) * 2 - 1;
        const volcano_style_bump = crackDisplacementNoise(world_position.x, world_position.y, world_position.z, volcano_crack_frequency) * 2 - 1;

        const volcano_distance = Math.hypot(world_position.x - volcano_position.x, world_position.z - volcano_position.z);
        const proximity = 1 - smoothstep(0, proximity_radius, volcano_distance);

        const bump = bump_base + (volcano_style_bump - bump_base) * proximity;
        const blended_scale = scale + (volcano_crack_scale - scale) * proximity;

        return { x: local_x, y: local_y, z: local_z + bump * blended_scale, bump };
    });
}
