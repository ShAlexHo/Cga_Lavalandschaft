import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial, MockMatrix4 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, Matrix4: MockMatrix4, DoubleSide: 2, BackSide: 1, GLSL3: '300 es' }));

vi.mock('../../shaders/metaball.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/metaball.frag?raw', () => ({ default: '// frag shader' }));

import { createMetaballMaterial, updateMetaballLight } from '../metaball_material.js';
import { METABALL_GPU_MAX_BALLS, METABALL_RAYMARCH_STEPS, METABALL_RAYMARCH_NORMAL_EPSILON } from '../../config.js';

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
            'u_ball_center',
            'u_ball_strength',
            'u_ball_subtract',
            'u_isolation',
            'u_effect_position',
            'u_effect_scale',
            'u_box_half_extent',
            'u_box_center',
            'u_raymarch_steps',
            'u_normal_epsilon',
            'u_projection_matrix',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('ball uniform arrays have length METABALL_GPU_MAX_BALLS and start at zero strength', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_ball_center.value).toHaveLength(METABALL_GPU_MAX_BALLS);
        expect(material.uniforms.u_ball_strength.value).toHaveLength(METABALL_GPU_MAX_BALLS);
        expect(material.uniforms.u_ball_subtract.value).toHaveLength(METABALL_GPU_MAX_BALLS);
        expect(Array.from(material.uniforms.u_ball_strength.value)).toEqual(new Array(METABALL_GPU_MAX_BALLS).fill(0));
    });

    test('raymarch tuning uniforms start at their config defaults', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_raymarch_steps.value).toBe(METABALL_RAYMARCH_STEPS);
        expect(material.uniforms.u_normal_epsilon.value).toBe(METABALL_RAYMARCH_NORMAL_EPSILON);
    });

    test('renders back faces so the raymarcher works whether the camera is inside or outside the proxy box', () => {
        const material = createMetaballMaterial();
        expect(material.side).toBe(1); // THREE.BackSide, per the mock above
    });

    test('uses GLSL3 so the fragment shader can write gl_FragDepth', () => {
        const material = createMetaballMaterial();
        expect(material.glslVersion).toBe('300 es'); // THREE.GLSL3, per the mock above
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
                u_projection_matrix: { value: { copy: vi.fn() } },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {}, projectionMatrix: {} };

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

    test('copies the camera\'s projection matrix into u_projection_matrix (not auto-declared in fragment shaders)', () => {
        const material = makeMaterial();
        updateMetaballLight(material, mock_camera, 1.0);
        expect(material.uniforms.u_projection_matrix.value.copy).toHaveBeenCalledWith(mock_camera.projectionMatrix);
    });
});
