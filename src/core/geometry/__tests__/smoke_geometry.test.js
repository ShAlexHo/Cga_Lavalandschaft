import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    class BufferAttribute {
        constructor(array, item_size) {
            this.array = array;
            this.itemSize = item_size;
            this.needsUpdate = false;
        }
    }
    class BufferGeometry {
        constructor() {
            this.attributes = {};
            this.drawRange = { start: 0, count: Infinity };
        }
        setAttribute(name, attribute) {
            this.attributes[name] = attribute;
            return this;
        }
        setDrawRange(start, count) {
            this.drawRange = { start, count };
        }
    }
    class Points {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0, set: vi.fn() };
            this.visible = true;
            this.frustumCulled = true;
        }
    }
    return { BufferAttribute, BufferGeometry, Points };
});

import { createSmokeGeometry, setSmokeDrawRange } from '../smoke_geometry.js';

function makeScene() { return { add: vi.fn() }; }

function makeParticleSeeds(particle_count) {
    return {
        is_ambient: new Float32Array(particle_count),
        motion_seed: new Float32Array(particle_count * 4),
        timing_seed: new Float32Array(particle_count * 2),
        appearance: new Float32Array(particle_count * 3),
        accent_base: new Float32Array(particle_count),
        ember_cooling_mult: new Float32Array(particle_count),
        ambient_seed: new Float32Array(particle_count * 4),
    };
}

describe('createSmokeGeometry', () => {
    let mock_scene, material, particle_seeds;
    beforeEach(() => {
        mock_scene = makeScene();
        material = {};
        particle_seeds = makeParticleSeeds(400);
    });

    test('adds the points object to the scene', () => {
        const points = createSmokeGeometry(mock_scene, material, particle_seeds);
        expect(mock_scene.add).toHaveBeenCalledWith(points);
    });

    test('uses the given material', () => {
        const points = createSmokeGeometry(mock_scene, material, particle_seeds);
        expect(points.material).toBe(material);
    });

    test('disables frustum culling, since positions are computed on the GPU and unknown on the CPU', () => {
        const points = createSmokeGeometry(mock_scene, material, particle_seeds);
        expect(points.frustumCulled).toBe(false);
    });

    test('wires every seed array into its own attribute, sized for the full particle pool', () => {
        const points = createSmokeGeometry(mock_scene, material, particle_seeds);
        expect(points.geometry.attributes.position.array).toHaveLength(400 * 3);
        expect(points.geometry.attributes.a_is_ambient.array).toBe(particle_seeds.is_ambient);
        expect(points.geometry.attributes.a_motion_seed.array).toBe(particle_seeds.motion_seed);
        expect(points.geometry.attributes.a_motion_seed.itemSize).toBe(4);
        expect(points.geometry.attributes.a_timing_seed.array).toBe(particle_seeds.timing_seed);
        expect(points.geometry.attributes.a_timing_seed.itemSize).toBe(2);
        expect(points.geometry.attributes.a_appearance.array).toBe(particle_seeds.appearance);
        expect(points.geometry.attributes.a_appearance.itemSize).toBe(3);
        expect(points.geometry.attributes.a_accent_base.array).toBe(particle_seeds.accent_base);
        expect(points.geometry.attributes.a_ember_cooling_mult.array).toBe(particle_seeds.ember_cooling_mult);
        expect(points.geometry.attributes.a_ambient_seed.array).toBe(particle_seeds.ambient_seed);
        expect(points.geometry.attributes.a_ambient_seed.itemSize).toBe(4);
    });
});

describe('setSmokeDrawRange', () => {
    test('sets the draw range to the given count', () => {
        const points = createSmokeGeometry(makeScene(), {}, makeParticleSeeds(10));
        setSmokeDrawRange(points, 7);
        expect(points.geometry.drawRange).toEqual({ start: 0, count: 7 });
    });
});
