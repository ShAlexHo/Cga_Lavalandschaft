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

function makeParticleSeeds(particle_count) {
    return {
        burst_index: new Float32Array(particle_count),
        seed: new Float32Array(particle_count * 4),
        phase_offset: new Float32Array(particle_count),
    };
}

describe('createImpactSmokeGeometry', () => {
    test('adds the points object to the scene', () => {
        const scene = makeScene();
        const points = createImpactSmokeGeometry(scene, {}, makeParticleSeeds(10));
        expect(scene.add).toHaveBeenCalledWith(points);
    });

    test('uses the given material', () => {
        const material = {};
        const points = createImpactSmokeGeometry(makeScene(), material, makeParticleSeeds(10));
        expect(points.material).toBe(material);
    });

    test('disables frustum culling, since positions are computed on the GPU', () => {
        const points = createImpactSmokeGeometry(makeScene(), {}, makeParticleSeeds(10));
        expect(points.frustumCulled).toBe(false);
    });

    test('wires every seed array into its own attribute, sized for the full particle pool', () => {
        const particle_seeds = makeParticleSeeds(40);
        const points = createImpactSmokeGeometry(makeScene(), {}, particle_seeds);
        expect(points.geometry.attributes.position.array).toHaveLength(40 * 3);
        expect(points.geometry.attributes.a_burst_index.array).toBe(particle_seeds.burst_index);
        expect(points.geometry.attributes.a_seed.array).toBe(particle_seeds.seed);
        expect(points.geometry.attributes.a_seed.itemSize).toBe(4);
        expect(points.geometry.attributes.a_phase_offset.array).toBe(particle_seeds.phase_offset);
    });
});
