import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MockVector3, MockRgbColor, MockShaderMaterial, MockMatrix4 } from '../../test-utils/three_mocks.js';

vi.mock('three', () => ({ Vector3: MockVector3, Color: MockRgbColor, ShaderMaterial: MockShaderMaterial, Matrix4: MockMatrix4, DoubleSide: 2, BackSide: 1, GLSL3: '300 es' }));

vi.mock('../../shaders/metaball.vert?raw', () => ({ default: 'vertex shader' }));
vi.mock('../../shaders/noise.glsl?raw', () => ({ default: 'noise glsl' }));
vi.mock('../../shaders/metaball.frag?raw', () => ({ default: 'fragment shader' }));

import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls, updateMetaballDisplacement } from '../metaball_material.js';
import {
    METABALL_GPU_MAX_BALLS, METABALL_RAYMARCH_STEPS, METABALL_RAYMARCH_NORMAL_EPSILON,
    METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE,
} from '../../config.js';

function makeEffect() {
    return {
        isolation: 80,
        radius_scale: 1,
        position: new MockVector3(1, 2, 3),
        scale: { x: 30, y: 30, z: 30 },
        material: {
            uniforms: {
                u_ball_center: { value: Array.from({ length: METABALL_GPU_MAX_BALLS }, () => new MockVector3()) },
                u_ball_strength: { value: new Array(METABALL_GPU_MAX_BALLS).fill(0) },
                u_ball_subtract: { value: new Array(METABALL_GPU_MAX_BALLS).fill(0) },
                u_ball_count: { value: 0 },
                u_isolation: { value: 0 },
                u_effect_position: { value: new MockVector3() },
                u_effect_scale: { value: 1 },
            },
        },
    };
}

