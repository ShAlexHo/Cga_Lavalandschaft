import * as THREE from 'three';

const PROFILE = [
    new THREE.Vector2(14.0, 0.0),
    new THREE.Vector2(2.5,  5.0),
    new THREE.Vector2(1.0,  4.2),
];

const PROFILE_SUBDIVISIONS = 24;
const LATHE_SEGMENTS       = 96;

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
    interpolated_points.push(profile[profile.length - 1]);
    return interpolated_points;
}

export function createVolcanoGeometry(scene, material) {
    const fine_profile = subdivideProfile(PROFILE, PROFILE_SUBDIVISIONS);
    const geometry = new THREE.LatheGeometry(fine_profile, LATHE_SEGMENTS);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    return mesh;
}
