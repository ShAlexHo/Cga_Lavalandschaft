import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import vertex_glsl    from './shaders/metaball.vert?raw';
import noise_glsl     from './shaders/noise.glsl?raw';
import fragment_glsl  from './shaders/metaball.frag?raw';

const vertex_shader   = noise_glsl + vertex_glsl;
const fragment_shader = noise_glsl + fragment_glsl;

import { random, randomGauss } from './rand.js';

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

export const settings = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: MAX_BALLS, flow_z_radius: 11 };

const SECTORS = 6;
const SECTOR_WIDTH = (Math.PI * 2) / SECTORS;

const BALL_POOL = Array.from({ length: MAX_BALLS }, (_, i) => ({
    x: CRATER_X, y: CRATER_Y, z: CRATER_Z, strength: BALL_STRENGTH * random(0.70, 1.25), subtract: random(25, 45),
    speed_mult: random(0.6, 1.4),
    angle: randomGauss((i % SECTORS) * SECTOR_WIDTH, SECTOR_WIDTH * 0.4),
    active: false,
}));

const spawn_times = new Float64Array(MAX_BALLS).fill(Infinity);

const LIGHT_WORLD_POSITION = new THREE.Vector3(6, 8, 6);
const _light_view_position = new THREE.Vector3();

export function createMetaballs(scene) {
    const material = new THREE.ShaderMaterial({
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: 1.0 },
            u_glow_color: { value: new THREE.Color(1.0, 0.05, 0.0) },
            u_color_hot: { value: new THREE.Color(0xa01500) },
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

    rebuildField(effect);

    return { effect, material };
}

let iteration_count = 0;
let pool_head = 0;
let current_wave_count = 0;
let last_spawn_time = -1.0;
let pausing = false;
let pause_end = -Infinity;
const wave_starts = [0];
const wave_sizes  = [];
export function rebuildField(effect) {
    effect.reset();
    for (let i = 0; i < MAX_BALLS; i++) {
        if (!BALL_POOL[i].active) continue;
        const ball = BALL_POOL[i];
        effect.addBall(ball.x, ball.y, ball.z, ball.strength, ball.subtract);
    }
    effect.update();
}

export function updateMetaballs(effect, time) {
    if (settings.paused) return;

    if (pausing) {
        if (time >= pause_end) {
            pausing = false;
            iteration_count++;
            wave_starts.push(pool_head);
            current_wave_count = 0;
            last_spawn_time = -1.0;

            // Delete balls from 2 iterations ago ("vor-vorherige Iteration")
            if (iteration_count >= 2) {
                const delete_iteration = iteration_count - 2;
                const delete_start = wave_starts[delete_iteration];
                const delete_count = wave_sizes[delete_iteration];
                for (let j = 0; j < delete_count; j++) {
                    BALL_POOL[(delete_start + j) % MAX_BALLS].active = false;
                }
            }
        }
    } else {
        if (current_wave_count < settings.count && time - last_spawn_time >= 1.0) {
            const index = pool_head;
            spawn_times[index] = time;
            BALL_POOL[index].active = true;
            current_wave_count++;
            pool_head = (pool_head + 1) % MAX_BALLS;
            last_spawn_time = time;
        } else if (current_wave_count >= settings.count) {
            wave_sizes.push(current_wave_count);
            pausing = true;
            pause_end = time + random(20, 30);
        }
    }

    for (let i = 0; i < MAX_BALLS; i++) {
        if (!BALL_POOL[i].active) continue;
        const ball = BALL_POOL[i];
        const life_fraction = Math.min((time - spawn_times[i]) * settings.speed_factor * ball.speed_mult / BALL_LIFETIME, 1.0);
        const remaining_fraction = 1.0 - life_fraction;
        const phase = (1.0 - remaining_fraction ** 16) * 0.95;
        const radius = settings.flow_z_radius / SCALE_XY * phase;
        ball.y = CRATER_Y + (GROUND_Y - CRATER_Y) * phase;
        ball.x = CRATER_X + radius * Math.cos(ball.angle);
        ball.z = CRATER_Z + radius * Math.sin(ball.angle);
    }

    rebuildField(effect);
}

export function updateLight(material, camera, time) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}
