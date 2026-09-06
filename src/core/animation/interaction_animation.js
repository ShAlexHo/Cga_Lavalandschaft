import { smoothstep } from './math_utils.js';
import {
    INTERACTION_MAX_POINTS,
    INTERACTION_DECAY_DURATION,
    INTERACTION_BUMP_RADIUS,
    INTERACTION_DWELL_POSITION_TOLERANCE,
    INTERACTION_LAVA_DETECTION_TOLERANCE,
    INTERACTION_MIN_POINT_SPACING,
    INTERACTION_METABALL_CENTER_THRESHOLD,
    INTERACTION_METABALL_SHRINK_DURATION,
    INTERACTION_METABALL_SHRINK_FRACTION,
    INTERACTION_SMOKE_MAX_BURSTS,
    INTERACTION_SMOKE_SURFACE_OFFSET,
    INTERACTION_SMOKE_PUSH_INFLUENCE,
    INTERACTION_SMOKE_BURST_DURATION,
    INTERACTION_SMOKE_BLOOM_DURATION,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export const MAX_POINTS = INTERACTION_MAX_POINTS;

export const settings = {
    enabled: DEFAULT_SETTINGS.interactionMode,
};

// ─── shared helpers ───────────────────────────────────────────────────────────

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

// ─── touch bump pool (the volcano-surface push at each active touch point) ──

const touch_pool = Array.from({ length: MAX_POINTS }, () => ({
    x: 0, y: 0, z: 0, height_cap: 0, last_touched_time: -Infinity, active: false,
}));
let pool_head = 0;

// ─── lava-presence gating (is hit_point actually on the rendered metaball surface) ──

// Replicates MarchingCubes' own field equation (see ballToWorldRadius in metaball_geometry.js) in
// world space: each ball contributes max(0, world_radius² * (isolation + subtract) / dist² -
// subtract), summed across every ball. This correctly blends overlapping metaballs (a point outside
// any single ball's own reach can still be genuinely on lava once several overlapping balls are
// summed). Compared against isolation * INTERACTION_LAVA_DETECTION_TOLERANCE rather than the raw
// isolation - pinpointing hit_point against the true rendered surface is imprecise to begin with
// (raycasting a separate mesh, blended balls, shrinking radii mid-squeeze), so a bit of slack keeps
// the gate from feeling overly strict without letting it register far from any metaball at all.
export function isOnLava(point, metaballs) {
    let field_value = 0;
    for (const metaball of metaballs) {
        const distance_squared = Math.max(distance(point, metaball) ** 2, 0.0001);
        const contribution = (metaball.radius * metaball.radius) * (metaball.isolation + metaball.subtract) / distance_squared - metaball.subtract;
        if (contribution > 0) field_value += contribution;
    }
    return metaballs.length > 0 && field_value >= metaballs[0].isolation * INTERACTION_LAVA_DETECTION_TOLERANCE;
}

// ─── metaball center-press tracking (how long the same metaball's center has been pressed) ──

// Tracks how long the same metaball has been continuously pressed at its visual center, matched via
// INTERACTION_DWELL_POSITION_TOLERANCE so drift as the ball itself flows along the surface doesn't
// count as a new press. Returns how much MORE to shrink just this frame (zero on the very first frame
// of a fresh press) rather than a total target fraction - a ball that was already shrunk in an
// earlier press session keeps its size and resumes shrinking further, instead of popping back to
// full size the instant it's pressed again.
let center_press = null; // { x, y, z, last_press_time } - null whenever nothing is currently centered

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

// Call on a fresh mouse-down so an in-progress center press doesn't carry over from an earlier,
// unrelated press.
export function resetTouchSession() {
    center_press = null;
}

// ─── impact smoke bursts (spawned above a touch while it's on a metaball) ──

const smoke_burst_pool = Array.from({ length: INTERACTION_SMOKE_MAX_BURSTS }, () => ({
    x: 0, y: 0, z: 0, first_active_time: -Infinity, last_active_time: -Infinity, active: false,
}));
let smoke_burst_head = 0;

// Keeps a burst alive and following position for as long as it's called again before
// INTERACTION_SMOKE_BURST_DURATION elapses; only once the calls stop does it fade out.
function updateSmokeBurst(time, position) {
    const { record: nearest, distance: nearest_distance } = findNearestActive(smoke_burst_pool, position);
    if (nearest && nearest_distance <= INTERACTION_DWELL_POSITION_TOLERANCE) {
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
    slot.active = true;
    smoke_burst_head = (smoke_burst_head + 1) % INTERACTION_SMOKE_MAX_BURSTS;
}

// hit_point comes from raycasting the volcano's raw, undisplaced geometry - it doesn't account for
// the very push the vertex shader (volcano.vert) applies toward the camera at this exact spot while
// it's being touched. Without this, the smoke would appear to originate from behind/below the bump
// the touch itself just raised. push_amount is the touch's own height_cap, which is exactly what
// volcano.vert's falloff reduces to at distance 0 from a touch's own center.
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

// Lifts the origin above the (pushed) surface so the smoke hovers over the volcano instead of
// clipping into it.
function smokeOriginAt(surface_point) {
    return { x: surface_point.x, y: surface_point.y + INTERACTION_SMOKE_SURFACE_OFFSET, z: surface_point.z };
}

function spawnSmokeAt(time, hit_point, camera_position, height_cap) {
    const surface_point = pushedSurfacePoint(hit_point, camera_position, height_cap * INTERACTION_SMOKE_PUSH_INFLUENCE);
    updateSmokeBurst(time, smokeOriginAt(surface_point));
}

// ─── public API ───────────────────────────────────────────────────────────────

// Only registers a bump/smoke where hit_point is genuinely on the rendered lava surface (isOnLava);
// which metaball is nearest by surface distance (center minus radius) still picks the height cap, so
// edge touches cap just as reliably as center ones, at the raw center distance rather than the
// (near-zero) surface distance. Returns a metaball squeeze signal ({x,y,z,shrink_increment}, by
// view-ray distance) when the touch is on a metaball's visual center, else null - independent of
// whether a bump was created, refreshed, or gated out. A touch that keeps landing on lava keeps its
// smoke burst following and alive; moving off lava (or releasing) lets both fade out normally.
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
    // Squeezing a metaball (confirmed by view-ray distance) counts as being on lava too, even if the
    // raw-distance field check alone briefly fails as the ball's own radius shrinks under repeated
    // squeezing - it's still genuinely there, just thinner, and the touch is still precisely centered
    // on it. Without this, a shrinking ball would abruptly cut off its own smoke mid-squeeze.
    const on_lava = isOnLava(hit_point, metaballs) || metaball_squeeze !== null;

    const { record: nearest_point, distance: nearest_point_distance } = findNearestActive(touch_pool, hit_point);
    if (nearest_point && nearest_point_distance <= INTERACTION_MIN_POINT_SPACING) {
        if (on_lava) {
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
    slot.height_cap = distance(hit_point, nearest_metaball_by_surface);
    slot.last_touched_time = time;
    slot.active = true;
    pool_head = (pool_head + 1) % MAX_POINTS;

    spawnSmokeAt(time, hit_point, camera_position, slot.height_cap);

    return metaball_squeeze;
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

const active_smoke_bursts = [];

// bloom tracks the one-time hot-ember-to-smoke color cooldown; fade only starts once the burst stops
// being touched, reaching 0 - and eviction - after INTERACTION_SMOKE_BURST_DURATION. elapsed is
// unbounded and drives the shader's per-particle rise-and-fade cycling (see impact_smoke.vert), so
// staying longer keeps adding more overlapping puffs instead of growing one single mass.
export function stepInteractionSmoke(time) {
    active_smoke_bursts.length = 0;
    for (const burst of smoke_burst_pool) {
        if (!burst.active) continue;
        const time_since_touched = time - burst.last_active_time;
        if (time_since_touched >= INTERACTION_SMOKE_BURST_DURATION) {
            burst.active = false;
            continue;
        }
        const elapsed = time - burst.first_active_time;
        const bloom = Math.min(elapsed / INTERACTION_SMOKE_BLOOM_DURATION, 1.0);
        const fade = 1.0 - time_since_touched / INTERACTION_SMOKE_BURST_DURATION;
        active_smoke_bursts.push({ x: burst.x, y: burst.y, z: burst.z, bloom, fade, elapsed });
    }
    return active_smoke_bursts;
}
