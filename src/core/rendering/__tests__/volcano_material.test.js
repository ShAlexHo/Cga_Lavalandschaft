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
            this.uniforms = parameters.uniforms ?? {};
            this.vertexShader = parameters.vertexShader ?? '';
            this.fragmentShader = parameters.fragmentShader ?? '';
            this.side = parameters.side ?? 0;
        }
    }

    return { Vector3, Color, ShaderMaterial, DoubleSide: 2 };
});

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/volcano.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/volcano.frag?raw', () => ({ default: '// frag shader' }));

import { createVolcanoMaterial, updateVolcanoLight } from '../volcano_material.js';

describe('createVolcanoMaterial', () => {
    test('contains all expected uniforms', () => {
        const material = createVolcanoMaterial();
        const expected_keys = [
            'u_light_position',
            'u_sun_position',
            'u_sun_color',
            'u_sun_enabled',
            'u_sun_strength',
            'u_sun_focus',
            'u_displacement_scale',
            'u_displacement_frequency',
            'u_crack_frequency',
            'u_rock_color',
            'u_crack_color',
            'u_crack_color_2',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_displacement_scale starts at 2.5', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_displacement_scale.value).toBe(2.5);
    });

    test('u_sun_strength starts at 0.06 and u_sun_focus starts at 8.0', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_sun_strength.value).toBe(0.06);
        expect(material.uniforms.u_sun_focus.value).toBe(8.0);
    });

    test('u_sun_enabled starts at 1.0', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
    });
});

describe('updateVolcanoLight', () => {
    function makeMaterial() {
        return {
            uniforms: {
                u_light_position: { value: { copy: vi.fn() } },
                u_sun_position: { value: { copy: vi.fn() } },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };
    const mock_sun_position = { x: 1, y: 2, z: 3 };

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateVolcanoLight(material, mock_camera, mock_sun_position);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_sun_position.value using the given sun world position', () => {
        const material = makeMaterial();
        updateVolcanoLight(material, mock_camera, mock_sun_position);
        expect(material.uniforms.u_sun_position.value.copy).toHaveBeenCalled();
    });
});
