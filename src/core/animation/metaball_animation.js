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
    METABALL_SPAWN_INTERVAL,
    METABALL_SECTORS,
    METABALL_WAVE_TRANSITION,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export const MAX_BALLS = METABALL_MAX_BALLS;

const BALL_STRENGTH = (METABALL_LEGACY_EFFECT_SCALE / METABALL_SCALE_XY) ** 2;

export const settings = {
    count: DEFAULT_SETTINGS.metaballCount,
    spread: DEFAULT_SETTINGS.metaballSpread,
    speed_factor: DEFAULT_SETTINGS.metaballSpeed,
    sink_speed: DEFAULT_SETTINGS.metaballSinkSpeed,
    disappear_y: DEFAULT_SETTINGS.metaballDisappearY,
    paused: DEFAULT_SETTINGS.paused,
    max_count: MAX_BALLS,
    flow_z_radius: DEFAULT_SETTINGS.flowRadius,
};

const SECTOR_WIDTH = (Math.PI * 2) / METABALL_SECTORS;

const ball_pool = Array.from({ length: MAX_BALLS }, (_, i) => {
    const base_strength = BALL_STRENGTH * random(0.70, 1.25);
    return {
        x: METABALL_CRATER_X, y: METABALL_CRATER_Y, z: METABALL_CRATER_Z,
        strength: base_strength, base_strength, shrink_fraction: 0, subtract: random(25, 45),
        speed_mult: random(0.6, 1.4),
        angle: randomGauss((i % METABALL_SECTORS) * SECTOR_WIDTH, SECTOR_WIDTH * 0.4),
        active: false,
    };
});

const spawn_times = new Float64Array(MAX_BALLS).fill(Infinity);

let pool_head = 0;
let current_wave_count = 0;
let last_spawn_time = -Infinity;
let pausing = false;
let pause_start = -Infinity;
let pause_end = -Infinity;

const active_balls = [];

export function getActiveBalls() {
    active_balls.length = 0;
    for (let i = 0; i < MAX_BALLS; i++) {
        if (ball_pool[i].active) active_balls.push(ball_pool[i]);
    }
    return active_balls;
}

// 1.0 while a wave spawns; eases toward 0 around a pause instead of snapping.
export function getEruptionIntensity(time) {
    if (!pausing) return 1.0;
    const fading_out = 1 - smoothstep(pause_start, pause_start + METABALL_WAVE_TRANSITION, time);
    const fading_in = smoothstep(pause_end - METABALL_WAVE_TRANSITION, pause_end, time);
    return Math.max(fading_out, fading_in);
}

// Advances the simulation by one frame and returns the active balls, or null while paused.
export function stepMetaballAnimation(time) {
    if (settings.paused) return null;

    if (pausing) {
        if (time >= pause_end) {
            pausing = false;
            current_wave_count = 0;
            last_spawn_time = -Infinity;
        }
    } else {
        if (current_wave_count < settings.count && time - last_spawn_time >= METABALL_SPAWN_INTERVAL) {
            let index = -1;
            for (let offset = 0; offset < MAX_BALLS; offset++) {
                const candidate = (pool_head + offset) % MAX_BALLS;
                if (!ball_pool[candidate].active) { index = candidate; break; }
            }
            if (index !== -1) {
                spawn_times[index] = time;
                ball_pool[index].active = true;
                ball_pool[index].strength = ball_pool[index].base_strength; // undo any earlier squeeze from a prior life
                ball_pool[index].shrink_fraction = 0;
                current_wave_count++;
                pool_head = (index + 1) % MAX_BALLS;
                last_spawn_time = time;
            }
        } else if (current_wave_count >= settings.count) {
            pausing = true;
            pause_start = time;
            pause_end = time + random(10, 18);
        }
    }

    for (let i = 0; i < MAX_BALLS; i++) {
        if (!ball_pool[i].active) continue;
        const ball = ball_pool[i];
        const raw_fraction = (time - spawn_times[i]) * settings.speed_factor * ball.speed_mult / METABALL_BALL_LIFETIME;
        const life_fraction = Math.min(raw_fraction, 1.0);
        const remaining_fraction = 1.0 - life_fraction;
        const flow_phase = 1.0 - remaining_fraction ** 16;
        const sink_depth = Math.max(raw_fraction - 1.0, 0) * settings.sink_speed;
        const radius = settings.flow_z_radius / METABALL_SCALE_XY * flow_phase;
        ball.y = METABALL_CRATER_Y + (METABALL_GROUND_Y - METABALL_CRATER_Y) * flow_phase - sink_depth;
        ball.x = METABALL_CRATER_X + radius * Math.cos(ball.angle);
        ball.z = METABALL_CRATER_Z + radius * Math.sin(ball.angle);

        if (ball.y <= settings.disappear_y) ball.active = false;
    }

    return getActiveBalls();
}
