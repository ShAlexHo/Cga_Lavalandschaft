import * as THREE from 'three';
import vertex_glsl from '../shaders/metaball_field_splat.vert?raw';
import fragment_glsl from '../shaders/metaball_field_splat.frag?raw';
import {
    METABALL_FIELD_TEXTURE_SIZE, METABALL_FIELD_CONTRIBUTION_LIMIT,
    METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z,
} from '../config.js';
import { toGlslFloat } from './glsl_utils.js';

const QUAD_CORNERS = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];
const QUAD_INDICES = [0, 1, 2, 0, 2, 3];

export function createMetaballFieldTexture({ max_balls }) {
    const { x: width, y: layer_count, z: height } = METABALL_FIELD_TEXTURE_SIZE;
    const minimum = new THREE.Vector3(
        METABALL_PROXY_CENTER_X - METABALL_PROXY_HALF_EXTENT_X,
        METABALL_PROXY_CENTER_Y - METABALL_PROXY_HALF_EXTENT_Y,
        METABALL_PROXY_CENTER_Z - METABALL_PROXY_HALF_EXTENT_Z,
    );
    const size = new THREE.Vector3(2 * METABALL_PROXY_HALF_EXTENT_X, 2 * METABALL_PROXY_HALF_EXTENT_Y, 2 * METABALL_PROXY_HALF_EXTENT_Z);
    const voxel_size = new THREE.Vector3(size.x / width, size.y / layer_count, size.z / height);

    const render_target = new THREE.WebGL3DRenderTarget(width, height, layer_count, { depthBuffer: false });
    Object.assign(render_target.texture, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
    });

    const centers_and_strengths = new THREE.InstancedBufferAttribute(new Float32Array(4 * max_balls), 4);
    const subtracts = new THREE.InstancedBufferAttribute(new Float32Array(max_balls), 1);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(QUAD_CORNERS, 3));
    geometry.setIndex(QUAD_INDICES);
    geometry.setAttribute('ball_center_strength', centers_and_strengths);
    geometry.setAttribute('ball_subtract', subtracts);
    geometry.instanceCount = 0;

    const material = new THREE.ShaderMaterial({
        vertexShader: vertex_glsl,
        fragmentShader: fragment_glsl,
        glslVersion: THREE.GLSL3,
        defines: { METABALL_FIELD_CONTRIBUTION_LIMIT: toGlslFloat(METABALL_FIELD_CONTRIBUTION_LIMIT) },
        uniforms: {
            u_layer_y: { value: 0.0 },
            u_field_minimum: { value: minimum },
            u_field_size: { value: size },
        },
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
    });

    const splats = new THREE.Mesh(geometry, material);
    splats.frustumCulled = false;
    const splat_scene = new THREE.Scene();
    splat_scene.add(splats);
    const splat_camera = new THREE.Camera();
    const previous_clear_color = new THREE.Color();

    return {
        texture: render_target.texture,
        minimum,
        size,
        voxel_size,

        render(renderer, { u_ball_center, u_ball_strength, u_ball_subtract, u_ball_count }) {
            const ball_count = u_ball_count.value;
            for (let i = 0; i < ball_count; i++) {
                const center = u_ball_center.value[i];
                centers_and_strengths.setXYZW(i, center.x, center.y, center.z, u_ball_strength.value[i]);
                subtracts.setX(i, u_ball_subtract.value[i]);
            }
            centers_and_strengths.needsUpdate = true;
            subtracts.needsUpdate = true;
            geometry.instanceCount = ball_count;

            const previous_target = renderer.getRenderTarget();
            const previous_clear_alpha = renderer.getClearAlpha();
            const previous_auto_clear = renderer.autoClear;
            renderer.getClearColor(previous_clear_color);
            renderer.setClearColor(0x000000, 0);
            renderer.autoClear = false;

            for (let layer = 0; layer < layer_count; layer++) {
                material.uniforms.u_layer_y.value = minimum.y + (layer + 0.5) * voxel_size.y;
                renderer.setRenderTarget(render_target, layer);
                renderer.clear(true, false, false);
                renderer.render(splat_scene, splat_camera);
            }

            renderer.setRenderTarget(previous_target);
            renderer.setClearColor(previous_clear_color, previous_clear_alpha);
            renderer.autoClear = previous_auto_clear;
        },
    };
}
