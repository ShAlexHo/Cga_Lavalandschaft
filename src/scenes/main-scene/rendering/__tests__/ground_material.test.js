import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, DoubleSide: 2 }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/ground.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/ground.frag?raw', () => ({ default: '// frag shader' }));

import { createGroundMaterial, updateGroundLight } from '../ground_material.js';
import {
    GROUND_CRACK_FREQUENCY, GROUND_CRACK_DENSITY_FADE_START, GROUND_CRACK_DENSITY_FADE_END,
    GROUND_EDGE_FADE_START, GROUND_EDGE_FADE_END,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

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
            'u_crack_density_fade_start',
            'u_crack_density_fade_end',
            'u_sky_color',
            'u_edge_fade_start',
            'u_edge_fade_end',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_sun_strength/focus start at the shared sun defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_strength.value).toBe(DEFAULT_SETTINGS.sunStrength);
        expect(material.uniforms.u_sun_focus.value).toBe(DEFAULT_SETTINGS.sunFocus);
    });

    test('u_sun_enabled starts at 1.0', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_enabled.value).toBe(1.0);
    });

    test('u_time starts at 0', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_time.value).toBe(0.0);
    });

    test('displacement uniforms start at their default_settings.json values', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_displacement_scale.value).toBe(DEFAULT_SETTINGS.groundDisplacementScale);
        expect(material.uniforms.u_displacement_frequency.value).toBe(DEFAULT_SETTINGS.groundDisplacementFrequency);
    });

    test('u_crack_frequency starts at GROUND_CRACK_FREQUENCY', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_frequency.value).toBe(GROUND_CRACK_FREQUENCY);
    });

    test('u_crack_softness starts at DEFAULT_SETTINGS.groundCrackSoftness', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_softness.value).toBe(DEFAULT_SETTINGS.groundCrackSoftness);
    });

    test('u_sun_focus_radius starts at DEFAULT_SETTINGS.groundSunFocusRadius', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_sun_focus_radius.value).toBe(DEFAULT_SETTINGS.groundSunFocusRadius);
    });

    test('u_rock_variance_radius starts at DEFAULT_SETTINGS.groundRockVarianceRadius', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_rock_variance_radius.value).toBe(DEFAULT_SETTINGS.groundRockVarianceRadius);
    });

    test('u_volcano_crack_scale/frequency start at the volcano\'s own default_settings.json values', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_volcano_crack_scale.value).toBe(DEFAULT_SETTINGS.volcanoDisplacementScale);
        expect(material.uniforms.u_volcano_crack_frequency.value).toBe(DEFAULT_SETTINGS.volcanoDisplacementFrequency);
    });

    test('u_crack_density_fade_start/end start at their config defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_crack_density_fade_start.value).toBe(GROUND_CRACK_DENSITY_FADE_START);
        expect(material.uniforms.u_crack_density_fade_end.value).toBe(GROUND_CRACK_DENSITY_FADE_END);
    });

    test('u_edge_fade_start/end start at their config defaults', () => {
        const material = createGroundMaterial();
        expect(material.uniforms.u_edge_fade_start.value).toBe(GROUND_EDGE_FADE_START);
        expect(material.uniforms.u_edge_fade_end.value).toBe(GROUND_EDGE_FADE_END);
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
                u_sky_color: { value: { copy: vi.fn() } },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };
    const mock_volcano_position = {};
    const mock_sun_position = { x: 1, y: 2, z: 3 };
    const mock_sky_color = { r: 0.3, g: 0, b: 0 };

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0, mock_sky_color);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_sun_position.value using the given sun world position', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0, mock_sky_color);
        expect(material.uniforms.u_sun_position.value.copy).toHaveBeenCalled();
    });

    test('calls copy() on u_volcano_position.value with the given world position', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0, mock_sky_color);
        expect(material.uniforms.u_volcano_position.value.copy).toHaveBeenCalledWith(mock_volcano_position);
    });

    test('calls copy() on u_sky_color.value with the given sky color', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 0, mock_sky_color);
        expect(material.uniforms.u_sky_color.value.copy).toHaveBeenCalledWith(mock_sky_color);
    });

    test('sets u_time to the given time value', () => {
        const material = makeMaterial();
        updateGroundLight(material, mock_camera, mock_volcano_position, mock_sun_position, 3.14, mock_sky_color);
        expect(material.uniforms.u_time.value).toBe(3.14);
    });
});
