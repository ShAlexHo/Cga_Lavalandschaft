import { describe, test, expect, vi } from 'vitest';

vi.mock('three', () => {
    class Color {
        constructor(hex = 0) { this.hex = hex; }
        getHexString() { return this.hex.toString(16).padStart(6, '0'); }
        set(value) { this.hex = value; return this; }
    }
    class ShaderMaterial {
        constructor(parameters = {}) {
            this.uniforms = parameters.uniforms ?? {};
            this.vertexShader = parameters.vertexShader ?? '';
            this.fragmentShader = parameters.fragmentShader ?? '';
            this.transparent = parameters.transparent ?? false;
            this.depthWrite = parameters.depthWrite ?? true;
        }
    }
    return { Color, ShaderMaterial };
});

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/smoke.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/smoke.frag?raw', () => ({ default: '// fragment shader' }));

import { createSmokeMaterial, updateSmokeMaterial } from '../smoke_material.js';
import {
    SMOKE_PARTICLE_SIZE, SUN_ASH_TINT_COLOR, SMOKE_DEFAULT_SPREAD, SMOKE_DEFAULT_RISE_SPEED, SMOKE_LIFETIME,
    SMOKE_CORE_SPREAD, SMOKE_RISE_HEIGHT, SMOKE_AMBIENT_RADIUS,
} from '../../config.js';

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

    test('u_size starts at SMOKE_PARTICLE_SIZE', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_size.value).toBe(SMOKE_PARTICLE_SIZE);
    });

    test('u_sun_enabled starts at 1.0 and u_sun_strength starts at 0.06', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(material.uniforms.u_sun_strength.value).toBe(0.06);
    });

    test('u_sun_color starts at the dedicated ash tint color (not the shared sun light color)', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_sun_color.value.hex).toBe(SUN_ASH_TINT_COLOR);
    });

    test('u_spread/u_rise_speed start at their configured defaults', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_spread.value).toBe(SMOKE_DEFAULT_SPREAD);
        expect(material.uniforms.u_rise_speed.value).toBe(SMOKE_DEFAULT_RISE_SPEED);
    });

    test('fixed tuning uniforms are sourced from config.js, not hardcoded twice', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_lifetime.value).toBe(SMOKE_LIFETIME);
        expect(material.uniforms.u_core_spread.value).toBe(SMOKE_CORE_SPREAD);
        expect(material.uniforms.u_rise_height.value).toBe(SMOKE_RISE_HEIGHT);
        expect(material.uniforms.u_ambient_radius.value).toBe(SMOKE_AMBIENT_RADIUS);
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
