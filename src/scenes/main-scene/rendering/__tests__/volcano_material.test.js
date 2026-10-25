import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, DoubleSide: 2 }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/volcano.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/volcano.frag?raw', () => ({ default: '// frag shader' }));

import { createVolcanoMaterial, updateVolcanoLight, updateVolcanoInteraction } from '../volcano_material.js';
import {
    INTERACTION_MAX_POINTS, INTERACTION_PLATEAU_FRACTION, INTERACTION_DECAY_WIPE_BAND_FRACTION,
    INTERACTION_DECAY_WIPE_NOISE_STRENGTH, INTERACTION_DECAY_WIPE_NOISE_FREQUENCY,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

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
            'u_interaction_positions',
            'u_interaction_strengths',
            'u_interaction_radii',
            'u_interaction_decay',
            'u_interaction_plateau_fraction',
            'u_interaction_wipe_band_fraction',
            'u_interaction_wipe_noise_strength',
            'u_interaction_wipe_noise_frequency',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('interaction uniform arrays have length INTERACTION_MAX_POINTS and start at zero strength', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_interaction_positions.value).toHaveLength(INTERACTION_MAX_POINTS);
        expect(material.uniforms.u_interaction_strengths.value).toHaveLength(INTERACTION_MAX_POINTS);
        expect(material.uniforms.u_interaction_radii.value).toHaveLength(INTERACTION_MAX_POINTS);
        expect(material.uniforms.u_interaction_decay.value).toHaveLength(INTERACTION_MAX_POINTS);
        expect(Array.from(material.uniforms.u_interaction_strengths.value)).toEqual(new Array(INTERACTION_MAX_POINTS).fill(0));
        expect(material.uniforms.u_interaction_plateau_fraction.value).toBe(INTERACTION_PLATEAU_FRACTION);
        expect(material.uniforms.u_interaction_wipe_band_fraction.value).toBe(INTERACTION_DECAY_WIPE_BAND_FRACTION);
        expect(material.uniforms.u_interaction_wipe_noise_strength.value).toBe(INTERACTION_DECAY_WIPE_NOISE_STRENGTH);
        expect(material.uniforms.u_interaction_wipe_noise_frequency.value).toBe(INTERACTION_DECAY_WIPE_NOISE_FREQUENCY);
    });

    test('u_displacement_scale/frequency start at the volcano defaults', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_displacement_scale.value).toBe(DEFAULT_SETTINGS.volcanoDisplacementScale);
        expect(material.uniforms.u_displacement_frequency.value).toBe(DEFAULT_SETTINGS.volcanoDisplacementFrequency);
    });

    test('u_sun_strength/focus start at the shared sun defaults', () => {
        const material = createVolcanoMaterial();
        expect(material.uniforms.u_sun_strength.value).toBe(DEFAULT_SETTINGS.sunStrength);
        expect(material.uniforms.u_sun_focus.value).toBe(DEFAULT_SETTINGS.sunFocus);
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

describe('updateVolcanoInteraction', () => {
    test('writes active touch points into the position/strength/radius/decay uniform arrays', () => {
        const material = createVolcanoMaterial();
        updateVolcanoInteraction(material, [{ x: 1, y: 2, z: 3, strength: 0.5, radius: 0.3, decay_progress: 0.2 }]);
        expect(material.uniforms.u_interaction_positions.value[0]).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(material.uniforms.u_interaction_strengths.value[0]).toBe(0.5);
        expect(material.uniforms.u_interaction_radii.value[0]).toBeCloseTo(0.3, 5);
        expect(material.uniforms.u_interaction_decay.value[0]).toBeCloseTo(0.2, 5);
    });

    test('zeroes out slots with no corresponding touch point', () => {
        const material = createVolcanoMaterial();
        material.uniforms.u_interaction_strengths.value[3] = 0.9;
        updateVolcanoInteraction(material, [{ x: 1, y: 2, z: 3, strength: 0.5, radius: 0.3, decay_progress: 0.2 }]);
        expect(material.uniforms.u_interaction_strengths.value[3]).toBe(0.0);
    });

    test('without a camera, a touch point keeps full strength regardless of position', () => {
        const material = createVolcanoMaterial();
        updateVolcanoInteraction(material, [{ x: -5, y: 0, z: 0, strength: 0.5, radius: 0.3, decay_progress: 0.2 }]);
        expect(material.uniforms.u_interaction_strengths.value[0]).toBe(0.5);
    });

    test('a touch point facing the camera keeps full strength', () => {
        const material = createVolcanoMaterial();
        const camera = { position: { x: 10, y: 0, z: 0 } }; // camera azimuth (from volcano_center) = 0
        const volcano_center = { x: 0, y: 0, z: 0 };
        updateVolcanoInteraction(material, [{ x: 5, y: 0, z: 0, strength: 0.5, radius: 0.3, decay_progress: 0.2 }], camera, volcano_center);
        expect(material.uniforms.u_interaction_strengths.value[0]).toBe(0.5);
    });

    test('a touch point on the far side of the volcano (180 deg from the camera) fades to zero strength', () => {
        const material = createVolcanoMaterial();
        const camera = { position: { x: 10, y: 0, z: 0 } };
        const volcano_center = { x: 0, y: 0, z: 0 };
        updateVolcanoInteraction(material, [{ x: -5, y: 0, z: 0, strength: 0.5, radius: 0.3, decay_progress: 0.2 }], camera, volcano_center);
        expect(material.uniforms.u_interaction_strengths.value[0]).toBe(0);
    });
});
