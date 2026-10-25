import { random } from '../rand.js';
import {
    INTERACTION_SMOKE_MAX_BURSTS,
    INTERACTION_SMOKE_PARTICLES_PER_BURST,
    INTERACTION_SMOKE_PARTICLE_LIFETIME,
} from '../config.js';

export const PARTICLE_COUNT = INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST;

function createParticleSeeds() {
    const burst_index = new Float32Array(PARTICLE_COUNT);
    const seed = new Float32Array(PARTICLE_COUNT * 4); // angle, radius_seed, rise_seed, shape_seed
    const phase_offset = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        burst_index[i] = Math.floor(i / INTERACTION_SMOKE_PARTICLES_PER_BURST);
        seed.set([random(0, Math.PI * 2), random(0.3, 1.0), random(0.3, 1.0), random(0, 1)], i * 4);
        phase_offset[i] = random(0, INTERACTION_SMOKE_PARTICLE_LIFETIME);
    }
    return { burst_index, seed, phase_offset };
}

export const particle_seeds = createParticleSeeds();
