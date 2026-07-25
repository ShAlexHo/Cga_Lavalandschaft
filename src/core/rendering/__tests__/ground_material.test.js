import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, DoubleSide: 2 }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/ground.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/ground.frag?raw', () => ({ default: '// frag shader' }));

import { createGroundMaterial, updateGroundLight } from '../ground_material.js';
import {
    GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY, GROUND_DEFAULT_CRACK_SOFTNESS,
    SUN_DEFAULT_STRENGTH, SUN_DEFAULT_FOCUS,
} from '../../config.js';

describe('createGroundMaterial', () => {
    test('contains all expected uniforms', () => {
        const material = createGroundMaterial();
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
            'u_crack_softness',
            'u_rock_color',
            'u_crack_color',
            'u_crack_color_2',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_sun_strength/focus start at the shared sun defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_strength.value).toBe(SUN_DEFAULT_STRENGTH);
        expect(material.uniforms.u_sun_focus.value).toBe(SUN_DEFAULT_FOCUS);
    });

    test('u_sun_enabled starts at 1.0', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
    });

    test('displacement uniforms start at their config defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_displacement_scale.value).toBe(GROUND_DEFAULT_DISPLACEMENT_SCALE);
        expect(material.uniforms.u_displacement_frequency.value).toBe(GROUND_DEFAULT_DISPLACEMENT_FREQUENCY);
    });

    test('u_crack_frequency starts at GROUND_CRACK_FREQUENCY', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_frequency.value).toBe(GROUND_CRACK_FREQUENCY);
    });

    test('u_crack_softness starts at GROUND_DEFAULT_CRACK_SOFTNESS', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_softness.value).toBe(GROUND_DEFAULT_CRACK_SOFTNESS);
    });
});

describe('updateGroundLight', () => {
    function makeMaterial() {
        return {
            uniforms: {
                u_light_position: { value: { copy: vi.fn() } },
                u_sun_position: { value: { copy: vi.fn() } },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_sun_position.value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera);
        expect(material.uniforms.u_sun_position.value.copy).toHaveBeenCalled();
    });
});
