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
    INTERACTION_SMOKE_HAZE_GROWTH_DURATION, INTERACTION_SMOKE_HAZE_MAX_OPACITY,
    INTERACTION_SMOKE_RISE_BOOST_DURATION, INTERACTION_SMOKE_MAX_RISE_BOOST, INTERACTION_SMOKE_EMBER_RADIUS_FRACTION,
    INTERACTION_SMOKE_GREY_VARIANCE_MIN,
    INTERACTION_SMOKE_COLOR_1, INTERACTION_SMOKE_COLOR_2,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

describe('createImpactSmokeMaterial', () => {
    test('contains the expected uniforms', () => {
        const material = createImpactSmokeMaterial();
        [
            'u_size', 'u_spread_radius', 'u_initial_spread_fraction', 'u_rise_speed', 'u_particle_lifetime',
            'u_haze_growth_duration', 'u_haze_max_opacity',
            'u_rise_boost_duration', 'u_max_rise_boost', 'u_ember_radius_fraction', 'u_grey_variance_min', 'u_burst_positions',
            'u_burst_bloom', 'u_burst_fade', 'u_burst_elapsed', 'u_burst_ember_strength',
            'u_color_1', 'u_color_2', 'u_color_3', 'u_ember_glow_strength',
            'u_sun_color', 'u_sun_position', 'u_sun_enabled', 'u_sun_strength',
        ].forEach(key => expect(material.uniforms).toHaveProperty(key));
    });

    test('sizes the burst uniform arrays to INTERACTION_SMOKE_MAX_BURSTS and starts fully invisible', () => {
        const material = createImpactSmokeMaterial();
        expect(material.uniforms.u_burst_positions.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(material.uniforms.u_burst_bloom.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(material.uniforms.u_burst_fade.value).toHaveLength(INTERACTION_SMOKE_MAX_BURSTS);
        expect(Array.from(material.uniforms.u_burst_fade.value)).toEqual(new Array(INTERACTION_SMOKE_MAX_BURSTS).fill(0));
    });

    test('starts u_burst_ember_strength fully at 1 (no weakening applied yet)', () => {
        const material = createImpactSmokeMaterial();
        expect(Array.from(material.uniforms.u_burst_ember_strength.value)).toEqual(new Array(INTERACTION_SMOKE_MAX_BURSTS).fill(1));
    });

    test('u_size/u_spread_radius/u_initial_spread_fraction/u_rise_speed/u_particle_lifetime/u_haze_* start at their configured defaults', () => {
        const material = createImpactSmokeMaterial();
        expect(material.uniforms.u_size.value).toBe(INTERACTION_SMOKE_PARTICLE_SIZE);
        expect(material.uniforms.u_spread_radius.value).toBe(INTERACTION_SMOKE_SPREAD_RADIUS);
        expect(material.uniforms.u_initial_spread_fraction.value).toBe(INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION);
        expect(material.uniforms.u_rise_speed.value).toBe(INTERACTION_SMOKE_RISE_SPEED);
        expect(material.uniforms.u_particle_lifetime.value).toBe(INTERACTION_SMOKE_PARTICLE_LIFETIME);
        expect(material.uniforms.u_haze_growth_duration.value).toBe(INTERACTION_SMOKE_HAZE_GROWTH_DURATION);
        expect(material.uniforms.u_haze_max_opacity.value).toBe(INTERACTION_SMOKE_HAZE_MAX_OPACITY);
        expect(material.uniforms.u_rise_boost_duration.value).toBe(INTERACTION_SMOKE_RISE_BOOST_DURATION);
        expect(material.uniforms.u_max_rise_boost.value).toBe(INTERACTION_SMOKE_MAX_RISE_BOOST);
        expect(material.uniforms.u_ember_radius_fraction.value).toBe(INTERACTION_SMOKE_EMBER_RADIUS_FRACTION);
        expect(material.uniforms.u_grey_variance_min.value).toBe(INTERACTION_SMOKE_GREY_VARIANCE_MIN);
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

    test('does not depth-test, so it always renders in front of the ground/volcano instead of being occluded by them', () => {
        const material = createImpactSmokeMaterial();
        expect(material.depthTest).toBe(false);
    });
});

describe('updateImpactSmoke', () => {
    const mock_camera = { matrixWorldInverse: {} };
    const mock_sun_position = { x: 1, y: 2, z: 3 };

    test('writes active bursts into the position/bloom/fade/elapsed/ember_strength uniform arrays', () => {
        const material = createImpactSmokeMaterial();
        updateImpactSmoke(material, mock_camera, mock_sun_position, [{ x: 1, y: 2, z: 3, bloom: 0.7, fade: 0.4, elapsed: 2.5, ember_strength: 0.49 }]);
        expect(material.uniforms.u_burst_positions.value[0]).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(material.uniforms.u_burst_bloom.value[0]).toBeCloseTo(0.7, 5);
        expect(material.uniforms.u_burst_fade.value[0]).toBeCloseTo(0.4, 5);
        expect(material.uniforms.u_burst_elapsed.value[0]).toBeCloseTo(2.5, 5);
        expect(material.uniforms.u_burst_ember_strength.value[0]).toBeCloseTo(0.49, 5);
    });

    test('sets slots with no corresponding burst back to fade 0 (invisible)', () => {
        const material = createImpactSmokeMaterial();
        material.uniforms.u_burst_fade.value[3] = 0.8;
        updateImpactSmoke(material, mock_camera, mock_sun_position, [{ x: 1, y: 2, z: 3, bloom: 0.7, fade: 0.4, elapsed: 2.5 }]);
        expect(material.uniforms.u_burst_fade.value[3]).toBe(0.0);
    });

    test('writes the sun\'s view-space position into u_sun_position', () => {
        const material = createImpactSmokeMaterial();
        updateImpactSmoke(material, mock_camera, mock_sun_position, []);
        expect(material.uniforms.u_sun_position.value).toMatchObject(mock_sun_position);
    });
});