describe('createMetaballMaterial', () => {
    test('sizes the ball arrays and the shader to max_balls, defaulting to the main scene’s GPU maximum', () => {
        expect(createMetaballMaterial().uniforms.u_ball_strength.value).toHaveLength(METABALL_GPU_MAX_BALLS);

        const small_material = createMetaballMaterial({ max_balls: 24 });
        expect(small_material.uniforms.u_ball_center.value).toHaveLength(24);
        expect(small_material.uniforms.u_ball_strength.value).toHaveLength(24);
    });

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
        expect(material.side).toBe(1);
    });

    test('uses GLSL3 so the fragment shader can write gl_FragDepth', () => {
        const material = createMetaballMaterial();
        expect(material.glslVersion).toBe('300 es');
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

describe('createMetaballMaterial – with a field texture', () => {
    const field_texture = {
        texture: { name: 'field' },
        minimum: new MockVector3(-1, -0.8, -1),
        size: new MockVector3(2, 0.8, 2),
        voxel_size: new MockVector3(0.01, 0.0125, 0.01),
    };

    test('without a field texture, the shader evaluates every ball directly', () => {
        expect(createMetaballMaterial().defines).not.toHaveProperty('METABALL_FIELD_TEXTURE');
        expect(createMetaballMaterial().uniforms).not.toHaveProperty('u_field_texture');
    });

    test('with a field texture, the shader samples the field from it, within the texture’s bounds', () => {
        const material = createMetaballMaterial({ field_texture });

        expect(material.defines).toHaveProperty('METABALL_FIELD_TEXTURE');
        expect(material.uniforms.u_field_texture.value).toBe(field_texture.texture);
        expect(material.uniforms.u_field_minimum.value).toBe(field_texture.minimum);
        expect(material.uniforms.u_field_size.value).toBe(field_texture.size);
        expect(material.uniforms.u_field_voxel_size.value).toBe(field_texture.voxel_size);
    });

    test('keeps the ball uniforms, which the shader still needs for exact normals', () => {
        const material = createMetaballMaterial({ field_texture });
        expect(material.uniforms.u_ball_strength.value).toHaveLength(METABALL_GPU_MAX_BALLS);
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

describe('updateMetaballBalls', () => {
    let effect;
    beforeEach(() => { effect = makeEffect(); });

    test('writes each ball\'s doubled field-space position, strength and subtract into the uniform arrays', () => {
        const balls = [
            { x: 0.1, y: 0.2, z: 0.3, strength: 0.5, subtract: 40 },
            { x: 0.4, y: 0.5, z: 0.6, strength: 0.7, subtract: 35 },
        ];
        updateMetaballBalls(effect, balls);

        const { u_ball_center, u_ball_strength, u_ball_subtract } = effect.material.uniforms;
        expect(u_ball_center.value[0].x).toBeCloseTo(-0.8, 9);
        expect(u_ball_center.value[0].y).toBeCloseTo(-0.6, 9);
        expect(u_ball_center.value[0].z).toBeCloseTo(-0.4, 9);
        expect(u_ball_center.value[1].x).toBeCloseTo(-0.2, 9);
        expect(u_ball_center.value[1].y).toBeCloseTo(0.0, 9);
        expect(u_ball_center.value[1].z).toBeCloseTo(0.2, 9);
        expect(u_ball_strength.value[0]).toBe(0.5);
        expect(u_ball_strength.value[1]).toBe(0.7);
        expect(u_ball_subtract.value[0]).toBe(40);
        expect(u_ball_subtract.value[1]).toBe(35);
    });

    test('scales uploaded strength by radius_scale squared', () => {
        effect.radius_scale = 2;
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40 }]);
        expect(effect.material.uniforms.u_ball_strength.value[0]).toBeCloseTo(0.5 * 2 ** 2, 9);
    });

    test('zeroes the strength of every slot beyond the given balls', () => {
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40 }]);
        expect(effect.material.uniforms.u_ball_strength.value[1]).toBe(0.0);
        expect(effect.material.uniforms.u_ball_strength.value[METABALL_GPU_MAX_BALLS - 1]).toBe(0.0);
    });

    test('caps writes at METABALL_GPU_MAX_BALLS when given more balls than that', () => {
        const balls = Array.from({ length: METABALL_GPU_MAX_BALLS + 10 }, (_, i) => ({
            x: 0.5, y: 0.5, z: 0.5, strength: i + 1, subtract: 30,
        }));
        expect(() => updateMetaballBalls(effect, balls)).not.toThrow();
        expect(effect.material.uniforms.u_ball_strength.value).toHaveLength(METABALL_GPU_MAX_BALLS);
        expect(effect.material.uniforms.u_ball_strength.value[METABALL_GPU_MAX_BALLS - 1]).toBe(METABALL_GPU_MAX_BALLS);
    });

    test('an empty ball list zeroes every slot\'s strength', () => {
        updateMetaballBalls(effect, []);
        expect(effect.material.uniforms.u_ball_strength.value.every(strength => strength === 0)).toBe(true);
    });

    test('tells the shader how many slots are filled, so its loops stop there', () => {
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 }, { x: 0.4, y: 0.5, z: 0.5, strength: 1, subtract: 30 }]);
        expect(effect.material.uniforms.u_ball_count.value).toBe(2);

        updateMetaballBalls(effect, Array.from({ length: METABALL_GPU_MAX_BALLS + 10 }, () => ({ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 })));
        expect(effect.material.uniforms.u_ball_count.value).toBe(METABALL_GPU_MAX_BALLS);
    });

    test('without a camera, every ball keeps full strength regardless of its angle', () => {
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40, angle: Math.PI }]);
        expect(effect.material.uniforms.u_ball_strength.value[0]).toBe(0.5);
    });

    test('a ball facing the camera keeps full strength', () => {
        effect.position = { x: 0, y: 0, z: 0 };
        const camera = { position: { x: 10, y: 0, z: 0 } };
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40, angle: 0 }], camera);
        expect(effect.material.uniforms.u_ball_strength.value[0]).toBe(0.5);
    });

    test('a ball on the far side of the crater (180 deg from the camera) fades to zero strength', () => {
        effect.position = { x: 0, y: 0, z: 0 };
        const camera = { position: { x: 10, y: 0, z: 0 } };
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 0.5, subtract: 40, angle: Math.PI }], camera);
        expect(effect.material.uniforms.u_ball_strength.value[0]).toBe(0);
    });

    test('a ball inside the fade buffer at the arc edge is partially visible', () => {
        effect.position = { x: 0, y: 0, z: 0 };
        const camera = { position: { x: 10, y: 0, z: 0 } };
        const angle_at_fade_midpoint = (130 * Math.PI) / 180;
        updateMetaballBalls(effect, [{ x: 0.5, y: 0.5, z: 0.5, strength: 1.0, subtract: 40, angle: angle_at_fade_midpoint }], camera);
        const strength = effect.material.uniforms.u_ball_strength.value[0];
        expect(strength).toBeGreaterThan(0);
        expect(strength).toBeLessThan(1.0);
    });

    test('syncs isolation and the effect\'s transform into their own uniforms', () => {
        effect.isolation = 42;
        effect.position = new MockVector3(4, 5, 6);
        effect.scale = { x: 12, y: 12, z: 12 };
        updateMetaballBalls(effect, []);

        const { u_isolation, u_effect_position, u_effect_scale } = effect.material.uniforms;
        expect(u_isolation.value).toBe(42);
        expect(u_effect_position.value).toMatchObject({ x: 4, y: 5, z: 6 });
        expect(u_effect_scale.value).toBe(12);
    });
});

describe('updateMetaballDisplacement', () => {
    function makeMaterial() {
        return { uniforms: { u_displacement: { value: 0 } } };
    }

    const volcano_position = { x: 0, y: 0, z: 0 };
    const near_camera = { position: { x: METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE - 5, y: 3, z: 0 } };
    const far_camera = { position: { x: METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE + 5, y: 3, z: 0 } };

    test('applies the given strength when enabled and within camera range', () => {
        const material = makeMaterial();
        updateMetaballDisplacement(material, { enabled: true, strength: 0.003, camera: near_camera, volcano_position });
        expect(material.uniforms.u_displacement.value).toBeCloseTo(0.003, 9);
    });

    test('drops to zero once the camera is farther than METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE', () => {
        const material = makeMaterial();
        updateMetaballDisplacement(material, { enabled: true, strength: 0.003, camera: far_camera, volcano_position });
        expect(material.uniforms.u_displacement.value).toBe(0.0);
    });

    test('drops to zero while disabled, even within camera range', () => {
        const material = makeMaterial();
        updateMetaballDisplacement(material, { enabled: false, strength: 0.003, camera: near_camera, volcano_position });
        expect(material.uniforms.u_displacement.value).toBe(0.0);
    });
});
