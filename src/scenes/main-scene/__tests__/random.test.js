import { describe, test, expect } from 'vitest';
import { makeSeededRandom, random } from '../random.js';

describe('makeSeededRandom', () => {
    test('same seed produces identical sequence', () => {
        const random_generator_1 = makeSeededRandom(42);
        const random_generator_2 = makeSeededRandom(42);
        for (let i = 0; i < 100; i++) {
            expect(random_generator_1()).toBe(random_generator_2());
        }
    });

    test('different seeds produce different sequences', () => {
        const random_generator_1 = makeSeededRandom(1);
        const random_generator_2 = makeSeededRandom(999);
        const sequence_1 = Array.from({ length: 20 }, () => random_generator_1());
        const sequence_2 = Array.from({ length: 20 }, () => random_generator_2());
        expect(sequence_1).not.toEqual(sequence_2);
    });

    test('output is in range [0, 1)', () => {
        const random_generator = makeSeededRandom(42);
        for (let i = 0; i < 1000; i++) {
            const value = random_generator();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    test('first value for seed 42 matches the LCG formula', () => {
        const expected_state = (Math.imul(1664525, 42) + 1013904223) >>> 0;
        const expected_value = expected_state / 4294967296;
        const random_generator = makeSeededRandom(42);
        expect(random_generator()).toBeCloseTo(expected_value, 15);
    });

    test('seed 0 is handled correctly (unsigned 32-bit)', () => {
        const random_generator = makeSeededRandom(0);
        const value = random_generator();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
    });

    test('sequence is not constant', () => {
        const random_generator = makeSeededRandom(42);
        const values = Array.from({ length: 20 }, () => random_generator());
        const unique_values = new Set(values);
        expect(unique_values.size).toBeGreaterThan(1);
    });

    test('negative seed is treated as unsigned 32-bit integer', () => {
        const random_generator_1 = makeSeededRandom(-1);
        const random_generator_2 = makeSeededRandom(0xFFFFFFFF);
        expect(random_generator_1()).toBe(random_generator_2());
    });

    test('each instance has independent state', () => {
        const random_generator_1 = makeSeededRandom(7);
        const random_generator_2 = makeSeededRandom(7);
        random_generator_1();
        random_generator_1();
        random_generator_1();
        const fourth_value = random_generator_1();
        const first_value = random_generator_2();
        expect(fourth_value).not.toBe(first_value);
    });
});

describe('random (module-level instance, seed 42)', () => {
    test('return value is within [min, max)', () => {
        for (let i = 0; i < 100; i++) {
            const value = random(5, 10);
            expect(value).toBeGreaterThanOrEqual(5);
            expect(value).toBeLessThan(10);
        }
    });

    test('works with range [0, 1)', () => {
        for (let i = 0; i < 100; i++) {
            const value = random(0, 1);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    test('returns min when min === max', () => {
        expect(random(7, 7)).toBe(7);
        expect(random(0, 0)).toBe(0);
    });

    test('works with negative range', () => {
        for (let i = 0; i < 50; i++) {
            const value = random(-10, -2);
            expect(value).toBeGreaterThanOrEqual(-10);
            expect(value).toBeLessThan(-2);
        }
    });

    test('works with floating-point bounds', () => {
        for (let i = 0; i < 50; i++) {
            const value = random(0.32, 0.68);
            expect(value).toBeGreaterThanOrEqual(0.32);
            expect(value).toBeLessThan(0.68);
        }
    });

    test('produces varying values (not constant)', () => {
        const values = Array.from({ length: 20 }, () => random(0, 1000));
        const unique_values = new Set(values);
        expect(unique_values.size).toBeGreaterThan(1);
    });
});
