import { describe, test, expect, vi } from 'vitest';

vi.mock('three', () => {
    class BufferAttribute {
        constructor(array, item_size) { this.array = array; this.itemSize = item_size; }
    }
    class BufferGeometry {
        constructor() { this.attributes = {}; }
        setAttribute(name, attribute) { this.attributes[name] = attribute; return this; }
    }
    class Points {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0, set: vi.fn() };
            this.frustumCulled = true;
        }
    }
    return { BufferAttribute, BufferGeometry, Points };
});

import { createImpactSmokeGeometry } from '../impact_smoke_geometry.js';
import { makeScene } from '../../test-utils/three_mocks.js';
import {
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_PARTICLES_PER_BURST, INTERACTION_SMOKE_PARTICLE_LIFETIME,
} from '../../config.js';

describe('createImpactSmokeGeometry', () => {
    test('adds the points object to the scene', () => {
        const scene = makeScene();
        const points = createImpactSmokeGeometry(scene, {});
        expect(scene.add).toHaveBeenCalledWith(points);
    });

    test('uses the given material', () => {
        const material = {};
        const points = createImpactSmokeGeometry(makeScene(), material);
        expect(points.material).toBe(material);
    });

    test('disables frustum culling, since positions are computed on the GPU', () => {
        const points = createImpactSmokeGeometry(makeScene(), {});
        expect(points.frustumCulled).toBe(false);
    });

    test('sizes buffers for INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST particles', () => {
        const points = createImpactSmokeGeometry(makeScene(), {});
        const particle_count = INTERACTION_SMOKE_MAX_BURSTS * INTERACTION_SMOKE_PARTICLES_PER_BURST;
        expect(points.geometry.attributes.position.array).toHaveLength(particle_count * 3);
        expect(points.geometry.attributes.a_burst_index.array).toHaveLength(particle_count);
        expect(points.geometry.attributes.a_seed.array).toHaveLength(particle_count * 4);
        expect(points.geometry.attributes.a_seed.itemSize).toBe(4);
        expect(points.geometry.attributes.a_phase_offset.array).toHaveLength(particle_count);
    });

    test('spreads a_phase_offset across [0, INTERACTION_SMOKE_PARTICLE_LIFETIME)', () => {
        const points = createImpactSmokeGeometry(makeScene(), {});
        for (const value of points.geometry.attributes.a_phase_offset.array) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(INTERACTION_SMOKE_PARTICLE_LIFETIME);
        }
    });

    test('assigns burst_index 0..MAX_BURSTS-1 evenly across the particle pool', () => {
        const points = createImpactSmokeGeometry(makeScene(), {});
        const burst_index = points.geometry.attributes.a_burst_index.array;
        expect(burst_index[0]).toBe(0);
        expect(burst_index[INTERACTION_SMOKE_PARTICLES_PER_BURST]).toBe(1);
        expect(burst_index[burst_index.length - 1]).toBe(INTERACTION_SMOKE_MAX_BURSTS - 1);
    });
});
