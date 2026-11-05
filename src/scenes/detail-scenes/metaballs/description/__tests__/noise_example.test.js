import { describe, test, expect } from 'vitest';
import { gradientNoise, octaveNoise, fractalNoise, noiseCurves, OCTAVE_COUNT, LACUNARITY, GAIN } from '../noise_example.js';

describe('noise example', () => {
    test('gradient noise is deterministic, zero at the grid points and stays roughly within −1 and 1', () => {
        for (let x = 0; x <= 8; x += 0.05) {
            expect(gradientNoise(x)).toBe(gradientNoise(x));
            expect(Math.abs(gradientNoise(x))).toBeLessThanOrEqual(1);
        }
        for (let lattice_index = 0; lattice_index <= 8; lattice_index++) expect(gradientNoise(lattice_index)).toBeCloseTo(0, 12);
    });

    test('gradient noise is continuous, unlike the independent random values', () => {
        const { white, octaves } = noiseCurves(8, 40);
        const largestStep = points => Math.max(...points.slice(1).map((point, i) => Math.abs(point.y - points[i].y)));
        expect(largestStep(octaves[0])).toBeLessThan(0.15);
        expect(largestStep(white)).toBeGreaterThan(0.5);
    });

    test('the fBm adds the octaves with the shader’s frequency and amplitude factors', () => {
        const x = 1.37;
        let expected = 0;
        for (let octave = 0; octave < OCTAVE_COUNT; octave++) expected += GAIN ** (octave + 1) * gradientNoise(LACUNARITY ** octave * x);
        expect(fractalNoise(x)).toBeCloseTo(expected, 12);
        expect(octaveNoise(x, 2)).toBeCloseTo(GAIN ** 3 * gradientNoise(LACUNARITY ** 2 * x), 12);
    });

    test('there is one curve per octave, and together they add up to the noise', () => {
        const { octaves, fractal } = noiseCurves(8, 40);
        expect(octaves).toHaveLength(OCTAVE_COUNT);
        fractal.forEach((point, i) => expect(octaves.reduce((sum, octave) => sum + octave[i].y, 0)).toBeCloseTo(point.y, 12));
    });

    test('all curves span the same range of x', () => {
        const { white, octaves, fractal } = noiseCurves(8, 40);
        for (const points of [white, ...octaves, fractal]) {
            expect(points[0].x).toBe(0);
            expect(points.at(-1).x).toBe(8);
        }
    });
});
