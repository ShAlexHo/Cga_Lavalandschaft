// Hardcoded tuning constants for geometry/animation/rendering. Unlike
// default_settings.json (GUI defaults), these need a code change to alter.

// ─── Randomness (seeded PRNG in rand.js) ─────────────────────────────────────

export const RANDOM_SEED = 42; // fixed, so particle placement/variance is identical on every load

// ─── Camera (perspective camera + OrbitControls) ────────────────────────────

export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 2000; // must clear SUN_LIGHT_POSITION's distance
export const CAMERA_INITIAL_POSITION = { x: 0, y: 1.7, z: 7.5 };
export const CAMERA_MIN_DISTANCE = 16;
export const CAMERA_MAX_DISTANCE = 36;
export const CAMERA_MIN_POLAR_ANGLE = 1;
export const CAMERA_MAX_POLAR_ANGLE = Math.PI / 2 - 0.1;
export const CAMERA_VISIBLE_ARC_DEGREES = 270; // objects outside this arc, centered on the camera, are culled (metaballs, volcano touch points)
export const CAMERA_VISIBILITY_FADE_DEGREES = 10; // fade width at the arc's edge, so an object fades out instead of popping as the camera orbits

// ─── Ground (geometry / rendering) ───────────────────────────────────────────

export const GROUND_SIZE = 160;
export const GROUND_SEGMENTS = 160; // must be well above 1x1, or bumps read as a tilted flat plane
export const GROUND_CRACK_FREQUENCY = 0.06; // not yet exposed in the GUI
export const GROUND_CRACK_DENSITY_FADE_START = GROUND_SIZE / 4; // world-distance from the volcano where crack density starts thinning out
export const GROUND_CRACK_DENSITY_FADE_END = GROUND_SIZE / 2; // world-distance from the volcano beyond which no cracks remain (the ground's own edge)
export const GROUND_EDGE_FADE_START = GROUND_SIZE / 2 - 25; // world-distance from the center where the ground starts fading to the sky color
export const GROUND_EDGE_FADE_END = GROUND_SIZE / 2 - 1; // world-distance from the center where it's fully sky-colored - inside GROUND_SIZE / 2 in every direction, so the plane's rectangular edge (corners included) never shows against the sky

// ─── Metaball field (geometry / rendering) ───────────────────────────────────

export const METABALL_SCALE_XY = 30.0;
export const METABALL_SCALE_Z = 30.0;
export const METABALL_LIGHT_POSITION = { x: 6, y: 8, z: 6 };

export const METABALL_GPU_MAX_BALLS = 300; // GLSL array length - extra balls silently stop rendering
export const METABALL_RAYMARCH_MAX_STEPS = 128; // compile-time GLSL loop bound - u_raymarch_steps must not exceed this
export const METABALL_RAYMARCH_STEPS = 48;
export const METABALL_RAYMARCH_NORMAL_EPSILON = 0.01;
// Raymarch proxy box, local (2*field-1) space - Y tightened to the crater-to-ground range, X/Z at flow_z_radius's max.
export const METABALL_PROXY_HALF_EXTENT_X = 1.0;
export const METABALL_PROXY_HALF_EXTENT_Y = 0.4;
export const METABALL_PROXY_HALF_EXTENT_Z = 1.0;
export const METABALL_PROXY_CENTER_X = 0.0;
export const METABALL_PROXY_CENTER_Y = -0.4;
export const METABALL_PROXY_CENTER_Z = 0.0;
export const METABALL_DISPLACEMENT_MAX_CAMERA_DISTANCE = CAMERA_MIN_DISTANCE + 0.5 * (CAMERA_MAX_DISTANCE - CAMERA_MIN_DISTANCE); // halfway through the zoom range, X/Z-plane distance to the volcano
export const METABALL_BACKGROUND_FADE_NEAR = 18.0; // camera distance (world units) where lava starts dimming toward the background
export const METABALL_BACKGROUND_FADE_FAR = 38.0; // camera distance beyond which lava is fully dimmed

// ─── Metaball animation (lava flow simulation) ───────────────────────────────

export const METABALL_MAX_BALLS = 500;
export const METABALL_STRENGTH_SCALE = 7.2; // scales ball strength; radius ∝ this linearly (see BALL_STRENGTH in metaball_animation.js)
export const METABALL_CRATER_X = 0.5;
export const METABALL_CRATER_Y = 0.45; // volcano tip: ground -6 + height 5 = -1 -> (-1 - 0.36) / 30 + 0.5
export const METABALL_CRATER_Z = 0.5;
export const METABALL_GROUND_Y = 0.288; // (-6 - 0.36) / 30 + 0.5
export const METABALL_BALL_LIFETIME = 3.5; // seconds, crater to ground
export const METABALL_SPAWN_INTERVAL = 36.0; // seconds between new metaballs joining a wave
export const METABALL_SECTORS = 6;
export const METABALL_WAVE_TRANSITION = 3.0; // eases eruption intensity so the smoke plume fades instead of snapping

