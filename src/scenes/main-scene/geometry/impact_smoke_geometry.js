import * as THREE from 'three';

export function createImpactSmokeGeometry(scene, material, particle_seeds) {
    const particle_count = particle_seeds.burst_index.length;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particle_count * 3), 3));
    geometry.setAttribute('a_burst_index', new THREE.BufferAttribute(particle_seeds.burst_index, 1));
    geometry.setAttribute('a_seed', new THREE.BufferAttribute(particle_seeds.seed, 4));
    geometry.setAttribute('a_phase_offset', new THREE.BufferAttribute(particle_seeds.phase_offset, 1));

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, 0);
    // positions are computed in impact_smoke.vert, so THREE can't derive a bounding sphere for culling
    points.frustumCulled = false;
    scene.add(points);

    return points;
}
