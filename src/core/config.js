// Hardcoded tuning constants for geometry/animation/rendering.
// Unlike default_settings.json (initial values of the GUI-adjustable
// controls), these are values that can only be changed by editing the code.

// ─── Metaball field (geometry / rendering) ───────────────────────────────────

export const METABALL_SCALE_XY = 30.0;
export const METABALL_SCALE_Z = 30.0;
export const METABALL_RESOLUTION = 180;
export const METABALL_MAX_POLYGON_COUNT = 250_000;
export const METABALL_DEFAULT_ISOLATION = 50;
export const METABALL_LIGHT_POSITION = { x: 6, y: 8, z: 6 };

// ─── Metaball animation (lava flow simulation) ───────────────────────────────

export const METABALL_MAX_BALLS = 500;
export const METABALL_LEGACY_EFFECT_SCALE = 6.0;
export const METABALL_CRATER_X = 0.5;
export const METABALL_CRATER_Y = 0.45;  // (-1 - 0.36) / 30 + 0.5  (volcano tip: ground -6 + height 5 = -1)
export const METABALL_CRATER_Z = 0.5;
export const METABALL_GROUND_Y = 0.288; // (-6 - 0.36) / 30 + 0.5
export const METABALL_BALL_LIFETIME = 3.5; // seconds from crater to ground
export const METABALL_SECTORS = 6;
export const METABALL_WAVE_TRANSITION = 3.0; // seconds to ease the eruption intensity down/up around a wave pause, so dependents (e.g. the smoke plume) can fade smoothly instead of snapping

// ─── Volcano (geometry / rendering) ──────────────────────────────────────────

export const VOLCANO_PROFILE = [
    { x: 14.0, y: 0.0 },
    { x: 2.5, y: 5.0 },
    { x: 1.0, y: 4.2 },
];
export const VOLCANO_PROFILE_SUBDIVISIONS = 24;
export const VOLCANO_LATHE_SEGMENTS = 96;
export const VOLCANO_LIGHT_POSITION = { x: 5, y: 8, z: 5 };
export const VOLCANO_CRACK_FREQUENCY = 1.0; // crack-color frequency (tinting mask), not yet exposed in the GUI

// ─── Smoke / ash plume (points-based particle system) ────────────────────────

export const SMOKE_MAX_PARTICLES = 1400;
export const SMOKE_DEFAULT_COUNT = 816;
export const SMOKE_SPAWN_HEIGHT = 4.6; // height above the volcano's own origin where the crater opening sits
export const SMOKE_RISE_HEIGHT = 10.0; // world units a particle rises before being recycled
export const SMOKE_CORE_SPREAD = 5.0; // fixed radial (xy-plane) reach near the plume's axis - stays constant regardless of the spread setting, so the center never gets diluted; large so the ash blankets the volcano's summit area rather than forming a thin column
export const SMOKE_DEFAULT_SPREAD = 2.0; // extra outward reach for particles already away from the axis, so the plume visibly fills more space above the volcano
export const SMOKE_DEFAULT_RISE_SPEED = 0.4; // two fifths of the "normal" (1.0) pace, so the plume rises/cycles more slowly by default
export const SMOKE_LIFETIME = 12.0; // seconds from spawn (crater) to recycle (top of the plume)
export const SMOKE_FADE_IN_END = 0.15; // age fraction (of one lifetime) by which a particle reaches full opacity
export const SMOKE_FADE_OUT_START = 0.4; // age fraction at which the long, gentle fade-out towards invisible begins
export const SMOKE_PARTICLE_SIZE = 36; // base point size in pixels, before perspective attenuation
export const SMOKE_SIZE_MULT_MIN = 0.3; // per-particle random size multiplier range, so points vary in size instead of all looking identical
export const SMOKE_SIZE_MULT_MAX = 1.3;
export const SMOKE_COLOR_1 = 0x000000; // black ash near the crater - deliberately not reddish/brownish
export const SMOKE_COLOR_2 = 0xbfbfbb; // pale, neutral grey steam higher up - kept close to true grey (not warm/reddish) while still distinct in brightness from color 1
export const SMOKE_COLOR_3 = 0x2d1507; // sparse ember accent on a minority of freshly spawned particles - a dark reddish-brown tone, still well short of a red/orange glow
export const SMOKE_ACCENT_STRENGTH = 0.6; // caps how strongly the ember accent can ever tint a particle, keeping it a faint hint rather than a red highlight
export const SMOKE_ACCENT_THRESHOLD = 0.6; // only the top (1 - threshold) share of particles show any ember accent, keeping it a rare highlight rather than a uniform tint
export const SMOKE_PAUSED_ERUPTION_OPACITY = 0.35; // crater-plume opacity floor while no metaballs are being spawned (between lava waves) - thins the plume without hiding it entirely; the ambient haze is unaffected

// A share of particles act as ambient background ash, scattered evenly
// across a wide volume around the volcano instead of following the crater
// plume - so the whole space carries a faint haze of ash, not just the
// column directly above the opening.
export const SMOKE_AMBIENT_FRACTION = 0.3; // share of the particle pool that is ambient rather than part of the crater plume
export const SMOKE_AMBIENT_RADIUS = 22.0; // horizontal reach of the ambient haze - covers most of the visible space around the volcano
export const SMOKE_AMBIENT_HEIGHT_MIN = -3.0; // lowest ambient ash height (local space, relative to the crater opening)
export const SMOKE_AMBIENT_HEIGHT_MAX = 14.0; // highest ambient ash height
export const SMOKE_AMBIENT_OPACITY = 0.35; // opacity cap for ambient ash - a subtle haze that never competes with the dense plume at the crater
