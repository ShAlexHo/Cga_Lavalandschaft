import { smoothstep, clamp } from './math_utils.js';
import {
    INTERACTION_MAX_POINTS, INTERACTION_DECAY_DURATION,
    INTERACTION_BUMP_RADIUS, INTERACTION_PUSH_HEIGHT_SCALE,
    INTERACTION_HOVER_RISE_RATE, INTERACTION_HOVER_RISE_MAX_DELTA,
    INTERACTION_DWELL_POSITION_TOLERANCE, INTERACTION_SMOKE_STILLNESS_TOLERANCE,
    INTERACTION_LAVA_DETECTION_TOLERANCE, INTERACTION_MIN_POINT_SPACING,
    INTERACTION_METABALL_CENTER_THRESHOLD, INTERACTION_METABALL_SHRINK_DURATION, INTERACTION_METABALL_SHRINK_FRACTION,
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_SURFACE_OFFSET, INTERACTION_SMOKE_PUSH_INFLUENCE,
    INTERACTION_SMOKE_FADE_PER_PRESS_SECOND, INTERACTION_SMOKE_MIN_BURST_DURATION, INTERACTION_SMOKE_MAX_BURST_DURATION,
    INTERACTION_SMOKE_BLOOM_DURATION, INTERACTION_SMOKE_EMBER_STRENGTH_DECAY, INTERACTION_SMOKE_MIN_EMBER_STRENGTH,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export const MAX_POINTS = INTERACTION_MAX_POINTS;

export const settings = {
    enabled: DEFAULT_SETTINGS.interactionMode,
};

function distance(point_a, point_b) {
    const offset_x = point_a.x - point_b.x;
    const offset_y = point_a.y - point_b.y;
    const offset_z = point_a.z - point_b.z;
    return Math.sqrt(offset_x * offset_x + offset_y * offset_y + offset_z * offset_z);
}

function distanceFromViewRay(camera_position, ray_point, point) {
    const direction_x = ray_point.x - camera_position.x;
    const direction_y = ray_point.y - camera_position.y;
    const direction_z = ray_point.z - camera_position.z;
    const direction_length = Math.sqrt(direction_x ** 2 + direction_y ** 2 + direction_z ** 2);
    const unit_x = direction_x / direction_length;
    const unit_y = direction_y / direction_length;
    const unit_z = direction_z / direction_length;

    const to_point_x = point.x - camera_position.x;
    const to_point_y = point.y - camera_position.y;
    const to_point_z = point.z - camera_position.z;
    const projection_length = to_point_x * unit_x + to_point_y * unit_y + to_point_z * unit_z;

    const closest_on_ray = {
        x: camera_position.x + unit_x * projection_length,
        y: camera_position.y + unit_y * projection_length,
        z: camera_position.z + unit_z * projection_length,
    };
    return distance(point, closest_on_ray);
}

function findNearestActive(pool, point) {
    let nearest = null;
    let nearest_distance = Infinity;
    for (const record of pool) {
        if (!record.active) continue;
        const record_distance = distance(point, record);
        if (record_distance < nearest_distance) {
            nearest_distance = record_distance;
            nearest = record;
        }
    }
    return { record: nearest, distance: nearest_distance };
}

const touch_pool = Array.from({ length: MAX_POINTS }, () => ({
    x: 0, y: 0, z: 0, height_cap: 0, last_touched_time: -Infinity, active: false,
}));
let pool_head = 0;

export function isOnLava(point, metaballs) {
    let field_value = 0;
    for (const metaball of metaballs) {
        const distance_squared = Math.max(distance(point, metaball) ** 2, 0.0001);
        const contribution = (metaball.radius * metaball.radius) * (metaball.isolation + metaball.subtract) / distance_squared - metaball.subtract;
        if (contribution > 0) field_value += contribution;
    }
    return metaballs.length > 0 && field_value >= metaballs[0].isolation * INTERACTION_LAVA_DETECTION_TOLERANCE;
}

let center_press = null;

function updateCenterPress(time, metaball) {
    if (!metaball) {
        center_press = null;
        return null;
    }
    const is_continuing = center_press && distance(center_press, metaball) <= INTERACTION_DWELL_POSITION_TOLERANCE;
    const delta_time = is_continuing ? time - center_press.last_press_time : 0;
    center_press = { x: metaball.x, y: metaball.y, z: metaball.z, last_press_time: time };

    const shrink_increment = delta_time * (INTERACTION_METABALL_SHRINK_FRACTION / INTERACTION_METABALL_SHRINK_DURATION);
    return { x: metaball.x, y: metaball.y, z: metaball.z, shrink_increment };
}

export function resetTouchSession() {
    center_press = null;
}

const smoke_burst_pool = Array.from({ length: INTERACTION_SMOKE_MAX_BURSTS }, () => ({
    x: 0, y: 0, z: 0, first_active_time: -Infinity, last_active_time: -Infinity, ember_start_time: -Infinity, ember_strength: 1, active: false,
}));
let smoke_burst_head = 0;

function updateSmokeBurst(time, position) {
    const { record: nearest, distance: nearest_distance } = findNearestActive(smoke_burst_pool, position);
    if (nearest && nearest_distance <= INTERACTION_DWELL_POSITION_TOLERANCE) {
        if (distance(nearest, position) > INTERACTION_SMOKE_STILLNESS_TOLERANCE) {
            nearest.ember_start_time = time;
            nearest.ember_strength = Math.max(INTERACTION_SMOKE_MIN_EMBER_STRENGTH, nearest.ember_strength * INTERACTION_SMOKE_EMBER_STRENGTH_DECAY);
        }
        nearest.x = position.x;
        nearest.y = position.y;
        nearest.z = position.z;
        nearest.last_active_time = time;
        return;
    }

    const slot = smoke_burst_pool[smoke_burst_head];
    slot.x = position.x;
    slot.y = position.y;
    slot.z = position.z;
    slot.first_active_time = time;
    slot.last_active_time = time;
    slot.ember_strength = 1;
    slot.ember_start_time = time;
    slot.active = true;
    smoke_burst_head = (smoke_burst_head + 1) % INTERACTION_SMOKE_MAX_BURSTS;
}

function pushedSurfacePoint(hit_point, camera_position, push_amount) {
    const direction_x = camera_position.x - hit_point.x;
    const direction_y = camera_position.y - hit_point.y;
    const direction_z = camera_position.z - hit_point.z;
    const direction_length = Math.sqrt(direction_x ** 2 + direction_y ** 2 + direction_z ** 2);
    return {
        x: hit_point.x + (direction_x / direction_length) * push_amount,
        y: hit_point.y + (direction_y / direction_length) * push_amount,
        z: hit_point.z + (direction_z / direction_length) * push_amount,
    };
}

function smokeOriginAt(surface_point) {
    return { x: surface_point.x, y: surface_point.y + INTERACTION_SMOKE_SURFACE_OFFSET, z: surface_point.z };
}

function spawnSmokeAt(time, hit_point, camera_position, height_cap) {
    const surface_point = pushedSurfacePoint(hit_point, camera_position, height_cap * INTERACTION_SMOKE_PUSH_INFLUENCE);
    updateSmokeBurst(time, smokeOriginAt(surface_point));
}

export function registerTouch(time, hit_point, metaballs, camera_position) {
    let nearest_metaball_by_view = null;
    let nearest_view_distance = Infinity;
    let nearest_metaball_by_surface = null;
    let nearest_surface_distance = Infinity;
    for (const metaball of metaballs) {
        const view_distance = distanceFromViewRay(camera_position, hit_point, metaball);
        if (view_distance < nearest_view_distance) {
            nearest_view_distance = view_distance;
            nearest_metaball_by_view = metaball;
        }
        const surface_distance = Math.max(0, distance(hit_point, metaball) - metaball.radius);
        if (surface_distance < nearest_surface_distance) {
            nearest_surface_distance = surface_distance;
            nearest_metaball_by_surface = metaball;
        }
    }
    const metaball_squeeze = updateCenterPress(
        time,
        nearest_view_distance <= INTERACTION_METABALL_CENTER_THRESHOLD ? nearest_metaball_by_view : null,
    );
    const on_lava = isOnLava(hit_point, metaballs) || metaball_squeeze !== null;

    const { record: nearest_point, distance: nearest_point_distance } = findNearestActive(touch_pool, hit_point);
    if (nearest_point && nearest_point_distance <= INTERACTION_MIN_POINT_SPACING) {
        if (on_lava) {
            const hover_delta_time = clamp(time - nearest_point.last_touched_time, 0, INTERACTION_HOVER_RISE_MAX_DELTA);
            nearest_point.height_cap += hover_delta_time * INTERACTION_HOVER_RISE_RATE;
            nearest_point.last_touched_time = time;
            spawnSmokeAt(time, hit_point, camera_position, nearest_point.height_cap);
        }
        return metaball_squeeze;
    }

    if (!on_lava) return metaball_squeeze;

    const slot = touch_pool[pool_head];
    slot.x = hit_point.x;
    slot.y = hit_point.y;
    slot.z = hit_point.z;
    slot.height_cap = distance(hit_point, nearest_metaball_by_surface) * INTERACTION_PUSH_HEIGHT_SCALE;
    slot.last_touched_time = time;
    slot.active = true;
    pool_head = (pool_head + 1) % MAX_POINTS;

    spawnSmokeAt(time, hit_point, camera_position, slot.height_cap);

    return metaball_squeeze;
}

const active_touch_points = [];

export function stepInteractionAnimation(time) {
    active_touch_points.length = 0;
    for (let i = 0; i < MAX_POINTS; i++) {
        const point = touch_pool[i];
        if (!point.active) continue;
        const age = time - point.last_touched_time;
        if (age >= INTERACTION_DECAY_DURATION) {
            point.active = false;
            continue;
        }
        const decay_progress = smoothstep(0, INTERACTION_DECAY_DURATION, age);
        active_touch_points.push({
            x: point.x, y: point.y, z: point.z,
            strength: point.height_cap, radius: INTERACTION_BUMP_RADIUS, decay_progress,
        });
    }
    return active_touch_points;
}

const active_smoke_bursts = [];

export function stepInteractionSmoke(time) {
    active_smoke_bursts.length = 0;
    for (const burst of smoke_burst_pool) {
        if (!burst.active) continue;
        const press_duration = burst.last_active_time - burst.first_active_time;
        const fade_duration = clamp(
            press_duration * INTERACTION_SMOKE_FADE_PER_PRESS_SECOND,
            INTERACTION_SMOKE_MIN_BURST_DURATION,
            INTERACTION_SMOKE_MAX_BURST_DURATION,
        );
        const time_since_touched = time - burst.last_active_time;
        if (time_since_touched >= fade_duration) {
            burst.active = false;
            continue;
        }
        const elapsed = time - burst.first_active_time;
        const bloom = Math.min((time - burst.ember_start_time) / INTERACTION_SMOKE_BLOOM_DURATION, 1.0);
        const fade = 1.0 - time_since_touched / fade_duration;
        active_smoke_bursts.push({ x: burst.x, y: burst.y, z: burst.z, bloom, fade, elapsed, ember_strength: burst.ember_strength });
    }
    return active_smoke_bursts;
}
