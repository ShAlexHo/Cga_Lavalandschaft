import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import vertexShader  from './shaders/metaball.vert?raw';
import noiseGlsl     from './shaders/noise.glsl?raw';
import fragGlsl      from './shaders/metaball.frag?raw';

const fragmentShader = noiseGlsl + fragGlsl;

import { rand, rand3 } from './rand.js';

const MAX_BALLS = 30;
const GROUND_HEIGHT = 0.28;

export const settings = { count: 16, spread: 1.0, speed_factor: 1.86, agitation: 1.0, max_count: MAX_BALLS };

const BALL_POOL = Array.from({ length: MAX_BALLS }, () => ({
    x: 0.5, y: 0.5, z: 0.5, strength: 1.0, subtract: rand(25, 45),
}));

const ANIMATIONS = Array.from({ length: MAX_BALLS }, () => ({
    base: rand3(0.32, 0.68),
    speed: rand3(0.5, 1.2),
    amplitude: rand(0.05, 0.09),
    phase: rand3(0, Math.PI * 2),
}));

const LIGHT_WORLD_POSITION = new THREE.Vector3(6, 8, 6);
const _light_view_position = new THREE.Vector3();

export function create_metaballs(scene) {
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: 1.0 },
            u_glow_color: { value: new THREE.Color(1.0, 0.05, 0.0) },
            u_color_hot: { value: new THREE.Color(0.89, 0.13, 0.09) },
            u_color_cool: { value: new THREE.Color(0.20, 0.03, 0.02) },
            u_noise_enabled: { value: 1.0 },
            u_noise_color_1: { value: new THREE.Color(0.0, 0.0, 0.0) },
            u_noise_color_2: { value: new THREE.Color(0.82, 0.14, 0.02) },
        },
        side: THREE.DoubleSide,
    });

    const resolution = 60;
    const max_polygon_count = 200_000;
    const effect = new MarchingCubes(resolution, material, false, false, max_polygon_count);
    effect.isolation = 50;
    effect.scale.setScalar(3.0);
    scene.add(effect);

    rebuild_field(effect);

    return { effect, material };
}

export function rebuild_field(effect) {
    effect.reset();
    for (let index = 0; index < settings.count; index++) {
        const ball = BALL_POOL[index];
        effect.addBall(ball.x, ball.y, ball.z, ball.strength, ball.subtract);
    }
    effect.update();
}

export function update_metaballs(effect, time) {
    for (let index = 0; index < settings.count; index++) {
        const ball = BALL_POOL[index];
        const animation = ANIMATIONS[index];
        ball.x = 0.5 + (animation.base[0] - 0.5) * settings.spread + Math.sin(time * animation.speed[0] * settings.speed_factor * settings.agitation + animation.phase[0]) * animation.amplitude;
        ball.y = GROUND_HEIGHT + Math.sin(time * animation.speed[1] * settings.speed_factor * settings.agitation + animation.phase[1]) * (animation.amplitude * 0.4 + 0.02);
        ball.z = 0.5 + (animation.base[2] - 0.5) * settings.spread + Math.sin(time * animation.speed[2] * settings.speed_factor * settings.agitation + animation.phase[2]) * animation.amplitude;
    }
    rebuild_field(effect);
}

export function update_light(material, camera, time) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}
