import * as THREE from 'three';

export function createSmokeGeometry(scene, material, particle_seeds) {
    const particle_count = particle_seeds.is_ambient.length;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particle_count * 3), 3));
    geometry.setAttribute('a_is_ambient', new THREE.BufferAttribute(particle_seeds.is_ambient, 1));
    geometry.setAttribute('a_motion_seed', new THREE.BufferAttribute(particle_seeds.motion_seed, 4));
    geometry.setAttribute('a_timing_seed', new THREE.BufferAttribute(particle_seeds.timing_seed, 2));
    geometry.setAttribute('a_appearance', new THREE.BufferAttribute(particle_seeds.appearance, 3));
    geometry.setAttribute('a_accent_base', new THREE.BufferAttribute(particle_seeds.accent_base, 1));
    geometry.setAttribute('a_ember_cooling_mult', new THREE.BufferAttribute(particle_seeds.ember_cooling_mult, 1));
    geometry.setAttribute('a_ambient_seed', new THREE.BufferAttribute(particle_seeds.ambient_seed, 4));

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, 0);
    // positions are computed in smoke.vert, so THREE can't derive a bounding sphere for culling
    points.frustumCulled = false;
    scene.add(points);

    return points;
}

export function setSmokeDrawRange(points, count) {
    points.geometry.setDrawRange(0, count);
}
