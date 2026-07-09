import { describe, test, expect, vi, beforeEach } from 'vitest';

function makeColor(hex) {
    return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
}

vi.mock('../../geometry/smoke_geometry.js', () => ({
    createSmokeGeometry: vi.fn((scene, material) => {
        const points = { material, position: { x: 0, y: 0, z: 0 }, visible: true };
        scene.add(points);
        return points;
    }),
    updateSmokeGeometry: vi.fn(),
}));

vi.mock('../../rendering/smoke_material.js', () => ({
    createSmokeMaterial: vi.fn(() => ({
        uniforms: {
            u_color_1: { value: makeColor('5c4534') },
            u_color_2: { value: makeColor('cac2b4') },
            u_color_3: { value: makeColor('d9622a') },
            u_size: { value: 22 },
        },
    })),
}));

vi.mock('../../animation/smoke_animation.js', () => {
    const settings = { count: 200, spread: 1.0, rise_speed: 1.0, max_count: 400 };
    return {
        settings,
        stepSmokeAnimation: vi.fn(() => []),
    };
});

import { createSmoke } from '../smoke_object.js';
import { createSmokeGeometry, updateSmokeGeometry } from '../../geometry/smoke_geometry.js';
import { createSmokeMaterial } from '../../rendering/smoke_material.js';
import { settings as mock_settings, stepSmokeAnimation } from '../../animation/smoke_animation.js';

const DEFAULT_SETTINGS = { count: 200, spread: 1.0, rise_speed: 1.0, max_count: 400 };

function makeScene() { return { add: vi.fn() }; }

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
});

describe('createSmoke', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const smoke = createSmoke(scene);
        expect(createSmokeMaterial).toHaveBeenCalledTimes(1);
        expect(createSmokeGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(smoke.effect);
    });

    test('update() steps the animation and forwards the particles to updateSmokeGeometry', () => {
        const smoke = createSmoke(makeScene());
        const particles = [{ x: 0, y: 0, z: 0, opacity: 1 }];
        stepSmokeAnimation.mockReturnValueOnce(particles);

        smoke.update(2.5, 0.8);

        expect(stepSmokeAnimation).toHaveBeenCalledWith(2.5, 0.8);
        expect(updateSmokeGeometry).toHaveBeenCalledWith(smoke.effect, particles);
    });

    test('getVisible/setVisible toggle effect.visible', () => {
        const smoke = createSmoke(makeScene());
        expect(smoke.getVisible()).toBe(true);
        smoke.setVisible(false);
        expect(smoke.getVisible()).toBe(false);
    });

    test('count/spread/riseSpeed getters and setters forward to the animation settings', () => {
        const smoke = createSmoke(makeScene());

        smoke.setCount(50);
        expect(smoke.getCount()).toBe(50);
        expect(mock_settings.count).toBe(50);

        smoke.setSpread(2.2);
        expect(smoke.getSpread()).toBe(2.2);

        smoke.setRiseSpeed(0.5);
        expect(smoke.getRiseSpeed()).toBe(0.5);
    });

    test('getMaxCount reflects settings.max_count', () => {
        const smoke = createSmoke(makeScene());
        expect(smoke.getMaxCount()).toBe(400);
    });

    test('color and particle size getters/setters forward to the material uniforms', () => {
        const smoke = createSmoke(makeScene());

        smoke.setColor1('#123456');
        expect(smoke.getColor1()).toBe('#123456');

        smoke.setColor2('#abcdef');
        expect(smoke.getColor2()).toBe('#abcdef');

        smoke.setColor3('#fedcba');
        expect(smoke.getColor3()).toBe('#fedcba');

        smoke.setParticleSize(90);
        expect(smoke.getParticleSize()).toBe(90);
    });
});
