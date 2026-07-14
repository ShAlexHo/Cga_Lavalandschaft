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
vi.mock('../../shaders/ground.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/ground.frag?raw', () => ({ default: '// frag shader' }));

import { createGroundMaterial, updateGroundLight } from '../ground_material.js';
import { GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY, GROUND_DEFAULT_CRACK_SOFTNESS } from '../../config.js';

describe('createGroundMaterial', () => {
    test('contains all expected uniforms', () => {
        const material = createGroundMaterial();
        const expected_keys = ['u_light_position', 'u_disp_scale', 'u_disp_freq', 'u_crack_freq', 'u_crack_softness', 'u_rock_color', 'u_crack_color', 'u_crack_color_2'];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('displacement uniforms start at their config defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_disp_scale.value).toBe(GROUND_DEFAULT_DISPLACEMENT_SCALE);
        expect(material.uniforms.u_disp_freq.value).toBe(GROUND_DEFAULT_DISPLACEMENT_FREQUENCY);
    });

    test('u_crack_freq starts at GROUND_CRACK_FREQUENCY', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_freq.value).toBe(GROUND_CRACK_FREQUENCY);
    });

    test('u_crack_softness starts at GROUND_DEFAULT_CRACK_SOFTNESS', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_softness.value).toBe(GROUND_DEFAULT_CRACK_SOFTNESS);
    });
});

describe('updateGroundLight', () => {
    function makeMaterial() {
        return { uniforms: { u_light_position: { value: { copy: vi.fn() } } } };
    }

    const mock_camera = { matrixWorldInverse: {} };

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });
});
