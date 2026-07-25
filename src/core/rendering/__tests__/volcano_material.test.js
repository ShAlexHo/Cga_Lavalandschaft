import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, DoubleSide: 2 }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/volcano.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/volcano.frag?raw', () => ({ default: '// frag shader' }));

import { createVolcanoMaterial, updateVolcanoLight } from '../volcano_material.js';
import {
    SUN_DEFAULT_STRENGTH, SUN_DEFAULT_FOCUS, VOLCANO_DEFAULT_DISPLACEMENT_SCALE, VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY,
} from '../../config.js';

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
            'u_rock_color',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_displacement_scale/frequency start at the volcano defaults', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_displacement_scale.value).toBe(VOLCANO_DEFAULT_DISPLACEMENT_SCALE);
        expect(material.uniforms.u_displacement_frequency.value).toBe(VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY);
    });

    test('u_sun_strength/focus start at the shared sun defaults', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_sun_strength.value).toBe(SUN_DEFAULT_STRENGTH);
        expect(material.uniforms.u_sun_focus.value).toBe(SUN_DEFAULT_FOCUS);
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
