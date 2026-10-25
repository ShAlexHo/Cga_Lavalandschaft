import * as THREE from 'three';
import { VOLCANO_PROFILE, VOLCANO_PROFILE_SUBDIVISIONS, VOLCANO_LATHE_SEGMENTS } from '../config.js';
import { crackDisplacementNoise } from './terrain_crack_noise.js';
import { bakeVertexDisplacement } from './vertex_displacement_utils.js';

function subdivideProfile(profile, steps) {
    const interpolated_points = [];
    for (let i = 0; i < profile.length - 1; i++) {
        const point_a = profile[i];
        const point_b = profile[i + 1];
        for (let step = 0; step < steps; step++) {
            const interpolation_factor = step / steps;
            interpolated_points.push(new THREE.Vector2(
                point_a.x + (point_b.x - point_a.x) * interpolation_factor,
                point_a.y + (point_b.y - point_a.y) * interpolation_factor,
            ));
        }
    }
    const last_point = profile[profile.length - 1];
    interpolated_points.push(new THREE.Vector2(last_point.x, last_point.y));
    return interpolated_points;
}

export function createVolcanoGeometry(scene, material) {
    const fine_profile = subdivideProfile(VOLCANO_PROFILE, VOLCANO_PROFILE_SUBDIVISIONS);
    const geometry = new THREE.LatheGeometry(fine_profile, VOLCANO_LATHE_SEGMENTS);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.pristine_positions = geometry.attributes.position.array.slice();
    scene.add(mesh);

    return mesh;
}

export function bakeCrackDisplacement(mesh, frequency, scale) {
    bakeVertexDisplacement(mesh, (local_x, local_y, local_z, world_position) => {
        const noise = crackDisplacementNoise(world_position.x, world_position.y, world_position.z, frequency);
        const displacement = -Math.max(0.0, 0.85 - noise);
        return { x: local_x, y: local_y + displacement * scale, z: local_z };
    });
}
