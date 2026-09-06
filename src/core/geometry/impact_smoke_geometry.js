import * as THREE from 'three';
import { random } from '../rand.js';
import {
    INTERACTION_SMOKE_MAX_BURSTS,
    INTERACTION_SMOKE_PARTICLES_PER_BURST,
    INTERACTION_SMOKE_PARTICLE_LIFETIME,
} from '../config.js';

export function createImpactSmokeGeometry(scene, material) {
    const particle_count = INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST;

    const burst_index = new Float32Array(particle_count);
    const seed = new Float32Array(particle_count * 4);
    const phase_offset = new Float32Array(particle_count);
    for (let i = 0; i < particle_count; i++) {
        burst_index[i] = Math.floor(i / INTERACTION_SMOKE_PARTICLES_PER_BURST);
        seed.set([random(0, Math.PI * 2), random(0.3, 1.0), random(0.3, 1.0), random(0, 1)], i * 4);
        phase_offset[i] = random(0, INTERACTION_SMOKE_PARTICLE_LIFETIME);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particle_count * 3), 3));
    geometry.setAttribute('a_burst_index', new THREE.BufferAttribute(burst_index, 1));
    geometry.setAttribute('a_seed', new THREE.BufferAttribute(seed, 4));
    geometry.setAttribute('a_phase_offset', new THREE.BufferAttribute(phase_offset, 1));

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, 0);
    // positions are computed in impact_smoke.vert, so THREE can't derive a bounding sphere for culling
    points.frustumCulled = false;
    scene.add(points);

    return points;
}
