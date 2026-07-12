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

import { createSmokeMaterial } from '../smoke_material.js';
import { SMOKE_PARTICLE_SIZE, SUN_ASH_TINT_COLOR } from '../../config.js';

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

    test('is transparent and does not write depth, so plumes blend instead of occluding each other', () => {
        const material = createSmokeMaterial();
        expect(material.transparent).toBe(true);
        expect(material.depthWrite).toBe(false);
    });
});
