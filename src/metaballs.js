import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import vertexGlsl    from './shaders/metaball.vert?raw';
import noiseGlsl     from './shaders/noise.glsl?raw';
import fragGlsl      from './shaders/metaball.frag?raw';

const vertexShader   = noiseGlsl + vertexGlsl;
const fragmentShader = noiseGlsl + fragGlsl;

import { rand } from './rand.js';

const MAX_BALLS = 500;

const LEGACY_EFFECT_SCALE = 6.0;
const SCALE_XY = 30.0;
const SCALE_Z  = 30.0;
const BALL_STRENGTH = ( LEGACY_EFFECT_SCALE / SCALE_XY ) ** 2;

const CRATER_Y = 0.45;   // (-1 - 0.36) / 30 + 0.5  (Vulkanspitze: ground -6 + height 5 = -1)
const CRATER_X = 0.5;
const CRATER_Z = 0.5;
const CRATER_R = 0.032;   // Kraterradius 0.95 / SCALE_XY
const GROUND_Y = 0.288;   // (-6 - 0.36) / 30 + 0.5

const BALL_LIFETIME = 3.5;  // Sekunden von Krater bis Boden

export const settings = { count: 100, spread: 1.0, speed_factor: 0.15, paused: false, max_count: MAX_BALLS };

const BALL_POOL = Array.from({ length: MAX_BALLS }, () => ({
    x: CRATER_X, y: CRATER_Y, z: CRATER_Z, strength: BALL_STRENGTH, subtract: rand(25, 45),
}));

function random_spawn() {
    const angle = Math.random() * Math.PI * 2;
    const r     = Math.random() * CRATER_R;
    return {
        spawn_x: CRATER_X + Math.cos(angle) * r,
        spawn_z: CRATER_Z + Math.sin(angle) * r,
        drift_x: (Math.random() - 0.5) * 0.4,
        drift_z: (Math.random() - 0.5) * 0.4,
    };
}

const BALL_STATE = Array.from({ length: MAX_BALLS }, (_, i) => {
    const p = i / MAX_BALLS;
    return { offset: p, prev_phase: p, ...random_spawn() };
});

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
            u_color_hot: { value: new THREE.Color(0.62, 0.09, 0.06) },
            u_color_cool: { value: new THREE.Color(0.20, 0.03, 0.02) },
            u_noise_enabled: { value: 1.0 },
            u_noise_color_1: { value: new THREE.Color(0x7c3027) },
            u_noise_color_2: { value: new THREE.Color(0.82, 0.14, 0.02) },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
        },
        side: THREE.DoubleSide,
    });

    const resolution = 180;
    const max_polygon_count = 250_000;
    const effect = new MarchingCubes(resolution, material, false, false, max_polygon_count);
    effect.isolation = 50;
    effect.scale.set(SCALE_XY, SCALE_XY, SCALE_Z);
    scene.add(effect);

    rebuild_field(effect);

    return { effect, material };
}

let active_count = 0;
let last_spawn_time = -1.0;

export function rebuild_field(effect) {
    active_count = Math.min(active_count, settings.count);
    effect.reset();
    for (let i = 0; i < active_count; i++) {
        const ball = BALL_POOL[i];
        effect.addBall(ball.x, ball.y, ball.z, ball.strength, ball.subtract);
    }
    effect.update();
}

export function update_metaballs(effect, time) {
    if (active_count < settings.count && time - last_spawn_time >= 1.0) {
        active_count++;
        last_spawn_time = time;
    }
    rebuild_field(effect);
}

export function update_light(material, camera, time) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}
