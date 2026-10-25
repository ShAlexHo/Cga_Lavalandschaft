import { describe, test, expect, beforeEach } from 'vitest';
import { importFreshModule } from '../../test-utils/import_fresh_module.js';
import {
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_PARTICLES_PER_BURST, INTERACTION_SMOKE_PARTICLE_LIFETIME,
} from '../../config.js';

let particles_module;
beforeEach(async () => {
    particles_module = await importFreshModule(() => import('../impact_smoke_particles.js'));
});

describe('particle_seeds', () => {
    test('sizes buffers for INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST particles', () => {
        const { particle_seeds } = particles_module;
        const particle_count = INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST;
        expect(particle_seeds.burst_index).toHaveLength(particle_count);
        expect(particle_seeds.seed).toHaveLength(particle_count * 4);
        expect(particle_seeds.phase_offset).toHaveLength(particle_count);
    });

    test('spreads phase_offset across [0, INTERACTION_SMOKE_PARTICLE_LIFETIME)', () => {
        const { particle_seeds } = particles_module;
        for (const value of particle_seeds.phase_offset) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(INTERACTION_SMOKE_PARTICLE_LIFETIME);
        }
    });

    test('assigns burst_index 0..MAX_BURSTS-1 evenly across the particle pool', () => {
        const { burst_index } = particles_module.particle_seeds;
        expect(burst_index[0]).toBe(0);
        expect(burst_index[INTERACTION_SMOKE_PARTICLES_PER_BURST]).toBe(1);
        expect(burst_index[burst_index.length - 1]).toBe(INTERACTION_SMOKE_MAX_BURSTS - 1);
    });

    test('seeds are deterministic across fresh module instances', async () => {
        const first = particles_module.particle_seeds;
        const second_particles_module = await importFreshModule(() => import('../impact_smoke_particles.js'));
        const second = second_particles_module.particle_seeds;

        expect(Array.from(first.seed)).toEqual(Array.from(second.seed));
        expect(Array.from(first.phase_offset)).toEqual(Array.from(second.phase_offset));
    });
});
