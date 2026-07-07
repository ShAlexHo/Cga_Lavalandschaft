import { describe, test, expect, vi } from 'vitest';

vi.mock('three', () => {
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; this.y = y; this.z = z;
        }
        copy(other) {
            this.x = other.x; this.y = other.y; this.z = other.z;
            return this;
        }
        applyMatrix4(_matrix) {
            return this; // identity transform in tests
        }
    }

    class Color {
        constructor(r = 0, g = 0, b = 0) {
            this.r = r; this.g = g; this.b = b;
        }
    }

    class ShaderMaterial {
        constructor(parameters = {}) {
            this.uniforms       = parameters.uniforms ?? {};
            this.vertexShader   = parameters.vertexShader ?? '';
            this.fragmentShader = parameters.fragmentShader ?? '';
            this.side           = parameters.side ?? 0;
        }
    }

    return { Vector3, Color, ShaderMaterial, DoubleSide: 2 };
});

vi.mock('../../shaders/metaball.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/metaball.frag?raw', () => ({ default: '// frag shader' }));

import { createMetaballMaterial, updateMetaballLight } from '../metaball_material.js';

describe('createMetaballMaterial', () => {
    test('contains all expected uniforms', () => {
        const material = createMetaballMaterial();
        const expected_keys = [
            'u_light_position',
            'u_time',
            'u_glow_enabled',
            'u_glow_color',
            'u_color_hot',
            'u_color_cool',
            'u_noise_enabled',
            'u_noise_color_1',
            'u_noise_color_2',
            'u_bump_enabled',
            'u_displacement',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_time starts at 0', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_time.value).toBe(0.0);
    });

    test('u_glow_enabled starts enabled (1.0)', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_glow_enabled.value).toBe(1.0);
    });

    test('u_noise_enabled starts enabled (1.0)', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_noise_enabled.value).toBe(1.0);
    });

    test('u_bump_enabled starts enabled (1.0)', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_bump_enabled.value).toBe(1.0);
    });
});

describe('updateMetaballLight', () => {
    function makeMaterial() {
        return {
            uniforms: {
                u_light_position: { value: { copy: vi.fn() } },
                u_time: { value: 0 },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };

    test('sets u_time to the given time value', () => {
        const material = makeMaterial();
        updateMetaballLight(material, mock_camera, 3.14);
        expect(material.uniforms.u_time.value).toBe(3.14);
    });

    test('u_time is updated correctly across multiple calls', () => {
        const material = makeMaterial();
        updateMetaballLight(material, mock_camera, 0);
        expect(material.uniforms.u_time.value).toBe(0);

        updateMetaballLight(material, mock_camera, 99.5);
        expect(material.uniforms.u_time.value).toBe(99.5);
    });

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateMetaballLight(material, mock_camera, 1.0);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });
});
