import { describe, test, expect, vi } from 'vitest';
import { MockHexColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Color: MockHexColor, ShaderMaterial: MockShaderMaterial }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/smoke.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/smoke.frag?raw', () => ({ default: '// fragment shader' }));

import { createSmokeMaterial, updateSmokeMaterial } from '../smoke_material.js';
import {
    SUN_ASH_TINT_COLOR, SMOKE_LIFETIME, SMOKE_CORE_SPREAD, SMOKE_RISE_HEIGHT, SMOKE_AMBIENT_RADIUS,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

describe('createSmokeMaterial', () => {
    test('contains the expected uniforms', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms).toHaveProperty('u_color_1');
        expect(material.uniforms).toHaveProperty('u_color_2');
        expect(material.uniforms).toHaveProperty('u_color_3');
        expect(material.uniforms).toHaveProperty('u_size');
        expect(material.uniforms).toHaveProperty('u_sun_color');
        expect(material.uniforms).toHaveProperty('u_sun_enabled');
        expect(material.uniforms).toHaveProperty('u_sun_strength');
        expect(material.uniforms).toHaveProperty('u_time');
        expect(material.uniforms).toHaveProperty('u_plume_opacity_factor');
        expect(material.uniforms).toHaveProperty('u_spread');
        expect(material.uniforms).toHaveProperty('u_rise_speed');
        expect(material.uniforms).toHaveProperty('u_lifetime');
        expect(material.uniforms).toHaveProperty('u_core_spread');
        expect(material.uniforms).toHaveProperty('u_rise_height');
        expect(material.uniforms).toHaveProperty('u_ambient_radius');
    });

    test('u_size starts at DEFAULT_SETTINGS.smokeParticleSize', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_size.value).toBe(DEFAULT_SETTINGS.smokeParticleSize);
    });

    test('u_sun_enabled starts at 1.0 and u_sun_strength starts at the shared sun default', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(material.uniforms.u_sun_strength.value).toBe(DEFAULT_SETTINGS.sunStrength);
    });

    test('u_sun_color starts at the dedicated ash tint color (not the shared sun light color)', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_sun_color.value.hex).toBe(SUN_ASH_TINT_COLOR);
    });

    test('u_spread/u_rise_speed start at their configured defaults', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_spread.value).toBe(DEFAULT_SETTINGS.smokeSpread);
        expect(material.uniforms.u_rise_speed.value).toBe(DEFAULT_SETTINGS.smokeRiseSpeed);
    });

    test('fixed tuning uniforms are sourced from config.js, not hardcoded twice', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_lifetime.value).toBe(SMOKE_LIFETIME);
        expect(material.uniforms.u_core_spread.value).toBe(SMOKE_CORE_SPREAD);
        expect(material.uniforms.u_rise_height.value).toBe(SMOKE_RISE_HEIGHT);
        expect(material.uniforms.u_ambient_radius.value).toBe(SMOKE_AMBIENT_RADIUS);
    });

    test('u_ember_cooling_time starts at DEFAULT_SETTINGS.smokeEmberCoolingTime', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_ember_cooling_time.value).toBe(DEFAULT_SETTINGS.smokeEmberCoolingTime);
    });

    test('u_time and u_plume_opacity_factor start at 0.0/1.0 (no time elapsed, no dimming)', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_time.value).toBe(0.0);
        expect(material.uniforms.u_plume_opacity_factor.value).toBe(1.0);
    });

    test('is transparent and does not write depth, so plumes blend instead of occluding each other', () => {
        const material = createSmokeMaterial();
        expect(material.transparent).toBe(true);
        expect(material.depthWrite).toBe(false);
    });
});

describe('updateSmokeMaterial', () => {
    test('writes time and the plume opacity factor into their uniforms', () => {
        const material = createSmokeMaterial();
        updateSmokeMaterial(material, 12.5, 0.42);
        expect(material.uniforms.u_time.value).toBe(12.5);
        expect(material.uniforms.u_plume_opacity_factor.value).toBe(0.42);
    });
});
