import * as THREE from 'three';
import { VOLCANO_PROFILE, VOLCANO_PROFILE_SUBDIVISIONS, VOLCANO_LATHE_SEGMENTS } from '../config.js';

function subdivideProfile(profile, steps) {
    const interpolated_points = [];
    for (let i = 0; i < profile.length - 1; i++) {
        const point_a = profile[i], point_b = profile[i + 1];
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
    scene.add(mesh);

    return mesh;
}