// ─── Interaction mode (mouse-driven volcano surface push) ───────────────────

export const INTERACTION_MAX_POINTS = 64; // GLSL array length - must match volcano.vert
export const INTERACTION_DECAY_DURATION = 78.0; // seconds for a touch to fade out, wiping from nearest-to-the-volcano's-axis outward (see INTERACTION_DECAY_WIPE_BAND_FRACTION)
export const INTERACTION_BUMP_RADIUS = 0.5; // world units
export const INTERACTION_PUSH_HEIGHT_SCALE = 2.0; // multiplies the raw touch-to-nearest-metaball distance that caps how far the surface (and its smoke) gets pushed, so the rise can go higher than that raw distance alone would allow
export const INTERACTION_HOVER_RISE_RATE = 0.05; // world units per second added to an already-active touch point's push height while the mouse keeps hovering back over it, held down - lets repeatedly passing over the same spot build it up gradually beyond its initial cap
export const INTERACTION_HOVER_RISE_MAX_DELTA = 0.2; // seconds; caps the time gap used for the above, so returning to a spot after a long pause adds only a small, bounded bump instead of a sudden jump
export const INTERACTION_PLATEAU_FRACTION = 0.3; // share of the radius held at full push height before falling off
export const INTERACTION_DECAY_WIPE_BAND_FRACTION = 0.3; // softness of the axis-to-outward decay wipe, as a fraction of the bump radius
export const INTERACTION_DECAY_WIPE_NOISE_STRENGTH = 0.5; // fraction of the bump radius the decay wipe front is perturbed by, so it eats away irregularly instead of a perfectly even ring
export const INTERACTION_DECAY_WIPE_NOISE_FREQUENCY = 6.0; // world-space noise frequency driving the above
export const INTERACTION_DWELL_POSITION_TOLERANCE = 0.5; // world units; "still the same spot" radius
export const INTERACTION_LAVA_DETECTION_TOLERANCE = 0.2; // fraction of the true isosurface field value needed to count as "on lava" - lower is more forgiving, extending each ball's effective reach a bit beyond its rendered surface
export const INTERACTION_METABALL_CENTER_THRESHOLD = 0.5; // world units; view-ray distance under which a touch counts as pressing a metaball's visual center
export const INTERACTION_METABALL_SHRINK_DURATION = 3.0; // seconds of continuous center-pressing to shrink a metaball's radius by SHRINK_FRACTION
export const INTERACTION_METABALL_SHRINK_FRACTION = 0.55; // fraction of radius removed per SHRINK_DURATION of continuous center-pressing

