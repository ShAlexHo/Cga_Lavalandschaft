import { smoothstep } from './math_utils.js';
import {
    INTERACTION_MAX_POINTS,
    INTERACTION_DECAY_DURATION,
    INTERACTION_BUMP_RADIUS,
    INTERACTION_METABALL_PROXIMITY_THRESHOLD_BASE,
    INTERACTION_METABALL_PROXIMITY_GROWTH_RATE,
    INTERACTION_DWELL_POSITION_TOLERANCE,
    INTERACTION_DWELL_POOL_SIZE,
    INTERACTION_MIN_POINT_SPACING,
    INTERACTION_METABALL_REMOVE_THRESHOLD,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export const MAX_POINTS = INTERACTION_MAX_POINTS;

export const settings = {
    enabled: DEFAULT_SETTINGS.interactionMode,
};

const touch_pool = Array.from({ length: MAX_POINTS }, () => ({
    x: 0, y: 0, z: 0, height_cap: 0, last_touched_time: -Infinity, active: false,
}));
let pool_head = 0;

// Per-spot dwell-start time, so revisiting an earlier spot keeps growing its own threshold.
const dwell_pool = Array.from({ length: INTERACTION_DWELL_POOL_SIZE }, () => ({
    x: 0, y: 0, z: 0, created_time: 0, active: false,
}));
let dwell_pool_head = 0;

// Call on a fresh mouse-down so growth doesn't carry over from an earlier, unrelated press.
export function resetDwellTracking() {
    for (const record of dwell_pool) record.active = false;
}

function distance(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// How far off-center point looks on screen along the camera ray through ray_point, regardless of depth.
function distanceFromViewRay(camera_position, ray_point, point) {
    const direction_x = ray_point.x - camera_position.x;
    const direction_y = ray_point.y - camera_position.y;
    const direction_z = ray_point.z - camera_position.z;
    const direction_length = Math.sqrt(direction_x ** 2 + direction_y ** 2 + direction_z ** 2);
    const unit_x = direction_x / direction_length, unit_y = direction_y / direction_length, unit_z = direction_z / direction_length;

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

// Returns the active pool entry closest to point, or null if the pool has none active.
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

// Gating distance for hit_point: base threshold plus growth since that spot's dwell record started.
function getProximityThreshold(time, hit_point) {
    let { record: nearest, distance: nearest_distance } = findNearestActive(dwell_pool, hit_point);
    if (!nearest || nearest_distance > INTERACTION_DWELL_POSITION_TOLERANCE) {
        nearest = dwell_pool[dwell_pool_head];
        nearest.x = hit_point.x;
        nearest.y = hit_point.y;
        nearest.z = hit_point.z;
        nearest.created_time = time;
        nearest.active = true;
        dwell_pool_head = (dwell_pool_head + 1) % INTERACTION_DWELL_POOL_SIZE;
    }
    const dwell_duration = time - nearest.created_time;
    return INTERACTION_METABALL_PROXIMITY_THRESHOLD_BASE + dwell_duration * INTERACTION_METABALL_PROXIMITY_GROWTH_RATE;
}

// Gates registration by surface distance (center minus radius) so edge touches work as reliably as
// center ones; the push is still capped at the raw center distance, since surface distance would be
// ~0 for anything that just barely passed the gate. Returns a metaball position to remove (by
// view-ray distance) when the touch landed on one, else null - independent of whether a bump was
// created or refreshed.
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
    const metaball_to_remove = nearest_view_distance <= INTERACTION_METABALL_REMOVE_THRESHOLD
        ? { x: nearest_metaball_by_view.x, y: nearest_metaball_by_view.y, z: nearest_metaball_by_view.z }
        : null;

    const { record: nearest_point, distance: nearest_point_distance } = findNearestActive(touch_pool, hit_point);
    if (nearest_point && nearest_point_distance <= INTERACTION_MIN_POINT_SPACING) {
        nearest_point.last_touched_time = time;
        return metaball_to_remove;
    }

    const proximity_threshold = getProximityThreshold(time, hit_point);
    if (nearest_surface_distance > proximity_threshold) return metaball_to_remove;

    const slot = touch_pool[pool_head];
    slot.x = hit_point.x;
    slot.y = hit_point.y;
    slot.z = hit_point.z;
    slot.height_cap = distance(hit_point, nearest_metaball_by_surface);
    slot.last_touched_time = time;
    slot.active = true;
    pool_head = (pool_head + 1) % MAX_POINTS;

    return metaball_to_remove;
}

const active_touch_points = [];

// Radius (not strength) shrinks to zero as a point ages past INTERACTION_DECAY_DURATION, then it's evicted.
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
        const shrink = 1.0 - smoothstep(0, INTERACTION_DECAY_DURATION, age);
        const radius = Math.max(INTERACTION_BUMP_RADIUS * shrink, 0.0001);
        active_touch_points.push({ x: point.x, y: point.y, z: point.z, strength: point.height_cap, radius });
    }
    return active_touch_points;
}
