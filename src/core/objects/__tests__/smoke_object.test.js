import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeScene } from '../../test-utils/three_mocks.js';

vi.mock('../../geometry/smoke_geometry.js', () => ({
    createSmokeGeometry: vi.fn((scene, material) => {
        const points = { material, position: { x: 0, y: 0, z: 0 }, visible: true, geometry: { drawRange: { start: 0, count: 0 } } };
        scene.add(points);
        return points;
    }),
    setSmokeDrawRange: vi.fn((points, count) => { points.geometry.drawRange = { start: 0, count }; }),
}));

vi.mock('../../rendering/smoke_material.js', () => ({
    createSmokeMaterial: vi.fn(() => ({
        uniforms: {
            u_color_1: { value: makeColor('5c4534') },
            u_color_2: { value: makeColor('cac2b4') },
            u_color_3: { value: makeColor('d9622a') },
            u_size: { value: 22 },
            u_sun_color: { value: makeColor('ff1a1a') },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_time: { value: 0.0 },
            u_plume_opacity_factor: { value: 1.0 },
            u_spread: { value: 1.0 },
            u_rise_speed: { value: 1.0 },
            u_ember_cooling_time: { value: 2.5 },
        },
    })),
    updateSmokeMaterial: vi.fn(),
}));

vi.mock('../../animation/smoke_particles.js', () => {
    const settings = { count: 200, max_count: 400 };
    return {
        settings,
        particle_seeds: { is_ambient: new Float32Array(400) },
        computePlumeOpacityFactor: vi.fn(eruption_intensity => (eruption_intensity === undefined ? 1.0 : eruption_intensity)),
    };
});

import { createSmoke } from '../smoke_object.js';
import { createSmokeGeometry, setSmokeDrawRange } from '../../geometry/smoke_geometry.js';
import { createSmokeMaterial, updateSmokeMaterial } from '../../rendering/smoke_material.js';
import { settings as mock_settings, particle_seeds, computePlumeOpacityFactor } from '../../animation/smoke_particles.js';

const DEFAULT_SETTINGS = { count: 200, max_count: 400 };

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
});

describe('createSmoke', () => {
    test('builds the geometry with a freshly created material and the shared particle seeds', () => {
        const scene = makeScene();
        const smoke = createSmoke(scene);
        expect(createSmokeMaterial).toHaveBeenCalledTimes(1);
        expect(createSmokeGeometry).toHaveBeenCalledWith(scene, expect.any(Object), particle_seeds);
        expect(scene.add).toHaveBeenCalledWith(smoke.effect);
    });

    test('sets the initial draw range to settings.count', () => {
        const smoke = createSmoke(makeScene());
        expect(setSmokeDrawRange).toHaveBeenCalledWith(smoke.effect, 200);
    });

    test('update() forwards time and the computed plume opacity factor to the material', () => {
        const smoke = createSmoke(makeScene());
        smoke.update(2.5, 0.8);

        expect(computePlumeOpacityFactor).toHaveBeenCalledWith(0.8);
        expect(updateSmokeMaterial).toHaveBeenCalledWith(expect.any(Object), 2.5, 0.8);
    });

    test('update() defaults eruption_intensity to 1.0 (no dimming) when omitted', () => {
        const smoke = createSmoke(makeScene());
        smoke.update(2.5);
        expect(computePlumeOpacityFactor).toHaveBeenCalledWith(1.0);
    });

    test('getVisible/setVisible toggle effect.visible', () => {
        const smoke = createSmoke(makeScene());
        expect(smoke.getVisible()).toBe(true);
        smoke.setVisible(false);
        expect(smoke.getVisible()).toBe(false);
    });

    test('setCount updates settings.count and re-applies the draw range', () => {
        const smoke = createSmoke(makeScene());
        smoke.setCount(50);
        expect(smoke.getCount()).toBe(50);
        expect(mock_settings.count).toBe(50);
        expect(setSmokeDrawRange).toHaveBeenCalledWith(smoke.effect, 50);
    });

    test('spread/riseSpeed getters and setters forward to the material uniforms', () => {
        const smoke = createSmoke(makeScene());

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

    test('getEmberCoolingTime/setEmberCoolingTime forward to the material uniform', () => {
        const smoke = createSmoke(makeScene());
        expect(smoke.getEmberCoolingTime()).toBe(2.5);
        smoke.setEmberCoolingTime(1.8);
        expect(smoke.getEmberCoolingTime()).toBe(1.8);
    });

    test('getSunEnabled/setSunEnabled and getSunStrength/setSunStrength forward to the material uniforms', () => {
        const smoke = createSmoke(makeScene());

        expect(smoke.getSunEnabled()).toBe(true);
        smoke.setSunEnabled(false);
        expect(smoke.getSunEnabled()).toBe(false);

        smoke.setSunStrength(0.09);
        expect(smoke.getSunStrength()).toBe(0.09);
    });
});
