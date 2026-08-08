// Hardcoded tuning constants for geometry/animation/rendering. Unlike
// default_settings.json (GUI defaults), these need a code change to alter.

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
export const GROUND_SEGMENTS = 160; // must be well above 1x1, or bumps read as a tilted flat plane
export const GROUND_CRACK_FREQUENCY = 0.06; // not yet exposed in the GUI

// ─── Metaball field (geometry / rendering) ───────────────────────────────────

export const METABALL_SCALE_XY = 30.0;
export const METABALL_SCALE_Z = 30.0;
export const METABALL_RESOLUTION = 180;
export const METABALL_MAX_POLYGON_COUNT = 250_000;
export const METABALL_LIGHT_POSITION = { x: 6, y: 8, z: 6 };

// ─── Metaball animation (lava flow simulation) ───────────────────────────────

export const METABALL_MAX_BALLS = 500;
export const METABALL_LEGACY_EFFECT_SCALE = 6.0;
export const METABALL_CRATER_X = 0.5;
export const METABALL_CRATER_Y = 0.45; // volcano tip: ground -6 + height 5 = -1 -> (-1 - 0.36) / 30 + 0.5
export const METABALL_CRATER_Z = 0.5;
export const METABALL_GROUND_Y = 0.288; // (-6 - 0.36) / 30 + 0.5
export const METABALL_BALL_LIFETIME = 3.5; // seconds, crater to ground
export const METABALL_SECTORS = 6;
export const METABALL_WAVE_TRANSITION = 3.0; // eases eruption intensity so the smoke plume fades instead of snapping

// ─── Volcano (geometry / rendering) ──────────────────────────────────────────

export const VOLCANO_PROFILE = [
    { x: 14.0, y: 0.0 },
    { x: 2.5, y: 5.0 },
    { x: 1.0, y: 4.2 },
];
export const VOLCANO_PROFILE_SUBDIVISIONS = 24;
export const VOLCANO_LATHE_SEGMENTS = 96;
export const VOLCANO_LIGHT_POSITION = { x: 5, y: 8, z: 5 };

// ─── Sun (red PointLight + matching volcano shader tint) ────────────────────

export const SUN_LIGHT_POSITION = { x: 12, y: 10, z: -30 }; // stays inside the default camera frustum
export const SUN_LIGHT_COLOR = 0xff1020;
export const SUN_CORE_COLOR = 0xff3311;
export const SUN_BLOOD_ORANGE_COLOR = 0xcc2200; // second, independently-animated noise layer
export const SUN_ASH_TINT_COLOR = 0xdd1100; // blue-free red, or it reads pink over the pale smoke
export const SUN_LIGHT_INTENSITY = 4.0;
export const SUN_LIGHT_DISTANCE = 60;
export const SUN_VISUAL_RADIUS = 2.5;

// orbits the volcano at a fixed height/radius derived from SUN_LIGHT_POSITION
export const SUN_ORBIT_RADIUS = Math.sqrt(SUN_LIGHT_POSITION.x ** 2 + SUN_LIGHT_POSITION.z ** 2);
export const SUN_ORBIT_HEIGHT = SUN_LIGHT_POSITION.y;
export const SUN_ORBIT_START_ANGLE = Math.atan2(SUN_LIGHT_POSITION.z, SUN_LIGHT_POSITION.x);
export const SUN_ORBIT_PERIOD = 600; // seconds per revolution
export const SUN_ORBIT_SPEED = (2 * Math.PI) / SUN_ORBIT_PERIOD;

// ─── Smoke / ash plume (points-based particle system) ────────────────────────

export const SMOKE_MAX_PARTICLES = 1400;
export const SMOKE_SPAWN_HEIGHT = 4.6; // above the volcano's own origin, where the crater opening sits
export const SMOKE_RISE_HEIGHT = 10.0;
export const SMOKE_CORE_SPREAD = 5.0; // fixed reach near the axis so the center never gets diluted
export const SMOKE_LIFETIME = 12.0;
export const SMOKE_FADE_IN_END = 0.15; // age fraction to reach full opacity
export const SMOKE_FADE_OUT_START = 0.4; // age fraction where fade-out begins
export const SMOKE_SIZE_MULT_MIN = 0.3;
export const SMOKE_SIZE_MULT_MAX = 1.3;
export const SMOKE_ACCENT_STRENGTH = 0.6; // caps the ember tint
export const SMOKE_ACCENT_THRESHOLD = 0.8; // only the top (1 - threshold) share gets any accent
export const SMOKE_EMBER_COOLING_MULT_MIN = 0.5;
export const SMOKE_EMBER_COOLING_MULT_MAX = 1.5;
export const SMOKE_EMBER_GLOW_STRENGTH = 6.0; // HDR multiplier, pushes past the bloom threshold
export const SMOKE_EMBER_GLOW_MULT_MIN = 0.4;
export const SMOKE_EMBER_GLOW_MULT_MAX = 1.8;
export const SMOKE_PAUSED_ERUPTION_OPACITY = 0.35; // crater-plume floor between lava waves

export const SMOKE_AMBIENT_FRACTION = 0.3; // share scattered as background haze, not the crater plume
export const SMOKE_AMBIENT_RADIUS = 22.0;
export const SMOKE_AMBIENT_HEIGHT_MIN = -3.0;
export const SMOKE_AMBIENT_HEIGHT_MAX = 14.0;
export const SMOKE_AMBIENT_OPACITY = 0.35;

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

// ─── Bloom (post-processing) ─────────────────────────────────────────────────

export const BLOOM_TINT_COLOR = { x: 1.0, y: 0.45, z: 0.05 };
