import { random, randomGauss } from '../rand.js';
import { SCALE_XY } from '../geometry/metaball_geometry.js';

export const MAX_BALLS = 500;

const LEGACY_EFFECT_SCALE = 6.0;
const BALL_STRENGTH = ( LEGACY_EFFECT_SCALE / SCALE_XY ) ** 2;

const CRATER_Y = 0.45;
const CRATER_X = 0.5;
const CRATER_Z = 0.5;
const GROUND_Y = 0.288;
const BALL_LIFETIME = 3.5;

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

let iteration_count = 0;
let pool_head = 0;
let current_wave_count = 0;
let last_spawn_time = -1.0;
let pausing = false;
let pause_end = -Infinity;
const wave_starts = [0];
const wave_sizes  = [];

export function getActiveBalls() {
    return BALL_POOL.filter(ball => ball.active);
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

    return getActiveBalls();
}
