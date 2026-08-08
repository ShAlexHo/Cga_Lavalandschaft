import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, DoubleSide: 2 }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/ground.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/ground.frag?raw', () => ({ default: '// frag shader' }));

import { createGroundMaterial, updateGroundLight } from '../ground_material.js';
import {
    GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY, GROUND_DEFAULT_CRACK_SOFTNESS,
    GROUND_DEFAULT_SUN_FOCUS_RADIUS, GROUND_DEFAULT_ROCK_VARIANCE_RADIUS, SUN_DEFAULT_STRENGTH, SUN_DEFAULT_FOCUS, VOLCANO_DEFAULT_DISPLACEMENT_SCALE, VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY,
} from '../../config.js';

describe('createGroundMaterial', () => {
    test('contains all expected uniforms', () => {
        const material = createGroundMaterial();
        const expected_keys = [
            'u_time',
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
            'u_rock_color_2',
            'u_rock_color_3',
            'u_rock_color_4',
            'u_crack_color',
            'u_crack_color_2',
            'u_crack_color_3',
            'u_crack_color_4',
            'u_volcano_position',
            'u_proximity_color',
            'u_proximity_noise_color',
            'u_proximity_radius',
            'u_sun_focus_radius',
            'u_rock_variance_radius',
            'u_volcano_crack_scale',
            'u_volcano_crack_frequency',
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

    test('u_time starts at 0', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_time.value).toBe(0.0);
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

    test('u_sun_focus_radius starts at GROUND_DEFAULT_SUN_FOCUS_RADIUS', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_focus_radius.value).toBe(GROUND_DEFAULT_SUN_FOCUS_RADIUS);
    });

    test('u_rock_variance_radius starts at GROUND_DEFAULT_ROCK_VARIANCE_RADIUS', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_rock_variance_radius.value).toBe(GROUND_DEFAULT_ROCK_VARIANCE_RADIUS);
    });

    test('u_volcano_crack_scale/frequency start at the volcano\'s own config defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_volcano_crack_scale.value).toBe(VOLCANO_DEFAULT_DISPLACEMENT_SCALE);
        expect(material.uniforms.u_volcano_crack_frequency.value).toBe(VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY);
    });
});

describe('updateGroundLight', () => {
    function makeMaterial() {
        return {
            uniforms: {
                u_time: { value: 0 },
                u_light_position: { value: { copy: vi.fn() } },
                u_sun_position: { value: { copy: vi.fn() } },
                u_volcano_position: { value: { copy: vi.fn() } },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };
    const mock_volcano_position = {};
    const mock_sun_position = { x: 1, y: 2, z: 3 };

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_sun_position.value using the given sun world position', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0);
        expect(material.uniforms.u_sun_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_volcano_position.value with the given world position', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0);
        expect(material.uniforms.u_volcano_position.value.copy).toHaveBeenCalledWith(mock_volcano_position);
    });

    test('sets u_time to the given time value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 3.14);
        expect(material.uniforms.u_time.value).toBe(3.14);
    });
});
