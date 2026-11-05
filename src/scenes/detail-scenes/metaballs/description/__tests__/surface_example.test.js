import { describe, test, expect } from 'vitest';
import { surfaceProfile } from '../surface_example.js';

describe('surface example', () => {
    test('the surface spans the requested range and is normalised to its peak', () => {
        const { surface } = surfaceProfile(6, 40, 13);
        expect(surface).toHaveLength(241);
        expect(surface.at(-1).x).toBeCloseTo(6);
        expect(Math.max(...surface.map(({ height }) => Math.abs(height)))).toBeCloseTo(1);
    });

    test('the normals are spread evenly and their slope matches the surface', () => {
        const { surface, normals } = surfaceProfile(6, 40, 13);
        expect(normals).toHaveLength(13);
        for (const [i, normal] of normals.entries()) {
            expect(normal.x).toBeCloseTo((i + 0.5) * 6 / 13);
            const right = surface.find(({ x }) => x > normal.x);
            const left = surface[surface.indexOf(right) - 1];
            expect(normal.slope).toBeCloseTo((right.height - left.height) / (right.x - left.x), 0);
        }
    });
});
