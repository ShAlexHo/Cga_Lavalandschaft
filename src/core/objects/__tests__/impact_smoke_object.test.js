import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeScene } from '../../test-utils/three_mocks.js';

vi.mock('../../geometry/impact_smoke_geometry.js', () => ({
    createImpactSmokeGeometry: vi.fn((scene, material) => {
        const mesh = { material, position: { x: 0, y: 0, z: 0 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
}));

vi.mock('../../rendering/impact_smoke_material.js', () => ({
    createImpactSmokeMaterial: vi.fn(() => ({
        uniforms: {
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
        },
    })),
    updateImpactSmoke: vi.fn(),
}));

import { createImpactSmoke } from '../impact_smoke_object.js';
import { createImpactSmokeGeometry } from '../../geometry/impact_smoke_geometry.js';
import { createImpactSmokeMaterial, updateImpactSmoke } from '../../rendering/impact_smoke_material.js';

beforeEach(() => vi.clearAllMocks());

describe('createImpactSmoke', () => {
    test('builds the geometry with a freshly created material', () => {
        const scene = makeScene();
        const impact_smoke = createImpactSmoke(scene);
        expect(createImpactSmokeMaterial).toHaveBeenCalledTimes(1);
        expect(createImpactSmokeGeometry).toHaveBeenCalledWith(scene, expect.any(Object));
        expect(scene.add).toHaveBeenCalledWith(impact_smoke.mesh);
    });

    test('update() forwards the bursts to the material', () => {
        const impact_smoke = createImpactSmoke(makeScene());
        const bursts = [{ x: 1, y: 2, z: 3, bloom: 0.7, fade: 0.4, elapsed: 2.5 }];
        impact_smoke.update(bursts);
        expect(updateImpactSmoke).toHaveBeenCalledWith(expect.any(Object), bursts);
    });

    test('getVisible/setVisible toggle mesh.visible', () => {
        const impact_smoke = createImpactSmoke(makeScene());
        expect(impact_smoke.getVisible()).toBe(true);
        impact_smoke.setVisible(false);
        expect(impact_smoke.getVisible()).toBe(false);
    });

    test('getSunEnabled/setSunEnabled and getSunStrength/setSunStrength forward to the material uniforms', () => {
        const impact_smoke = createImpactSmoke(makeScene());
        expect(impact_smoke.getSunEnabled()).toBe(true);
        impact_smoke.setSunEnabled(false);
        expect(impact_smoke.getSunEnabled()).toBe(false);

        impact_smoke.setSunStrength(0.09);
        expect(impact_smoke.getSunStrength()).toBe(0.09);
    });
});
