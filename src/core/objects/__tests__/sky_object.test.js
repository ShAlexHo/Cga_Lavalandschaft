import { describe, test, expect } from 'vitest';
import { createSky } from '../sky_object.js';

function makeColor(hex) {
    return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
}

function makeScene(hex) { return { background: makeColor(hex) }; }

describe('createSky', () => {
    test('getColor reads the scene background as a hex string', () => {
        const sky = createSky(makeScene('510000'));
        expect(sky.getColor()).toBe('#510000');
    });

    test('setColor writes through to the scene background', () => {
        const sky = createSky(makeScene('510000'));
        sky.setColor('#abcabc');
        expect(sky.getColor()).toBe('#abcabc');
    });
});
