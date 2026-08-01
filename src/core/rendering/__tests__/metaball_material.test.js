import { describe, test, expect, vi } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial, MockMatrix4 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({
    Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, Matrix4: MockMatrix4,
    DoubleSide: 2, GLSL3: 'GLSL3',
}));

vi.mock('../../shaders/metaball.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../../shaders/metaball.frag?raw', () => ({ default: '// frag shader' }));

import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls } from '../metaball_material.js';
import { METABALL_RAYMARCH_BALL_CAP, METABALL_DEFAULT_ISOLATION } from '../../config.js';

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
            'u_isolation',
            'u_inverse_model_matrix',
            'u_ball_count',
            'u_ball_position',
            'u_ball_strength',
            'u_ball_subtract',
            'u_ball_radius2',
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

    test('u_isolation starts at METABALL_DEFAULT_ISOLATION', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_isolation.value).toBe(METABALL_DEFAULT_ISOLATION);
    });

    test('u_ball_count starts at 0 and ball arrays are sized to METABALL_RAYMARCH_BALL_CAP', () => {
        const material = createMetaballMaterial();
        expect(material.uniforms.u_ball_count.value).toBe(0);
        expect(material.uniforms.u_ball_position.value.length).toBe(METABALL_RAYMARCH_BALL_CAP * 3);
        expect(material.uniforms.u_ball_strength.value.length).toBe(METABALL_RAYMARCH_BALL_CAP);
        expect(material.uniforms.u_ball_subtract.value.length).toBe(METABALL_RAYMARCH_BALL_CAP);
        expect(material.uniforms.u_ball_radius2.value.length).toBe(METABALL_RAYMARCH_BALL_CAP);
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

describe('updateMetaballBalls', () => {
    function makeMesh() {
        return { matrixWorld: {} };
    }

    test('writes ball count and remaps ball position/strength into the uniform arrays, nearest-camera-first', () => {
        const material = createMetaballMaterial();
        const mesh = makeMesh();
        const camera = { position: { x: 0, y: 0, z: 0 } };
        // Field-space (0.1, 0.2, 0.3) is closer to the camera at the origin than (0.5, 0.5, 0.5)
        // (distance-squared 0.14 vs 0.75), so it should rank first.
        const near_ball = { x: 0.1, y: 0.2, z: 0.3, strength: 0.5, subtract: 40 };
        const far_ball = { x: 0.5, y: 0.5, z: 0.5, strength: 1.0, subtract: 30 };

        updateMetaballBalls(material, mesh, [far_ball, near_ball], camera);

        expect(material.uniforms.u_ball_count.value).toBe(2);
        const position_array = material.uniforms.u_ball_position.value;
        const strength_array = material.uniforms.u_ball_strength.value;
        const subtract_array = material.uniforms.u_ball_subtract.value;
        const radius2_array = material.uniforms.u_ball_radius2.value;

        // near_ball's field-space (0.1, 0.2, 0.3) remapped to local space via x*2-1
        // (Float32Array-precision, hence toBeCloseTo rather than exact equality)
        expect(position_array[0]).toBeCloseTo(-0.8, 5);
        expect(position_array[1]).toBeCloseTo(-0.6, 5);
        expect(position_array[2]).toBeCloseTo(-0.4, 5);
        expect(strength_array[0]).toBeCloseTo(0.5 * 4.0, 5);
        expect(subtract_array[0]).toBe(40);
        expect(radius2_array[0]).toBeCloseTo((0.5 * 4.0) / 40, 5);

        // far_ball's field-space (0.5, 0.5, 0.5) remapped to local space (0, 0, 0)
        expect(position_array[3]).toBeCloseTo(0, 5);
        expect(position_array[4]).toBeCloseTo(0, 5);
        expect(position_array[5]).toBeCloseTo(0, 5);
        expect(strength_array[1]).toBeCloseTo(1.0 * 4.0, 5);
        expect(subtract_array[1]).toBe(30);
        expect(radius2_array[1]).toBeCloseTo((1.0 * 4.0) / 30, 5);
    });

    test('caps the uploaded ball count at METABALL_RAYMARCH_BALL_CAP', () => {
        const material = createMetaballMaterial();
        const mesh = makeMesh();
        const camera = { position: { x: 0, y: 0, z: 0 } };
        const balls = Array.from({ length: METABALL_RAYMARCH_BALL_CAP + 10 }, (_, i) => (
            { x: 0.5, y: 0.5, z: 0.5, strength: 1.0, subtract: 30 + i }
        ));

        updateMetaballBalls(material, mesh, balls, camera);

        expect(material.uniforms.u_ball_count.value).toBe(METABALL_RAYMARCH_BALL_CAP);
    });

    test('ranks balls by distance to the camera, keeping the nearest when over the cap', () => {
        const material = createMetaballMaterial();
        const mesh = makeMesh();
        const camera = { position: { x: 0, y: 0, z: 0 } };
        const near_ball = { x: 0.5, y: 0.5, z: 0.5, strength: 1.0, subtract: 111 };
        const far_ball = { x: 5.0, y: 5.0, z: 5.0, strength: 1.0, subtract: 222 };

        updateMetaballBalls(material, mesh, [far_ball, near_ball], camera);

        expect(material.uniforms.u_ball_subtract.value[0]).toBe(111);
    });

    test('sets u_inverse_model_matrix from the mesh world matrix', () => {
        const material = createMetaballMaterial();
        const mesh = makeMesh();
        const copy_spy = vi.spyOn(material.uniforms.u_inverse_model_matrix.value, 'copy');
        updateMetaballBalls(material, mesh, [], { position: { x: 0, y: 0, z: 0 } });
        expect(copy_spy).toHaveBeenCalled();
    });
});
