import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
    class BufferAttribute {
        constructor(array, item_size) {
            this.array = array;
            this.itemSize = item_size;
            this.needsUpdate = false;
        }
        setXYZ(index, x, y, z) {
            this.array[index * 3] = x;
            this.array[index * 3 + 1] = y;
            this.array[index * 3 + 2] = z;
        }
        setX(index, x) {
            this.array[index] = x;
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
        }
    }
    return { BufferAttribute, BufferGeometry, Points };
});

import { createSmokeGeometry, updateSmokeGeometry } from '../smoke_geometry.js';
import { SMOKE_MAX_PARTICLES } from '../../config.js';

function makeScene() { return { add: vi.fn() }; }

describe('createSmokeGeometry', () => {
    let mock_scene, material;
    beforeEach(() => {
        mock_scene = makeScene();
        material = {};
    });

    test('adds the points object to the scene', () => {
        const points = createSmokeGeometry(mock_scene, material);
        expect(mock_scene.add).toHaveBeenCalledWith(points);
    });

    test('uses the given material', () => {
        const points = createSmokeGeometry(mock_scene, material);
        expect(points.material).toBe(material);
    });

    test('allocates all per-particle attributes sized for the full particle pool', () => {
        const points = createSmokeGeometry(mock_scene, material);
        expect(points.geometry.attributes.position.array).toHaveLength(SMOKE_MAX_PARTICLES * 3);
        expect(points.geometry.attributes.a_opacity.array).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(points.geometry.attributes.a_color_mix.array).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(points.geometry.attributes.a_accent_mix.array).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(points.geometry.attributes.a_glow_mult.array).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(points.geometry.attributes.a_size_mult.array).toHaveLength(SMOKE_MAX_PARTICLES);
        expect(points.geometry.attributes.a_shape_seed.array).toHaveLength(SMOKE_MAX_PARTICLES);
    });
});

describe('updateSmokeGeometry', () => {
    let points;
    beforeEach(() => { points = createSmokeGeometry(makeScene(), {}); });

    function makeParticle(overrides) {
        return { x: 0, y: 0, z: 0, opacity: 1, colorMix: 0.5, accentMix: 0, glowMult: 0, sizeMult: 1, shapeSeed: 0.5, ...overrides };
    }

    test('writes each particle\'s position, opacity, color mix, accent mix, size mult and shape seed into the buffers', () => {
        const particles = [
            makeParticle({ x: 1, y: 2, z: 3, opacity: 0.5, colorMix: 0.1, accentMix: 0.2, glowMult: 0.4, sizeMult: 0.6, shapeSeed: 0.15 }),
            makeParticle({ x: 4, y: 5, z: 6, opacity: 0.25, colorMix: 0.9, accentMix: 0.8, glowMult: 1.6, sizeMult: 1.7, shapeSeed: 0.85 }),
        ];
        updateSmokeGeometry(points, particles);

        expect(Array.from(points.geometry.attributes.position.array.slice(0, 6))).toEqual([1, 2, 3, 4, 5, 6]);
        expect(Array.from(points.geometry.attributes.a_opacity.array.slice(0, 2))).toEqual([0.5, 0.25]);

        const closeToPair = (attribute_name, expected) => {
            const values = Array.from(points.geometry.attributes[attribute_name].array.slice(0, 2));
            expect(values[0]).toBeCloseTo(expected[0], 5);
            expect(values[1]).toBeCloseTo(expected[1], 5);
        };
        closeToPair('a_color_mix', [0.1, 0.9]);
        closeToPair('a_accent_mix', [0.2, 0.8]);
        closeToPair('a_glow_mult', [0.4, 1.6]);
        closeToPair('a_size_mult', [0.6, 1.7]);
        closeToPair('a_shape_seed', [0.15, 0.85]);
    });

    test('marks every attribute as needing an update', () => {
        updateSmokeGeometry(points, [makeParticle()]);
        expect(points.geometry.attributes.position.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_opacity.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_color_mix.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_accent_mix.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_glow_mult.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_size_mult.needsUpdate).toBe(true);
        expect(points.geometry.attributes.a_shape_seed.needsUpdate).toBe(true);
    });

    test('sets the draw range to the number of active particles', () => {
        updateSmokeGeometry(points, [makeParticle(), makeParticle()]);
        expect(points.geometry.drawRange).toEqual({ start: 0, count: 2 });
    });

    test('an empty particle list clears the draw range', () => {
        updateSmokeGeometry(points, []);
        expect(points.geometry.drawRange).toEqual({ start: 0, count: 0 });
    });
});
