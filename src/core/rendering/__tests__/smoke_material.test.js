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
import { SMOKE_PARTICLE_SIZE } from '../../config.js';

describe('createSmokeMaterial', () => {
    test('contains the expected uniforms', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms).toHaveProperty('u_color_1');
        expect(material.uniforms).toHaveProperty('u_color_2');
        expect(material.uniforms).toHaveProperty('u_color_3');
        expect(material.uniforms).toHaveProperty('u_size');
    });

    test('u_size starts at SMOKE_PARTICLE_SIZE', () => {
        const material = createSmokeMaterial();
        expect(material.uniforms.u_size.value).toBe(SMOKE_PARTICLE_SIZE);
    });

    test('is transparent and does not write depth, so plumes blend instead of occluding each other', () => {
        const material = createSmokeMaterial();
        expect(material.transparent).toBe(true);
        expect(material.depthWrite).toBe(false);
    });
});
