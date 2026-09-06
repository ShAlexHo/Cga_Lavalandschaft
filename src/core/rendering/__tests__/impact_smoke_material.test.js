import { describe, test, expect, vi } from 'vitest';
import { MockHexColor, MockShaderMaterial, MockVector3 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockHexColor, ShaderMaterial: MockShaderMaterial }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/impact_smoke.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/smoke.frag?raw', () => ({ default: '// fragment shader' }));

import { createImpactSmokeMaterial, updateImpactSmoke } from '../impact_smoke_material.js';
import {
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_PARTICLE_SIZE,
    INTERACTION_SMOKE_SPREAD_RADIUS, INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION, INTERACTION_SMOKE_RISE_SPEED,
    INTERACTION_SMOKE_PARTICLE_LIFETIME,
    INTERACTION_SMOKE_COLOR_1, INTERACTION_SMOKE_COLOR_2,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

describe('createImpactSmokeMaterial', () => {
    test('contains the expected uniforms', () => {
        const material = createImpactSmokeMaterial();
        [
            'u_size', 'u_spread_radius', 'u_initial_spread_fraction', 'u_rise_speed', 'u_particle_lifetime', 'u_burst_positions',
            'u_burst_bloom', 'u_burst_fade', 'u_burst_elapsed',
            'u_color_1', 'u_color_2', 'u_color_3', 'u_ember_glow_strength',
            'u_sun_color', 'u_sun_enabled', 'u_sun_strength',
        ].forEach(key => expect(material.uniforms).toHaveProperty(key));
    });

    test('sizes the burst uniform arrays to INTERACTION_SMOKE_MAX_BURSTS and starts fully invisible', () => {
        const material = createImpactSmokeMaterial();
        expect(material.uniforms.u_burst_positions.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(material.uniforms.u_burst_bloom.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(material.uniforms.u_burst_fade.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(Array.from(material.uniforms.u_burst_fade.value)).toEqual(new Array(INTERACTION_SMOKE_MAX_BURSTS).fill(0));
    });

    test('u_size/u_spread_radius/u_initial_spread_fraction/u_rise_speed/u_particle_lifetime start at their configured defaults', () => {
        const material = createImpactSmokeMaterial();
        expect(material.uniforms.u_size.value).toBe(INTERACTION_SMOKE_PARTICLE_SIZE);
        expect(material.uniforms.u_spread_radius.value).toBe(INTERACTION_SMOKE_SPREAD_RADIUS);
        expect(material.uniforms.u_initial_spread_fraction.value).toBe(INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION);
        expect(material.uniforms.u_rise_speed.value).toBe(INTERACTION_SMOKE_RISE_SPEED);
        expect(material.uniforms.u_particle_lifetime.value).toBe(INTERACTION_SMOKE_PARTICLE_LIFETIME);
    });

    test('uses its own white/grey palette, but the shared ember accent color', () => {
        const material = createImpactSmokeMaterial();
        expect(material.uniforms.u_color_1.value.hex).toBe(INTERACTION_SMOKE_COLOR_1);
        expect(material.uniforms.u_color_2.value.hex).toBe(INTERACTION_SMOKE_COLOR_2);
        expect(material.uniforms.u_color_3.value.hex).toBe(DEFAULT_SETTINGS.smokeColor3);
    });

    test('is transparent and does not write depth, so bursts blend instead of occluding each other', () => {
        const material = createImpactSmokeMaterial();
        expect(material.transparent).toBe(true);
        expect(material.depthWrite).toBe(false);
    });
});

describe('updateImpactSmoke', () => {
    test('writes active bursts into the position/bloom/fade/elapsed uniform arrays', () => {
        const material = createImpactSmokeMaterial();
        updateImpactSmoke(material, [{ x: 1, y: 2, z: 3, bloom: 0.7, fade: 0.4, elapsed: 2.5 }]);
        expect(material.uniforms.u_burst_positions.value[0]).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(material.uniforms.u_burst_bloom.value[0]).toBeCloseTo(0.7, 5);
        expect(material.uniforms.u_burst_fade.value[0]).toBeCloseTo(0.4, 5);
        expect(material.uniforms.u_burst_elapsed.value[0]).toBeCloseTo(2.5, 5);
    });

    test('sets slots with no corresponding burst back to fade 0 (invisible)', () => {
        const material = createImpactSmokeMaterial();
        material.uniforms.u_burst_fade.value[3] = 0.8;
        updateImpactSmoke(material, [{ x: 1, y: 2, z: 3, bloom: 0.7, fade: 0.4, elapsed: 2.5 }]);
        expect(material.uniforms.u_burst_fade.value[3]).toBe(0.0);
    });
});
