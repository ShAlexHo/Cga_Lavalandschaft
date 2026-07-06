import { describe, test, expect } from 'vitest';
import { make_seeded_rand, rand, rand3 } from '../rand.js';

// ─── make_seeded_rand ────────────────────────────────────────────────────────

describe('make_seeded_rand', () => {
    test('same seed produces identical sequence', () => {
        const rng1 = make_seeded_rand(42);
        const rng2 = make_seeded_rand(42);
        for (let i = 0; i < 100; i++) {
            expect(rng1()).toBe(rng2());
        }
    });

    test('different seeds produce different sequences', () => {
        const rng1 = make_seeded_rand(1);
        const rng2 = make_seeded_rand(999);
        const seq1 = Array.from({ length: 20 }, () => rng1());
        const seq2 = Array.from({ length: 20 }, () => rng2());
        expect(seq1).not.toEqual(seq2);
    });

    test('output is in range [0, 1)', () => {
        const rng = make_seeded_rand(42);
        for (let i = 0; i < 1000; i++) {
            const v = rng();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });

    test('first value for seed 42 matches the LCG formula', () => {
        // LCG: state = (1664525 * seed + 1013904223) >>> 0
        const expected_state = (Math.imul(1664525, 42) + 1013904223) >>> 0;
        const expected = expected_state / 4294967296;
        const rng = make_seeded_rand(42);
        expect(rng()).toBeCloseTo(expected, 15);
    });

    test('seed 0 is handled correctly (unsigned 32-bit)', () => {
        const rng = make_seeded_rand(0);
        const v = rng();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
    });

    test('sequence is not constant', () => {
        const rng = make_seeded_rand(42);
        const values = Array.from({ length: 20 }, () => rng());
        const unique = new Set(values);
        expect(unique.size).toBeGreaterThan(1);
    });

    test('negative seed is treated as unsigned 32-bit integer', () => {
        const rng1 = make_seeded_rand(-1);
        const rng2 = make_seeded_rand(0xFFFFFFFF);
        expect(rng1()).toBe(rng2());
    });

    test('each instance has independent state', () => {
        const rng1 = make_seeded_rand(7);
        const rng2 = make_seeded_rand(7);
        rng1(); rng1(); rng1(); // advance rng1 three steps
        const rng1_fourth = rng1();
        const rng2_first  = rng2();
        expect(rng1_fourth).not.toBe(rng2_first);
    });
});

// ─── rand ────────────────────────────────────────────────────────────────────

describe('rand (module-level instance, seed 42)', () => {
    test('return value is within [min, max)', () => {
        for (let i = 0; i < 100; i++) {
            const v = rand(5, 10);
            expect(v).toBeGreaterThanOrEqual(5);
            expect(v).toBeLessThan(10);
        }
    });

    test('works with range [0, 1)', () => {
        for (let i = 0; i < 100; i++) {
            const v = rand(0, 1);
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });

    test('returns min when min === max', () => {
        expect(rand(7, 7)).toBe(7);
        expect(rand(0, 0)).toBe(0);
    });

    test('works with negative range', () => {
        for (let i = 0; i < 50; i++) {
            const v = rand(-10, -2);
            expect(v).toBeGreaterThanOrEqual(-10);
            expect(v).toBeLessThan(-2);
        }
    });

    test('works with floating-point bounds', () => {
        for (let i = 0; i < 50; i++) {
            const v = rand(0.32, 0.68);
            expect(v).toBeGreaterThanOrEqual(0.32);
            expect(v).toBeLessThan(0.68);
        }
    });

    test('produces varying values (not constant)', () => {
        const values = Array.from({ length: 20 }, () => rand(0, 1000));
        const unique = new Set(values);
        expect(unique.size).toBeGreaterThan(1);
    });
});

// ─── rand3 ───────────────────────────────────────────────────────────────────

describe('rand3', () => {
    test('returns an array of exactly 3 elements', () => {
        const result = rand3(0, 1);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
    });

    test('all elements are numbers', () => {
        const result = rand3(0, 1);
        result.forEach(v => expect(typeof v).toBe('number'));
    });

    test('all elements are within the specified range', () => {
        for (let i = 0; i < 30; i++) {
            const result = rand3(2, 9);
            result.forEach(v => {
                expect(v).toBeGreaterThanOrEqual(2);
                expect(v).toBeLessThan(9);
            });
        }
    });

    test('elements are generated independently', () => {
        // Over 30 calls, the three components should not always be identical
        const results = Array.from({ length: 30 }, () => rand3(0, 100));
        const allSame = results.every(([a, b, c]) => a === b && b === c);
        expect(allSame).toBe(false);
    });

    test('min === max returns array of three equal values', () => {
        const result = rand3(5, 5);
        expect(result).toEqual([5, 5, 5]);
    });

    test('works with negative range', () => {
        for (let i = 0; i < 20; i++) {
            const result = rand3(-5, -1);
            result.forEach(v => {
                expect(v).toBeGreaterThanOrEqual(-5);
                expect(v).toBeLessThan(-1);
            });
        }
    });
});
