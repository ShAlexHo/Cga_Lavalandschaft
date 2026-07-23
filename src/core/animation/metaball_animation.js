import { random, randomGauss } from '../rand.js';
import { smoothstep } from './math_utils.js';
import {
    METABALL_SCALE_XY,
    METABALL_MAX_BALLS,
    METABALL_LEGACY_EFFECT_SCALE,
    METABALL_CRATER_X,
    METABALL_CRATER_Y,
    METABALL_CRATER_Z,
    METABALL_GROUND_Y,
    METABALL_BALL_LIFETIME,
    METABALL_SECTORS,
    METABALL_WAVE_TRANSITION,
} from '../config.js';

export const MAX_BALLS = METABALL_MAX_BALLS;

const BALL_STRENGTH = (METABALL_LEGACY_EFFECT_SCALE / METABALL_SCALE_XY) ** 2;

export const settings = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: MAX_BALLS, flow_z_radius: 10.3 };

const SECTOR_WIDTH = (Math.PI * 2) / METABALL_SECTORS;

const ball_pool = Array.from({ length: MAX_BALLS }, (_, i) => ({
    x: METABALL_CRATER_X, y: METABALL_CRATER_Y, z: METABALL_CRATER_Z, strength: BALL_STRENGTH * random(0.70, 1.25), subtract: random(25, 45),
    speed_mult: random(0.6, 1.4),
    angle: randomGauss((i % METABALL_SECTORS) * SECTOR_WIDTH, SECTOR_WIDTH * 0.4),
    active: false,
}));

const spawn_times = new Float64Array(MAX_BALLS).fill(Infinity);

let iteration_count = 0;
let pool_head = 0;
let current_wave_count = 0;
let last_spawn_time = -1.0;
let pausing = false;
let pause_start = -Infinity;
let pause_end = -Infinity;
const wave_starts = [0];
const wave_sizes = [];

const active_balls = [];

export function getActiveBalls() {
    active_balls.length = 0;
    for (let i = 0; i < MAX_BALLS; i++) {
        if (ball_pool[i].active) active_balls.push(ball_pool[i]);
    }
    return active_balls;
}

// 1.0 while a wave is actively spawning; eases down/up around a wave pause (no new balls being
// initialized) instead of snapping, so dependents like the smoke plume can fade smoothly.
export function getEruptionIntensity(time) {
    if (!pausing) return 1.0;
    const fading_out = 1 - smoothstep(pause_start, pause_start + METABALL_WAVE_TRANSITION, time);
    const fading_in = smoothstep(pause_end - METABALL_WAVE_TRANSITION, pause_end, time);
    return Math.max(fading_out, fading_in);
}

// Returns the active balls after advancing the simulation by one frame,
// or null while paused (nothing changed, callers should skip a rebuild).
export function stepMetaballAnimation(time) {
    if (settings.paused) return null;

    if (pausing) {
        if (time >= pause_end) {
            pausing = false;
            iteration_count++;
            wave_starts.push(pool_head);
            current_wave_count = 0;
            last_spawn_time = -1.0;

            // Delete balls from 2 iterations ago
            if (iteration_count >= 2) {
                const delete_iteration = iteration_count - 2;
                const delete_start = wave_starts[delete_iteration];
                const delete_count = wave_sizes[delete_iteration];
                for (let j = 0; j < delete_count; j++) {
                    ball_pool[(delete_start + j) % MAX_BALLS].active = false;
                }
            }
        }
    } else {
        if (current_wave_count < settings.count && time - last_spawn_time >= 1.0) {
            const index = pool_head;
            spawn_times[index] = time;
            ball_pool[index].active = true;
            current_wave_count++;
            pool_head = (pool_head + 1) % MAX_BALLS;
            last_spawn_time = time;
        } else if (current_wave_count >= settings.count) {
            wave_sizes.push(current_wave_count);
            pausing = true;
            pause_start = time;
            pause_end = time + random(20, 30);
        }
    }

    for (let i = 0; i < MAX_BALLS; i++) {
        if (!ball_pool[i].active) continue;
        const ball = ball_pool[i];
        const life_fraction = Math.min((time - spawn_times[i]) * settings.speed_factor * ball.speed_mult / METABALL_BALL_LIFETIME, 1.0);
        const remaining_fraction = 1.0 - life_fraction;
        const phase = (1.0 - remaining_fraction ** 16) * 0.95;
        const radius = settings.flow_z_radius / METABALL_SCALE_XY * phase;
        ball.y = METABALL_CRATER_Y + (METABALL_GROUND_Y - METABALL_CRATER_Y) * phase;
        ball.x = METABALL_CRATER_X + radius * Math.cos(ball.angle);
        ball.z = METABALL_CRATER_Z + radius * Math.sin(ball.angle);
    }

    return getActiveBalls();
}
