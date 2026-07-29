// Hardcoded tuning constants for geometry/animation/rendering.
// Unlike default_settings.json (initial values of the GUI-adjustable
// controls), these are values that can only be changed by editing the code.

// ─── Camera (perspective camera + OrbitControls) ────────────────────────────

export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 1.7, z: 7.5 };
export const CAMERA_MIN_DISTANCE = 16;
export const CAMERA_MAX_DISTANCE = 36;
export const CAMERA_MIN_POLAR_ANGLE = 1;
export const CAMERA_MAX_POLAR_ANGLE = Math.PI / 2 - 0.1;
// ─── Ground (geometry / rendering) ───────────────────────────────────────────

export const GROUND_SIZE = 80;
export const GROUND_SEGMENTS = 160; // resolution the displacement noise is sampled at - needs to be well above the default 1x1 plane for bumps to read as terrain rather than a tilted flat tile
export const GROUND_CRACK_FREQUENCY = 0.06; // crack-color frequency, not yet exposed in the GUI - lower means fewer, more spaced-out cracks
export const GROUND_DEFAULT_DISPLACEMENT_SCALE = 1.26;
export const GROUND_DEFAULT_DISPLACEMENT_FREQUENCY = 0.1;
export const GROUND_DEFAULT_CRACK_SOFTNESS = 0.015; // crackPattern()'s crack_width

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
export const VOLCANO_DEFAULT_DISPLACEMENT_SCALE = 2.5;
export const VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY = 0.5;

// ─── Sun (red PointLight + matching volcano shader tint) ────────────────────

export const SUN_LIGHT_POSITION = { x: 12, y: 10, z: -30 }; // further out along the same line of sight as before and higher in the sky, while staying inside the default camera frustum
export const SUN_LIGHT_COLOR = 0xff1020; // deep red, only a faint hint of pink left
export const SUN_CORE_COLOR = 0xff3311; // red core the turbulent sun surface blends towards - still varied, but red rather than orange
export const SUN_BLOOD_ORANGE_COLOR = 0xcc2200; // second, independently-animated noise layer's color, for extra patch variation on top of the core/edge blend
export const SUN_ASH_TINT_COLOR = 0xdd1100; // separate, blue-free red for tinting the ash - blending SUN_LIGHT_COLOR's slight blue over the pale smoke read as pink instead of red
export const SUN_LIGHT_INTENSITY = 4.0;
export const SUN_LIGHT_DISTANCE = 60;
export const SUN_VISUAL_RADIUS = 2.5; // radius of the sun disc - large enough to read clearly as a sun rather than a distant dot
export const SUN_DEFAULT_STRENGTH = 0.06; // shared default for ground/volcano/smoke's u_sun_strength
export const SUN_DEFAULT_FOCUS = 8.0; // shared default for ground/volcano's u_sun_focus

