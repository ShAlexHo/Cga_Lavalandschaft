import { describe, test, expect } from 'vitest';
import { toGlslFloat } from '../glsl_utils.js';

describe('toGlslFloat', () => {
    test('writes whole numbers with a decimal point, so GLSL reads them as floats', () => {
        expect(toGlslFloat(4000)).toBe('4000.0');
        expect(toGlslFloat(2)).toBe('2.0');
    });

    test('keeps every decimal of fractional values', () => {
        expect(toGlslFloat(0.6)).toBe('0.6');
        expect(toGlslFloat(0.0125)).toBe('0.0125');
    });
});