export const INTERACTION_SMOKE_SURFACE_OFFSET = 0.1; // world units lifted above the touched point, so smoke reads as hovering over the surface instead of clipping into it
export const INTERACTION_SMOKE_PUSH_INFLUENCE = 0.3; // fraction of the touch's camera-ward push applied to the smoke's origin - kept low so smoke stays close to the actual local surface (the "environment") rather than the push direction, which briefly points downward on steep, sloped parts of the volcano
export const INTERACTION_SMOKE_FADE_PER_PRESS_SECOND = 0.5; // seconds of fade-out earned per second the touch was actively held, so a longer press leaves the smoke lingering longer after release
export const INTERACTION_SMOKE_MIN_BURST_DURATION = 1.0; // fade-out floor, so even a brief tap still leaves a visible trail
export const INTERACTION_SMOKE_MAX_BURST_DURATION = 3.0; // fade-out ceiling, so an extremely long press doesn't linger forever
export const INTERACTION_SMOKE_BLOOM_DURATION = 0.1; // seconds for the hot ember tint to cool to plain smoke once the touch stops genuinely moving - fast, almost immediate
export const INTERACTION_SMOKE_STILLNESS_TOLERANCE = 0.05; // world units; movement below this counts as ordinary mouse jitter while "holding still", not genuine dragging
export const INTERACTION_SMOKE_EMBER_STRENGTH_DECAY = 0.7; // each ember refresh after the first is multiplied by this, so repeated moving-then-stopping shows a progressively weaker ember tint than the very first time
export const INTERACTION_SMOKE_MIN_EMBER_STRENGTH = 0.2; // floor for the above - never fully extinguishes the ember tint
export const INTERACTION_SMOKE_HAZE_GROWTH_DURATION = 4.0; // seconds of continuous pressing for the grey background haze to reach its full opacity
export const INTERACTION_SMOKE_HAZE_MAX_OPACITY = 0.5; // extra opacity the grey-leaning background particles gain once fully hazy
export const INTERACTION_SMOKE_RISE_BOOST_DURATION = 4.0; // seconds of continuous pressing for the rise boost below to reach its max
export const INTERACTION_SMOKE_MAX_RISE_BOOST = 2.5; // how much higher/faster each puff cycle rises once the touch has been held this long
export const INTERACTION_SMOKE_EMBER_RADIUS_FRACTION = 0.3; // fraction of each puff's own rise-and-spread cycle (hence radius) that still reads as orange; beyond that, already grey - independent of bloom timing, so grey smoke exists (and gently rises) from the very first frame
export const INTERACTION_SMOKE_GREY_VARIANCE_MIN = 0.6; // once a particle is fully grey, it settles at its own fixed shade somewhere between this and 1.0 (COLOR_1..COLOR_2) instead of every grey particle converging on the exact same near-black tone
export const INTERACTION_SMOKE_MAX_BURSTS = 6; // GLSL array length - must match impact_smoke.vert
export const INTERACTION_SMOKE_PARTICLES_PER_BURST = 40;
export const INTERACTION_SMOKE_PARTICLE_LIFETIME = 1.2; // seconds per individual puff's own rise-and-fade cycle, repeating for as long as the burst lives - more time touching means more puffs, not one ever-growing blob
export const INTERACTION_SMOKE_SPREAD_RADIUS = 1.2; // world units, reached once per puff cycle
export const INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION = 0.6; // fraction of SPREAD_RADIUS a puff already has right at the start of its cycle, instead of converging to a point
export const INTERACTION_SMOKE_RISE_SPEED = 1.2; // world units per second, within a single puff cycle
export const INTERACTION_SMOKE_PARTICLE_SIZE = 60;
export const INTERACTION_SMOKE_COLOR_1 = '#a39a8f'; // fresh puff - light warm ash-grey (darker/warmer than plain white)
export const INTERACTION_SMOKE_COLOR_2 = '#221e1a'; // as it disperses - near-black, warm-toned
export const INTERACTION_MIN_POINT_SPACING = 0.15; // world units; a touch within this distance of an existing active point refreshes it instead of spawning a new one - kept well under INTERACTION_BUMP_RADIUS so consecutive points along a drag overlap heavily rather than reading as separate dots

// ─── Volcano (geometry / rendering) ──────────────────────────────────────────

export const VOLCANO_PROFILE = [
    { x: 14.0, y: 0.0 },
    { x: 2.5, y: 5.0 },
    { x: 1.0, y: 4.2 },
];
export const VOLCANO_PROFILE_SUBDIVISIONS = 48; // raised alongside VOLCANO_LATHE_SEGMENTS so the small-radius interaction bump has enough nearby vertices to read as round instead of a single sharp spike
export const VOLCANO_LATHE_SEGMENTS = 240;
export const VOLCANO_LIGHT_POSITION = { x: 5, y: 8, z: 5 };

// ─── Sun (red PointLight + matching volcano shader tint) ────────────────────

const SUN_DISTANCE_SCALE = 24; // u_sun_position only ever feeds a direction in ground.frag/volcano.frag, so scaling it uniformly leaves lighting unchanged
export const SUN_LIGHT_POSITION = { x: 12 * SUN_DISTANCE_SCALE, y: 10 * SUN_DISTANCE_SCALE, z: -30 * SUN_DISTANCE_SCALE };
export const SUN_LIGHT_COLOR = 0xff1020;
export const SUN_CORE_COLOR = 0xff3311;
export const SUN_BLOOD_ORANGE_COLOR = 0xcc2200; // second, independently-animated noise layer
export const SUN_ASH_TINT_COLOR = 0xdd1100; // blue-free red, or it reads pink over the pale smoke
export const SUN_LIGHT_INTENSITY = 4.0;
export const SUN_LIGHT_DISTANCE = 60 * SUN_DISTANCE_SCALE;
export const SUN_VISUAL_RADIUS = 40; // smaller than SUN_DISTANCE_SCALE alone would give

// orbits the volcano at a fixed height/radius derived from SUN_LIGHT_POSITION
export const SUN_ORBIT_RADIUS = Math.sqrt(SUN_LIGHT_POSITION.x ** 2 + SUN_LIGHT_POSITION.z ** 2);
export const SUN_ORBIT_HEIGHT = SUN_LIGHT_POSITION.y;
export const SUN_ORBIT_START_ANGLE = Math.atan2(SUN_LIGHT_POSITION.z, SUN_LIGHT_POSITION.x);
export const SUN_ORBIT_PERIOD = 4000; // seconds per revolution
export const SUN_ORBIT_SPEED = (2 * Math.PI) / SUN_ORBIT_PERIOD;

