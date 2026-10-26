import { describe, test, expect, vi } from 'vitest';
import * as THREE from 'three';

vi.mock('../../shaders/metaball_field_splat.vert?raw', () => ({ default: 'splat vertex shader' }));
vi.mock('../../shaders/metaball_field_splat.frag?raw', () => ({ default: 'splat fragment shader' }));

import { createMetaballFieldTexture } from '../metaball_field_texture.js';
import {
    METABALL_FIELD_TEXTURE_SIZE,
    METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_Y,
} from '../../config.js';

function makeBallUniforms(balls) {
    return {
        u_ball_center: { value: balls.map(ball => new THREE.Vector3(...ball.center)) },
        u_ball_strength: { value: new Float32Array(balls.map(ball => ball.strength)) },
        u_ball_subtract: { value: new Float32Array(balls.map(ball => ball.subtract)) },
        u_ball_count: { value: balls.length },
    };
}

function makeRenderer() {
    const layer_heights = [];
    const renderer = {
        autoClear: true,
        getRenderTarget: vi.fn(() => 'previous target'),
        getClearAlpha: vi.fn(() => 1),
        getClearColor: vi.fn(color => color.set(0x123456)),
        setClearColor: vi.fn(),
        setRenderTarget: vi.fn(),
        clear: vi.fn(),
        render: vi.fn(splat_scene => {
            layer_heights.push(splat_scene.children[0].material.uniforms.u_layer_y.value);
            expect(renderer.autoClear).toBe(false);
        }),
    };
    return { renderer, layer_heights };
}

describe('createMetaballFieldTexture', () => {
    test('stores the field as half-float values in one red channel, filtered linearly', () => {
        const { texture } = createMetaballFieldTexture({ max_balls: 4 });

        expect(texture.type).toBe(THREE.HalfFloatType);
        expect(texture.format).toBe(THREE.RedFormat);
        expect(texture.minFilter).toBe(THREE.LinearFilter);
        expect(texture.magFilter).toBe(THREE.LinearFilter);
        expect(texture.image).toMatchObject({
            width: METABALL_FIELD_TEXTURE_SIZE.x, height: METABALL_FIELD_TEXTURE_SIZE.z, depth: METABALL_FIELD_TEXTURE_SIZE.y,
        });
    });

    test('covers exactly the raymarch proxy box, with the vertical axis as texture layers', () => {
        const { minimum, size, voxel_size } = createMetaballFieldTexture({ max_balls: 4 });

        expect(size).toMatchObject({ x: 2 * METABALL_PROXY_HALF_EXTENT_X, y: 2 * METABALL_PROXY_HALF_EXTENT_Y, z: 2 * METABALL_PROXY_HALF_EXTENT_Z });
        expect(minimum.y).toBeCloseTo(METABALL_PROXY_CENTER_Y - METABALL_PROXY_HALF_EXTENT_Y, 9);
        expect(voxel_size.y).toBeCloseTo(size.y / METABALL_FIELD_TEXTURE_SIZE.y, 9);
    });

    test('render() splats every filled ball slot as one instance, with its centre, strength and cutoff', () => {
        const field_texture = createMetaballFieldTexture({ max_balls: 4 });
        const { renderer } = makeRenderer();
        field_texture.render(renderer, makeBallUniforms([
            { center: [0.1, -0.4, 0.2], strength: 0.08, subtract: 35 },
            { center: [-0.3, -0.2, 0.5], strength: 0.05, subtract: 30 },
        ]));

        const geometry = renderer.render.mock.calls[0][0].children[0].geometry;
        expect(geometry.instanceCount).toBe(2);
        expect(Array.from(geometry.attributes.ball_center_strength.array.slice(0, 8))).toEqual(
            [0.1, -0.4, 0.2, 0.08, -0.3, -0.2, 0.5, 0.05].map(value => Math.fround(value)),
        );
        expect(Array.from(geometry.attributes.ball_subtract.array.slice(0, 2))).toEqual([35, 30]);
    });

    test('render() fills every layer once, cleared first, at the height of the layer’s centre', () => {
        const field_texture = createMetaballFieldTexture({ max_balls: 1 });
        const { renderer, layer_heights } = makeRenderer();
        field_texture.render(renderer, makeBallUniforms([{ center: [0, -0.4, 0], strength: 0.08, subtract: 35 }]));

        const layer_count = METABALL_FIELD_TEXTURE_SIZE.y;
        const layers = renderer.setRenderTarget.mock.calls.slice(0, layer_count).map(call => call[1]);
        expect(layers).toEqual(Array.from({ length: layer_count }, (_, i) => i));
        expect(renderer.clear).toHaveBeenCalledTimes(layer_count);
        expect(layer_heights[0]).toBeCloseTo(field_texture.minimum.y + 0.5 * field_texture.voxel_size.y, 9);
        expect(layer_heights.at(-1)).toBeCloseTo(field_texture.minimum.y + field_texture.size.y - 0.5 * field_texture.voxel_size.y, 9);
    });

    test('render() adds the balls’ contributions up and leaves the renderer as it found it', () => {
        const field_texture = createMetaballFieldTexture({ max_balls: 1 });
        const { renderer } = makeRenderer();
        field_texture.render(renderer, makeBallUniforms([{ center: [0, -0.4, 0], strength: 0.08, subtract: 35 }]));

        const material = renderer.render.mock.calls[0][0].children[0].material;
        expect(material).toMatchObject({ blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, depthTest: false });
        expect(renderer.setRenderTarget).toHaveBeenLastCalledWith('previous target');
        expect(renderer.setClearColor.mock.calls.at(-1)[0].getHex()).toBe(0x123456);
        expect(renderer.setClearColor.mock.calls.at(-1)[1]).toBe(1);
        expect(renderer.autoClear).toBe(true);
    });
});