// Orbit: the sun slowly circles the volcano at a fixed height/radius (both derived from
// SUN_LIGHT_POSITION, so the starting frame looks exactly as before) instead of sitting still.
export const SUN_ORBIT_RADIUS = Math.sqrt(SUN_LIGHT_POSITION.x ** 2 + SUN_LIGHT_POSITION.z ** 2);
export const SUN_ORBIT_HEIGHT = SUN_LIGHT_POSITION.y;
export const SUN_ORBIT_START_ANGLE = Math.atan2(SUN_LIGHT_POSITION.z, SUN_LIGHT_POSITION.x);
export const SUN_ORBIT_PERIOD = 600; // seconds for one full revolution - slow enough to read as ambient drift, not a spinning light
export const SUN_ORBIT_SPEED = (2 * Math.PI) / SUN_ORBIT_PERIOD;

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
export const SMOKE_COLOR_2 = 0x515150; // darker neutral grey steam higher up - kept close to true grey (not warm/reddish) while still distinct in brightness from color 1
export const SMOKE_COLOR_3 = 0xff5b00; // sparse bright ember accent on a minority of freshly spawned particles
export const SMOKE_ACCENT_STRENGTH = 0.6; // caps how strongly the ember accent can ever tint a particle, keeping it a faint hint rather than a red highlight
export const SMOKE_ACCENT_THRESHOLD = 0.8; // only the top (1 - threshold) share of particles show any ember accent/glow, keeping it a rare highlight rather than a uniform tint
export const SMOKE_EMBER_COOLING_TIME = 20.0; // seconds to cool to grey, independent of u_lifetime/u_rise_speed
export const SMOKE_EMBER_COOLING_MULT_MIN = 0.5; // per-particle multiplier range for SMOKE_EMBER_COOLING_TIME, mean 1.0
export const SMOKE_EMBER_COOLING_MULT_MAX = 1.5;
export const SMOKE_EMBER_GLOW_STRENGTH = 6.0; // HDR multiplier added on top of the ember accent so freshly spawned, high-accent particles push past the bloom pass's threshold and read as a small light source, not yet exposed in the GUI
export const SMOKE_EMBER_GLOW_MULT_MIN = 0.4; // per-particle random multiplier range applied to SMOKE_EMBER_GLOW_STRENGTH, so ember particles glow with varying brightness instead of all matching one fixed intensity
export const SMOKE_EMBER_GLOW_MULT_MAX = 1.8;
export const SMOKE_PAUSED_ERUPTION_OPACITY = 0.35; // crater-plume opacity floor while no metaballs are being spawned (between lava waves) - thins the plume without hiding it entirely; the ambient haze is unaffected

export const SMOKE_AMBIENT_FRACTION = 0.3; // share of particles scattered around the volcano as background haze, rather than following the crater plume
export const SMOKE_AMBIENT_RADIUS = 22.0; // horizontal reach of the ambient haze - covers most of the visible space around the volcano
export const SMOKE_AMBIENT_HEIGHT_MIN = -3.0; // lowest ambient ash height (local space, relative to the crater opening)
export const SMOKE_AMBIENT_HEIGHT_MAX = 14.0; // highest ambient ash height
export const SMOKE_AMBIENT_OPACITY = 0.35; // opacity cap for ambient ash - a subtle haze that never competes with the dense plume at the crater

// ─── Key light + ambient (scene lighting set up in main.js) ─────────────────

export const KEY_LIGHT_COLOR = 0xff7733;
export const KEY_LIGHT_INTENSITY = 1.3;
export const AMBIENT_LIGHT_COLOR = 0x550000;
export const AMBIENT_LIGHT_INTENSITY = 0.9;

export const KEY_LIGHT_SHADOW_MAP_SIZE = 2048;
export const KEY_LIGHT_SHADOW_MARGIN = 10;
export const KEY_LIGHT_SHADOW_FRUSTUM = GROUND_SIZE / 2 + KEY_LIGHT_SHADOW_MARGIN;
export const KEY_LIGHT_SHADOW_NEAR = 1;
export const KEY_LIGHT_SHADOW_FAR = 100;
export const KEY_LIGHT_SHADOW_BIAS = -0.0015; // avoids shadow acne

// ─── God rays (screen-space light shafts from the sun, post-processing) ─────

export const GOD_RAYS_RESOLUTION_SCALE = 0.5; // occlusion/generation buffers render at half resolution
export const GOD_RAYS_NUM_SAMPLES = 60;
export const GOD_RAYS_DENSITY = 1.2;
export const GOD_RAYS_DECAY = 0.898;
export const GOD_RAYS_WEIGHT = 0.24;
export const GOD_RAYS_EXPOSURE = 0.64;
export const GOD_RAYS_TINT_COLOR = 0xff0000;

// ─── Bloom (post-processing) ─────────────────────────────────────────────────

export const BLOOM_STRENGTH = 0.8;
export const BLOOM_RADIUS = 0.5;
export const BLOOM_THRESHOLD = 0.3;
export const BLOOM_TINT_COLOR = { x: 1.0, y: 0.45, z: 0.05 };