// ─── Smoke / ash plume (points-based particle system) ────────────────────────

export const SMOKE_MAX_PARTICLES = 1400;
export const SMOKE_SPAWN_HEIGHT = 4.6; // above the volcano's own origin, where the crater opening sits
export const SMOKE_RISE_HEIGHT = 10.0;
export const SMOKE_CORE_SPREAD = 5.0; // fixed reach near the axis so the center never gets diluted
export const SMOKE_LIFETIME = 12.0;
export const SMOKE_FADE_IN_END = 0.15; // age fraction to reach full opacity
export const SMOKE_FADE_OUT_START = 0.4; // age fraction where fade-out begins
export const SMOKE_SIZE_MULTIPLIER_MIN = 0.3;
export const SMOKE_SIZE_MULTIPLIER_MAX = 1.3;
export const SMOKE_ACCENT_STRENGTH = 0.6; // caps the ember tint
export const SMOKE_ACCENT_THRESHOLD = 0.8; // only the top (1 - threshold) share gets any accent
export const SMOKE_EMBER_COOLING_MULTIPLIER_MIN = 0.5;
export const SMOKE_EMBER_COOLING_MULTIPLIER_MAX = 1.5;
export const SMOKE_EMBER_GLOW_STRENGTH = 6.0; // HDR multiplier, pushes past the bloom threshold
export const SMOKE_EMBER_GLOW_MULTIPLIER_MIN = 0.4;
export const SMOKE_EMBER_GLOW_MULTIPLIER_MAX = 1.8;
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
export const GOD_RAYS_SKIP_VISIBILITY_THRESHOLD = 0.02; // below this, the sun's contribution is imperceptible - skip the occlusion/generate render work entirely

// ─── Bloom (post-processing) ─────────────────────────────────────────────────

export const BLOOM_TINT_COLOR = { x: 1.0, y: 0.45, z: 0.05 };

// ─── Sound (procedural ambient audio - lava flow/crackle, volcano rumble) ───

export const AUDIO_LAVA_NOISE_DURATION = 4.0;
export const AUDIO_LAVA_LOWPASS_FREQUENCY = 300;
export const AUDIO_LAVA_FLOW_GAIN = 0.5;
export const AUDIO_LAVA_FLOW_LFO_FREQUENCY = 0.07;
export const AUDIO_LAVA_FLOW_LFO_DEPTH = 0.15;

export const AUDIO_CRACKLE_MIN_INTERVAL = 3.0;
export const AUDIO_CRACKLE_MAX_INTERVAL = 12.0;
export const AUDIO_CRACKLE_DURATION = 0.07;
export const AUDIO_CRACKLE_BANDPASS_FREQUENCY = 1200;
export const AUDIO_CRACKLE_GAIN = 0.27;
export const AUDIO_CRACKLE_GAIN_VARIANCE_MIN = 0.3;
export const AUDIO_CRACKLE_GAIN_VARIANCE_MAX = 1.2;
export const AUDIO_CRACKLE_CLUSTER_CHANCE = 0.35;
export const AUDIO_CRACKLE_CLUSTER_MIN_COUNT = 1;
export const AUDIO_CRACKLE_CLUSTER_MAX_COUNT = 3;
export const AUDIO_CRACKLE_CLUSTER_GAP_MIN = 0.05;
export const AUDIO_CRACKLE_CLUSTER_GAP_MAX = 0.3;

export const AUDIO_RUMBLE_MIN_INTERVAL = 9.0;
export const AUDIO_RUMBLE_MAX_INTERVAL = 24.0;
export const AUDIO_RUMBLE_FREQUENCY_START = 70;
export const AUDIO_RUMBLE_FREQUENCY_END = 38;
export const AUDIO_RUMBLE_DURATION = 1.6;
export const AUDIO_RUMBLE_GAIN = 0.7;
export const AUDIO_RUMBLE_SECOND_PULSE_DELAY = 0.32;
export const AUDIO_RUMBLE_SECOND_PULSE_GAIN_SCALE = 0.55;

export const AUDIO_METABALL_SPAWN_NOISE_DURATION = 0.2;
export const AUDIO_METABALL_SPAWN_LOWPASS_FREQUENCY = 800;
export const AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_START = 150;
export const AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_END = 50;
export const AUDIO_METABALL_SPAWN_DURATION = 0.25;
export const AUDIO_METABALL_SPAWN_GAIN = 0.67;
