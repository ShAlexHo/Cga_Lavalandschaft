import * as THREE from 'three';
import { VOLCANO_PROFILE, VOLCANO_PROFILE_SUBDIVISIONS, VOLCANO_LATHE_SEGMENTS } from '../config.js';
import { crackDisplacementNoise } from './volcano_crack_displacement.js';

const _world_position = new THREE.Vector3();

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
    mesh.updateMatrixWorld(true);
    const pristine = mesh.pristine_positions;
    const position_attribute = mesh.geometry.attributes.position;

    for (let i = 0; i < position_attribute.count; i++) {
        const local_x = pristine[i * 3];
        const local_y = pristine[i * 3 + 1];
        const local_z = pristine[i * 3 + 2];
        _world_position.set(local_x, local_y, local_z).applyMatrix4(mesh.matrixWorld);

        const noise = crackDisplacementNoise(_world_position.x, _world_position.y, _world_position.z, frequency);
        const displacement = -Math.max(0.0, 0.85 - noise);

        position_attribute.setXYZ(i, local_x, local_y + displacement * scale, local_z);
    }
    position_attribute.needsUpdate = true;
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
}
