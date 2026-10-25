import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/metaball.vert?raw';
import fragment_glsl from '../shaders/metaball.frag?raw';
import {
    METABALL_LIGHT_POSITION, METABALL_GPU_MAX_BALLS,
    METABALL_RAYMARCH_MAX_STEPS, METABALL_RAYMARCH_STEPS, METABALL_RAYMARCH_NORMAL_EPSILON,
    METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z,
    METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z,
    METABALL_BACKGROUND_FADE_NEAR, METABALL_BACKGROUND_FADE_FAR, METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { computeLightViewPosition } from './light_utils.js';
import { cameraArcVisibility, worldAzimuth, horizontalDistance } from '../animation/math_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(METABALL_LIGHT_POSITION.x, METABALL_LIGHT_POSITION.y, METABALL_LIGHT_POSITION.z);
const scratch_light_view_position = new THREE.Vector3();

function resolveFragmentShader(max_balls) {
    return fragment_glsl
        .replaceAll('METABALL_GPU_MAX_BALLS', max_balls)
        .replaceAll('METABALL_RAYMARCH_MAX_STEPS', METABALL_RAYMARCH_MAX_STEPS);
}

export function createMetaballMaterial({ max_balls = METABALL_GPU_MAX_BALLS } = {}) {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + resolveFragmentShader(max_balls),
        glslVersion: THREE.GLSL3,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: DEFAULT_SETTINGS.glowEnabled ? 1.0 : 0.0 },
            u_glow_color: { value: new THREE.Color(DEFAULT_SETTINGS.glowColor) },
            u_color_hot: { value: new THREE.Color(DEFAULT_SETTINGS.colorHot) },
            u_color_cool: { value: new THREE.Color(DEFAULT_SETTINGS.colorCool) },
            u_noise_enabled: { value: DEFAULT_SETTINGS.noiseEnabled ? 1.0 : 0.0 },
            u_noise_color_1: { value: new THREE.Color(DEFAULT_SETTINGS.noiseColor1) },
            u_noise_color_2: { value: new THREE.Color(DEFAULT_SETTINGS.noiseColor2) },
            u_bump_enabled: { value: DEFAULT_SETTINGS.bumpEnabled ? 1.0 : 0.0 },
            u_displacement: { value: DEFAULT_SETTINGS.displacementStrength },
            u_ball_center: { value: Array.from({ length: max_balls }, () => new THREE.Vector3()) },
            u_ball_strength: { value: new Float32Array(max_balls) },
            u_ball_subtract: { value: new Float32Array(max_balls) },
            u_ball_count: { value: 0 },
            u_isolation: { value: DEFAULT_SETTINGS.metaballIsolation },
            u_effect_position: { value: new THREE.Vector3() },
            u_effect_scale: { value: 1.0 },
            u_box_half_extent: { value: new THREE.Vector3(METABALL_PROXY_HALF_EXTENT_X, METABALL_PROXY_HALF_EXTENT_Y, METABALL_PROXY_HALF_EXTENT_Z) },
            u_box_center: { value: new THREE.Vector3(METABALL_PROXY_CENTER_X, METABALL_PROXY_CENTER_Y, METABALL_PROXY_CENTER_Z) },
            u_raymarch_steps: { value: METABALL_RAYMARCH_STEPS },
            u_normal_epsilon: { value: METABALL_RAYMARCH_NORMAL_EPSILON },
            u_projection_matrix: { value: new THREE.Matrix4() },
            u_background_fade_near: { value: METABALL_BACKGROUND_FADE_NEAR },
            u_background_fade_far: { value: METABALL_BACKGROUND_FADE_FAR },
        },
        side: THREE.BackSide,
        precision: 'highp',
    });
}

export function updateMetaballLight(material, camera, time) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, scratch_light_view_position);
    material.uniforms.u_light_position.value.copy(scratch_light_view_position);
    material.uniforms.u_time.value = time;
    material.uniforms.u_projection_matrix.value.copy(camera.projectionMatrix);
}

export function updateMetaballBalls(effect, balls, camera) {
    const uniforms = effect.material.uniforms;
    const centers = uniforms.u_ball_center.value;
    const strengths = uniforms.u_ball_strength.value;
    const subtracts = uniforms.u_ball_subtract.value;
    const radius_scale_squared = effect.radius_scale * effect.radius_scale;
    const camera_azimuth = camera && worldAzimuth(effect.position, camera.position);
    for (let i = 0; i < centers.length; i++) {
        const ball = balls[i];
        if (ball) {
            centers[i].set(2 * ball.x - 1, 2 * ball.y - 1, 2 * ball.z - 1);
            const visibility = camera ? cameraArcVisibility(ball.angle, camera_azimuth) : 1;
            strengths[i] = ball.strength * radius_scale_squared * visibility;
            subtracts[i] = ball.subtract;
        } else {
            strengths[i] = 0.0;
        }
    }
    uniforms.u_ball_count.value = Math.min(balls.length, centers.length);
    uniforms.u_isolation.value = effect.isolation;
    uniforms.u_effect_position.value.copy(effect.position);
    uniforms.u_effect_scale.value = effect.scale.x;
}

export function updateMetaballDisplacement(material, { enabled, strength, camera, volcano_position }) {
    const camera_too_far = horizontalDistance(camera.position, volcano_position) > METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE;
    material.uniforms.u_displacement.value = (enabled && !camera_too_far) ? strength : 0.0;
}
