import { describe, test, expect, vi } from 'vitest';
import { MockHexColor, MockShaderMaterial } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Color: MockHexColor, ShaderMaterial: MockShaderMaterial }));

vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/sun.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/sun.frag?raw', () => ({ default: '// fragment shader' }));

import { createSunMaterial, updateSunMaterial } from '../sun_material.js';
import { SUN_LIGHT_COLOR, SUN_CORE_COLOR, SUN_BLOOD_ORANGE_COLOR } from '../../config.js';

describe('createSunMaterial', () => {
    test('contains the expected uniforms', () => {
        const material = createSunMaterial();
        expect(material.uniforms).toHaveProperty('u_color_core');
        expect(material.uniforms).toHaveProperty('u_color_edge');
        expect(material.uniforms).toHaveProperty('u_color_blood_orange');
        expect(material.uniforms).toHaveProperty('u_time');
    });

    test('u_color_core/u_color_edge/u_color_blood_orange start at the configured colors, u_time starts at 0', () => {
        const material = createSunMaterial();
        expect(material.uniforms.u_color_core.value.hex).toBe(SUN_CORE_COLOR);
        expect(material.uniforms.u_color_edge.value.hex).toBe(SUN_LIGHT_COLOR);
        expect(material.uniforms.u_color_blood_orange.value.hex).toBe(SUN_BLOOD_ORANGE_COLOR);
        expect(material.uniforms.u_time.value).toBe(0.0);
    });
});

describe('updateSunMaterial', () => {
    test('sets u_time to the given time', () => {
        const material = { uniforms: { u_time: { value: 0.0 } } };
        updateSunMaterial(material, 7.25);
        expect(material.uniforms.u_time.value).toBe(7.25);
    });
});
