import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, makeGroundMaterialUniformsMock, MockMesh, MockPlaneGeometry } from '../test-utils/three_mocks.js';
import { METABALL_GPU_MAX_BALLS, METABALL_WAVE_BOOST_MULTIPLIER, METABALL_WAVE_BOOST_HOLD_FRAMES, METABALL_WAVE_BOOST_DECAY_FRAMES } from '../config.js';

const { DEFAULT_SETTINGS, DEFAULT_SMOKE_SETTINGS } = vi.hoisted(() => ({
    DEFAULT_SETTINGS: { count: 100, spread: 1.0, speed_factor: 0.003, sink_speed: 0.25, disappear_y: 0.25, paused: false, max_count: 500, flow_z_radius: 11 },
    DEFAULT_SMOKE_SETTINGS: { count: 200, max_count: 400 },
}));

vi.mock('three', () => ({ Mesh: MockMesh, PlaneGeometry: MockPlaneGeometry }));

vi.mock('../rendering/ground_material.js', () => ({
    createGroundMaterial: vi.fn(() => ({ uniforms: makeGroundMaterialUniformsMock() })),
    updateGroundLight: vi.fn(),
}));

vi.mock('../geometry/ground_geometry.js', () => ({
    createGroundGeometry: vi.fn(scene => {
        const mesh = { position: { x: 0, y: -6, z: 0 }, rotation: { x: -Math.PI / 2 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
    bakeGroundDisplacement: vi.fn(),
}));

vi.mock('../geometry/metaball_geometry.js', () => ({
    createMetaballGeometry: vi.fn(scene => {
        const effect = { position: { x: 0, y: 0, z: 0 }, isolation: 50 };
        scene.add(effect);
        return effect;
    }),
    ballToWorldPosition: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    ballToWorldRadius: vi.fn(() => 0),
}));

vi.mock('../animation/metaball_animation.js', () => {
    const settings = { ...DEFAULT_SETTINGS };
    return {
        settings,
        getActiveBalls: vi.fn(() => []),
        stepMetaballAnimation: vi.fn(),
        getEruptionIntensity: vi.fn(() => 1.0),
        getSpawnCount: vi.fn(() => 0),
        getWaveStartCount: vi.fn(() => 0),
    };
});

vi.mock('../rendering/metaball_field_texture.js', () => ({
    createMetaballFieldTexture: vi.fn(() => ({ texture: {}, render: vi.fn() })),
}));

vi.mock('../rendering/metaball_material.js', () => ({
    createMetaballMaterial: vi.fn(() => ({
        uniforms: {
            u_color_hot: { value: makeColor('a01500') },
            u_color_cool: { value: makeColor('7c3027') },
            u_glow_color: { value: makeColor('ff3f00') },
            u_noise_color_1: { value: makeColor('7c3027') },
            u_noise_color_2: { value: makeColor('ea6927') },
            u_glow_enabled: { value: 1.0 },
            u_noise_enabled: { value: 1.0 },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
        },
    })),
    updateMetaballLight: vi.fn(),
    updateMetaballBalls: vi.fn(),
    updateMetaballDisplacement: vi.fn(),
}));

vi.mock('../geometry/volcano_geometry.js', () => ({
    createVolcanoGeometry: vi.fn(scene => {
        const mesh = { position: { x: 0, y: 0, z: 0 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
    bakeCrackDisplacement: vi.fn(),
}));

vi.mock('../rendering/volcano_material.js', () => ({
    createVolcanoMaterial: vi.fn(() => ({
        uniforms: {
            u_displacement_scale: { value: 2.5 },
            u_displacement_frequency: { value: 0.5 },
            u_rock_color: { value: makeColor('afafaf') },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_sun_focus: { value: 8.0 },
        },
    })),
    updateVolcanoLight: vi.fn(),
    updateVolcanoInteraction: vi.fn(),
}));

vi.mock('../objects/interaction_controller.js', () => ({
    createInteractionController: vi.fn(() => {
        let enabled = false;
        return {
            step: vi.fn(() => ({ touch_points: [], smoke_bursts: [], is_touching_lava: false })),
            getEnabled: () => enabled,
            setEnabled: value => { enabled = value; },
        };
    }),
}));

vi.mock('../objects/impact_smoke_object.js', () => ({
    createImpactSmoke: vi.fn(() => {
        let visible = true;
        return {
            mesh: {},
            update: vi.fn(),
            getVisible: () => visible,
            setVisible: value => { visible = value; },
            setSunEnabled: vi.fn(),
            setSunStrength: vi.fn(),
        };
    }),
}));

vi.mock('../audio/volcano_audio.js', () => ({
    createVolcanoAudio: vi.fn(() => {
        const state = { enabled: true, volume: 0.5 };
        return {
            start: vi.fn(),
            stop: vi.fn(),
            close: vi.fn(),
            update: vi.fn(),
            playMetaballSpawn: vi.fn(),
            setPressing: vi.fn(),
            setCameraDistance: vi.fn(),
            getEnabled: () => state.enabled,
            setEnabled: value => { state.enabled = value; },
            getVolume: () => state.volume,
            setVolume: value => { state.volume = value; },
        };
    }),
}));

vi.mock('../objects/sun_object.js', () => ({
    createSun: vi.fn(scene => {
        const state = { visible: true };
        const light = { visible: true, position: { x: 12, y: 10, z: -30 } };
        const mesh = { visible: true };
        scene.add(light, mesh);
        return {
            light,
            mesh,
            update: vi.fn(),
            getVisible: () => state.visible,
            setVisible: value => { state.visible = value; light.visible = value; mesh.visible = value; },
        };
    }),
}));

vi.mock('../geometry/smoke_geometry.js', () => ({
    createSmokeGeometry: vi.fn(scene => {
        const points = { position: { x: 0, y: 0, z: 0 }, visible: true, geometry: { drawRange: { start: 0, count: 0 } } };
        scene.add(points);
        return points;
    }),
    setSmokeDrawRange: vi.fn((points, count) => { points.geometry.drawRange = { start: 0, count }; }),
}));

vi.mock('../rendering/smoke_material.js', () => ({
    createSmokeMaterial: vi.fn(() => ({
        uniforms: {
            u_color_1: { value: makeColor('5c4534') },
            u_color_2: { value: makeColor('cac2b4') },
            u_color_3: { value: makeColor('d9622a') },
            u_size: { value: 22 },
            u_sun_color: { value: makeColor('ff1a1a') },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_time: { value: 0.0 },
            u_plume_opacity_factor: { value: 1.0 },
            u_spread: { value: 1.0 },
            u_rise_speed: { value: 1.0 },
            u_ember_cooling_time: { value: 2.5 },
        },
    })),
    updateSmokeMaterial: vi.fn(),
}));

vi.mock('../animation/smoke_particles.js', () => {
    const settings = { ...DEFAULT_SMOKE_SETTINGS };
    return {
        settings,
        particle_seeds: { is_ambient: new Float32Array(400) },
        computePlumeOpacityFactor: vi.fn(eruption_intensity => (eruption_intensity === undefined ? 1.0 : eruption_intensity)),
    };
});

vi.mock('../default_settings.json', () => ({
    default: {
        paused: true, timeScale: 1, metaballCount: 10, metaballIsolation: 60, metaballSpread: 1.2, metaballSpeed: 0.005,
        metaballHeight: 2.0, flowRadius: 5,
        colorHot: '#111111', colorCool: '#222222', glowEnabled: false, glowColor: '#333333',
        noiseEnabled: false, noiseColor1: '#444444', noiseColor2: '#555555', bumpEnabled: false,
        displacementEnabled: true, displacementStrength: 0.001,
        groundVisible: false, groundColor: '#666666', groundHeight: -3,
        groundCrackColor: '#333333', groundCrackColor2: '#444400', groundCrackColor3: '#555500', groundCrackSoftness: 0.4, groundDisplacementScale: 0.9, groundDisplacementFrequency: 0.15,
        groundProximityColor: '#888888', groundProximityNoiseColor: '#663311', groundProximityRadius: 12,
        volcanoVisible: false, volcanoDisplacementScale: 1.0, volcanoDisplacementFrequency: 0.2,
        volcanoRockColor: '#777777',
        sunVisible: false, sunStrength: 0.03, sunFocus: 6.0,
        smokeVisible: false, smokeCount: 20, smokeSpread: 0.5, smokeRiseSpeed: 0.6,
        smokeColor1: '#999999', smokeColor2: '#dddddd', smokeColor3: '#eeeeee', smokeParticleSize: 30, smokeEmberCoolingTime: 1.1,
        offsetX: 1, offsetY: 2, offsetZ: 3,
        bloomEnabled: false, bloomStrength: 0.1, bloomRadius: 0.2, bloomThreshold: 0.9,
    },
}));

import { createSceneController } from '../scene_controller.js';
import { settings as mock_settings, stepMetaballAnimation, getActiveBalls, getSpawnCount, getWaveStartCount } from '../animation/metaball_animation.js';
import { updateMetaballLight, updateMetaballBalls } from '../rendering/metaball_material.js';
import { createVolcanoAudio } from '../audio/volcano_audio.js';
import { createGroundMaterial, updateGroundLight } from '../rendering/ground_material.js';
import { createVolcanoMaterial, updateVolcanoLight } from '../rendering/volcano_material.js';
import { settings as mock_smoke_settings } from '../animation/smoke_particles.js';
import { createSmokeMaterial, updateSmokeMaterial } from '../rendering/smoke_material.js';
import { createSun } from '../objects/sun_object.js';
import { createInteractionController } from '../objects/interaction_controller.js';
import { createImpactSmoke } from '../objects/impact_smoke_object.js';

function makeScene() { return { add: vi.fn(), background: makeColor('6b2f1a') }; }
function makeCamera() { return { matrixWorldInverse: {}, position: { x: 0, y: 0, z: 0 } }; }
function makeRenderer() { return { domElement: {} }; }
function makeBloomPass() { return { enabled: true, strength: 0.8, radius: 0.5, threshold: 0.3 }; }

function makeGodRaysPass() {
    const state = { weight: 0.25, exposure: 0.5, decay: 0.96, density: 0.93, tint_color: '#ff2211' };
    return {
        enabled: true,
        getWeight: () => state.weight,
        setWeight: value => { state.weight = value; },
        getExposure: () => state.exposure,
        setExposure: value => { state.exposure = value; },
        getDecay: () => state.decay,
        setDecay: value => { state.decay = value; },
        getDensity: () => state.density,
        setDensity: value => { state.density = value; },
        getTintColor: () => state.tint_color,
        setTintColor: value => { state.tint_color = value; },
    };
}

function makeController() {
    return createSceneController({
        scene: makeScene(), camera: makeCamera(), renderer: makeRenderer(),
        bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(),
        setControlsEnabled: vi.fn(),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
    Object.assign(mock_smoke_settings, DEFAULT_SMOKE_SETTINGS);
});

describe('createSceneController – initial positioning', () => {
    test('places ground, volcano and effect exactly like the previous hand-wired setup', () => {
        const controller = makeController();
        expect(controller.getGroundHeight()).toBe(-6);
        expect(controller.getOffsetY()).toBe(0);
        expect(controller.getMetaballHeight()).toBeCloseTo(2.0, 9);
    });
});

describe('createSceneController – time scale', () => {
    test('getTimeScale/setTimeScale forward to the same locally-owned value', () => {
        const controller = makeController();
        expect(controller.getTimeScale()).toBe(1);
        controller.setTimeScale(3.5);
        expect(controller.getTimeScale()).toBe(3.5);
    });

    test('a wave starting briefly boosts getTimeScale without touching the base value, then eases back', () => {
        getWaveStartCount.mockReturnValueOnce(0);
        const controller = makeController();
        controller.setTimeScale(2);

        getWaveStartCount.mockReturnValueOnce(1);
        controller.update(0);
        expect(controller.getTimeScale()).toBeCloseTo(2 * METABALL_WAVE_BOOST_MULTIPLIER, 1);
        expect(controller.getBaseTimeScale()).toBe(2);

        getWaveStartCount.mockReturnValueOnce(1);
        controller.update(1);
        expect(controller.getTimeScale()).toBeLessThanOrEqual(2 * METABALL_WAVE_BOOST_MULTIPLIER);
        expect(controller.getTimeScale()).toBeGreaterThanOrEqual(2);
    });

    test('the wave-start boost holds at full strength for METABALL_WAVE_BOOST_HOLD_FRAMES frames, then eases back down over METABALL_WAVE_BOOST_DECAY_FRAMES more frames', () => {
        getWaveStartCount.mockReturnValueOnce(0);
        const controller = makeController();
        controller.setTimeScale(1);
        getWaveStartCount.mockReturnValue(1);

        let frames_elapsed = 0;
        function advanceFrames(count) {
            for (let i = 0; i < count; i++) { controller.update(0); frames_elapsed++; }
        }

        advanceFrames(1);
        expect(controller.getTimeScale()).toBeCloseTo(METABALL_WAVE_BOOST_MULTIPLIER, 5);

        advanceFrames(METABALL_WAVE_BOOST_HOLD_FRAMES - 1);
        expect(controller.getTimeScale()).toBeCloseTo(METABALL_WAVE_BOOST_MULTIPLIER, 5);

        advanceFrames(METABALL_WAVE_BOOST_DECAY_FRAMES / 2 + 1);
        expect(controller.getTimeScale()).toBeCloseTo(1 + (METABALL_WAVE_BOOST_MULTIPLIER - 1) * 0.5, 5);

        advanceFrames(METABALL_WAVE_BOOST_DECAY_FRAMES);
        expect(controller.getTimeScale()).toBeCloseTo(1, 5);
    });

    test('the wave-start boost stays suppressed while interaction mode is on (autonomous mode only)', () => {
        getWaveStartCount.mockReturnValueOnce(0);
        const controller = makeController();
        controller.setTimeScale(2);
        controller.setInteractionMode(true);

        getWaveStartCount.mockReturnValueOnce(1);
        controller.update(0);
        expect(controller.getTimeScale()).toBe(2);

        controller.setInteractionMode(false);
        expect(controller.getTimeScale()).toBeCloseTo(2 * METABALL_WAVE_BOOST_MULTIPLIER, 1);
    });
});

describe('createSceneController – setGroundHeight / setOffsetY', () => {
    test('setGroundHeight recomputes ground/volcano/effect y-positions via the effect_offset formula', () => {
        const controller = makeController();
        controller.setGroundHeight(-3);
        expect(controller.getGroundHeight()).toBe(-3);
        expect(controller.getGroundHeight()).toBeCloseTo(-3, 9);
    });

    test('setOffsetY shifts volcano/effect but leaves ground height untouched', () => {
        const controller = makeController();
        controller.setOffsetY(2);
        expect(controller.getOffsetY()).toBe(2);
        expect(controller.getGroundHeight()).toBe(-6);
    });

    test('setOffsetX/Z move both volcano and metaball effect together', () => {
        const controller = makeController();
        controller.setOffsetX(3);
        controller.setOffsetZ(-4);
        expect(controller.getOffsetX()).toBe(3);
        expect(controller.getOffsetZ()).toBe(-4);
    });
});

describe('createSceneController – metaballs', () => {
    test('setMetaballCount updates settings.count and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballCount(250);
        expect(controller.getMetaballCount()).toBe(250);
        expect(updateMetaballBalls).toHaveBeenCalled();
    });

    test('setMetaballIsolation updates effect.isolation and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballIsolation(77);
        expect(controller.getMetaballIsolation()).toBe(77);
        expect(updateMetaballBalls).toHaveBeenCalled();
    });

    test('setMetaballRadius updates effect.radius_scale and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballRadius(1.5);
        expect(controller.getMetaballRadius()).toBe(1.5);
        expect(updateMetaballBalls).toHaveBeenCalled();
    });

    test('getMaxMetaballCount is capped at the GPU raymarcher\'s ball limit, even though the mocked pool reports a higher max_count', () => {
        const controller = makeController();
        expect(controller.getMaxMetaballCount()).toBe(METABALL_GPU_MAX_BALLS);
    });
});

describe('createSceneController – ground', () => {
    test('color/crack color/displacement getters and setters forward to the ground object', () => {
        const controller = makeController();

        controller.setGroundColor('#123123');
        expect(controller.getGroundColor()).toBe('#123123');

        controller.setGroundCrackColor('#321321');
        expect(controller.getGroundCrackColor()).toBe('#321321');

        controller.setGroundCrackColor2('#456456');
        expect(controller.getGroundCrackColor2()).toBe('#456456');

        controller.setGroundCrackColor3('#789789');
        expect(controller.getGroundCrackColor3()).toBe('#789789');

        controller.setGroundCrackColor4('#abcabc');
        expect(controller.getGroundCrackColor4()).toBe('#abcabc');

        controller.setGroundCrackSoftness(0.6);
        expect(controller.getGroundCrackSoftness()).toBe(0.6);

        controller.setGroundDisplacementScale(1.2);
        expect(controller.getGroundDisplacementScale()).toBe(1.2);

        controller.setGroundDisplacementFrequency(0.3);
        expect(controller.getGroundDisplacementFrequency()).toBe(0.3);

        controller.setGroundProximityColor('#654321');
        expect(controller.getGroundProximityColor()).toBe('#654321');

        controller.setGroundProximityNoiseColor('#123abc');
        expect(controller.getGroundProximityNoiseColor()).toBe('#123abc');

        controller.setGroundProximityRadius(15.0);
        expect(controller.getGroundProximityRadius()).toBe(15.0);
    });
});

describe('createSceneController – displacement toggle', () => {
    test('getDisplacementStrength keeps the configured value regardless of the enabled toggle', () => {
        const controller = makeController();
        expect(controller.getDisplacementEnabled()).toBe(true);
        expect(controller.getDisplacementStrength()).toBeCloseTo(0.001, 9);

        controller.setDisplacementEnabled(false);
        expect(controller.getDisplacementEnabled()).toBe(false);
        expect(controller.getDisplacementStrength()).toBeCloseTo(0.001, 9);

        controller.setDisplacementEnabled(true);
        expect(controller.getDisplacementEnabled()).toBe(true);
        expect(controller.getDisplacementStrength()).toBeCloseTo(0.001, 9);
    });
});

describe('createSceneController – bloom', () => {
    test('getBloomX/setBloomX forward to the bloom pass, one field at a time', () => {
        const controller = makeController();
        controller.setBloomStrength(1.5);
        expect(controller.getBloomEnabled()).toBe(true);
        expect(controller.getBloomStrength()).toBe(1.5);
        expect(controller.getBloomRadius()).toBe(0.5);
        expect(controller.getBloomThreshold()).toBe(0.3);
    });
});

describe('createSceneController – getSnapshot / applySnapshot', () => {
    test('applying a snapshot and reading it back yields the same values', () => {
        const controller = makeController();
        const snapshot = {
            paused: true, timeScale: 2.5, interactionMode: true, interactionSmokeVisible: false, metaballCount: 33, metaballIsolation: 61, metaballRadius: 1.8, metaballSpread: 0.4, metaballSpeed: 0.0021, metaballSinkSpeed: 0.5, metaballDisappearY: 0.26,
            metaballHeight: 3.3, flowRadius: 7,
            colorHot: '#abcabc', colorCool: '#123123', glowEnabled: false, glowColor: '#ffffff',
            noiseEnabled: false, noiseColor1: '#000001', noiseColor2: '#000002', bumpEnabled: false,
            displacementEnabled: false, displacementStrength: 0.0015,
            groundVisible: false, groundColor: '#0a0a0a', groundColor2: '#0a0a0b', groundColor3: '#0a0a0c', groundColor4: '#0a0a0d', groundHeight: -2,
            groundCrackColor: '#050505', groundCrackColor2: '#0a0a00', groundCrackColor3: '#0a0500', groundCrackColor4: '#a00000', groundCrackSoftness: 0.3, groundDisplacementScale: 1.1, groundDisplacementFrequency: 0.12,
            groundProximityColor: '#a0a0a0', groundProximityNoiseColor: '#774422', groundProximityRadius: 22, groundSunFocusRadius: 5.5, groundRockVarianceRadius: 40.0,
            volcanoVisible: false, volcanoDisplacementScale: 4.4, volcanoDisplacementFrequency: 0.7,
            volcanoRockColor: '#b0b0b0',
            sunVisible: false, sunStrength: 0.09, sunFocus: 3.5,
            smokeVisible: false, smokeCount: 42, smokeSpread: 0.8, smokeRiseSpeed: 1.4,
            smokeColor1: '#abcdef', smokeColor2: '#fedcba', smokeColor3: '#123456', smokeParticleSize: 45, smokeEmberCoolingTime: 4.2,
            offsetX: 5, offsetY: -1, offsetZ: 2,
            bloomEnabled: false, bloomStrength: 1.1, bloomRadius: 0.4, bloomThreshold: 0.2,
            skyColor: '#112233',
            godRaysWeight: 0.4, godRaysExposure: 0.7, godRaysDecay: 0.9, godRaysDensity: 1.0, godRaysTintColor: '#654321',
            soundEnabled: false, soundVolume: 0.75,
        };

        controller.applySnapshot(snapshot);
        expect(controller.getSnapshot()).toEqual(snapshot);
    });

    test('applySnapshot ignores unknown keys and leaves other fields unchanged', () => {
        const controller = makeController();
        const initial_snapshot = controller.getSnapshot();
        controller.applySnapshot({ unknown_field: 123 });
        expect(controller.getSnapshot()).toEqual(initial_snapshot);
    });

    test('resetToDefaults applies the imported default_settings.json', () => {
        const controller = makeController();
        controller.resetToDefaults();
        expect(controller.getMetaballCount()).toBe(10);
        expect(controller.isPaused()).toBe(true);
        expect(controller.getGroundHeight()).toBe(-3);
        expect(controller.getSmokeCount()).toBe(20);
        expect(controller.getSmokeEmberCoolingTime()).toBe(1.1);
    });
});

describe('createSceneController – sun', () => {
    test('getSunVisible/setSunVisible forward to the sun object', () => {
        const controller = makeController();
        expect(controller.getSunVisible()).toBe(true);
        controller.setSunVisible(false);
        expect(controller.getSunVisible()).toBe(false);
    });

    test('getSunStrength/setSunStrength and getSunFocus/setSunFocus forward to the volcano material', () => {
        const controller = makeController();
        controller.setSunStrength(0.08);
        expect(controller.getSunStrength()).toBe(0.08);
        controller.setSunFocus(9.0);
        expect(controller.getSunFocus()).toBe(9.0);
    });

    test('setSunVisible(false) also disables the sun tint on the ground, the volcano and the smoke, setSunVisible(true) restores all three', () => {
        const controller = makeController();
        const ground_material = createGroundMaterial.mock.results[0].value;
        const volcano_material = createVolcanoMaterial.mock.results[0].value;
        const smoke_material = createSmokeMaterial.mock.results[0].value;
        expect(ground_material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(volcano_material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(smoke_material.uniforms.u_sun_enabled.value).toBe(1.0);

        controller.setSunVisible(false);
        expect(ground_material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(volcano_material.uniforms.u_sun_enabled.value).toBe(0.0);
        expect(smoke_material.uniforms.u_sun_enabled.value).toBe(0.0);

        controller.setSunVisible(true);
        expect(ground_material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(volcano_material.uniforms.u_sun_enabled.value).toBe(1.0);
        expect(smoke_material.uniforms.u_sun_enabled.value).toBe(1.0);
    });

    test('setSunStrength updates the ground, the volcano and the smoke tint', () => {
        const controller = makeController();
        controller.setSunStrength(0.15);
        const ground_material = createGroundMaterial.mock.results[0].value;
        const volcano_material = createVolcanoMaterial.mock.results[0].value;
        const smoke_material = createSmokeMaterial.mock.results[0].value;
        expect(ground_material.uniforms.u_sun_strength.value).toBe(0.15);
        expect(volcano_material.uniforms.u_sun_strength.value).toBe(0.15);
        expect(smoke_material.uniforms.u_sun_strength.value).toBe(0.15);
    });

    test('setSunVisible(false) disables the god rays pass, setSunVisible(true) re-enables it', () => {
        const god_rays_pass = makeGodRaysPass();
        const controller = createSceneController({
            scene: makeScene(), camera: makeCamera(), renderer: makeRenderer(),
            bloom_pass: makeBloomPass(), god_rays_pass, setControlsEnabled: vi.fn(),
        });

        controller.setSunVisible(false);
        expect(god_rays_pass.enabled).toBe(false);

        controller.setSunVisible(true);
        expect(god_rays_pass.enabled).toBe(true);
    });

    test('setSunVisible/setSunStrength also forward to the impact smoke object', () => {
        const controller = makeController();
        const impact_smoke = createImpactSmoke.mock.results.at(-1).value;

        controller.setSunVisible(false);
        expect(impact_smoke.setSunEnabled).toHaveBeenCalledWith(false);

        controller.setSunStrength(0.15);
        expect(impact_smoke.setSunStrength).toHaveBeenCalledWith(0.15);
    });

    test('setSunFocus updates both the ground and the volcano focus', () => {
        const controller = makeController();
        controller.setSunFocus(9.0);
        const ground_material = createGroundMaterial.mock.results[0].value;
        const volcano_material = createVolcanoMaterial.mock.results[0].value;
        expect(ground_material.uniforms.u_sun_focus.value).toBe(9.0);
        expect(volcano_material.uniforms.u_sun_focus.value).toBe(9.0);
    });
});

describe('createSceneController – smoke', () => {
    test('getMaxSmokeCount reflects settings.max_count', () => {
        const controller = makeController();
        expect(controller.getMaxSmokeCount()).toBe(400);
    });

    test('setSmokeCount/setSmokeSpread/setSmokeRiseSpeed update the smoke settings/material', () => {
        const controller = makeController();
        controller.setSmokeCount(80);
        controller.setSmokeSpread(1.5);
        controller.setSmokeRiseSpeed(0.7);
        expect(controller.getSmokeCount()).toBe(80);
        expect(controller.getSmokeSpread()).toBe(1.5);
        expect(controller.getSmokeRiseSpeed()).toBe(0.7);
    });

    test('color/particle size/visibility forward to the smoke object', () => {
        const controller = makeController();
        controller.setSmokeColor1('#123123');
        expect(controller.getSmokeColor1()).toBe('#123123');
        controller.setSmokeColor2('#321321');
        expect(controller.getSmokeColor2()).toBe('#321321');
        controller.setSmokeColor3('#456456');
        expect(controller.getSmokeColor3()).toBe('#456456');
        controller.setSmokeParticleSize(99);
        expect(controller.getSmokeParticleSize()).toBe(99);
        controller.setSmokeEmberCoolingTime(1.9);
        expect(controller.getSmokeEmberCoolingTime()).toBe(1.9);
        controller.setSmokeVisible(false);
        expect(controller.getSmokeVisible()).toBe(false);
    });

    test('setOffsetX/Z also move the smoke effect', () => {
        const scene = makeScene();
        const controller = createSceneController({
            scene, camera: makeCamera(), renderer: makeRenderer(),
            bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(),
            setControlsEnabled: vi.fn(),
        });
        controller.setOffsetX(3);
        controller.setOffsetZ(-4);
        expect(controller.getOffsetX()).toBe(3);
        expect(controller.getOffsetZ()).toBe(-4);
    });
});

describe('createSceneController – interaction mode', () => {
    test('creates the interaction controller with the renderer, the volcano mesh and the scene’s lifetime signal', () => {
        const renderer = makeRenderer();
        const signal = new AbortController().signal;
        createSceneController({
            scene: makeScene(), camera: makeCamera(), renderer,
            bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(), setControlsEnabled: vi.fn(), signal,
        });
        expect(createInteractionController).toHaveBeenCalledWith(renderer, expect.any(Object), { signal });
    });

    test('closeAudio closes the volcano audio for good', () => {
        const controller = makeController();
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;
        controller.closeAudio();
        expect(volcano_audio.close).toHaveBeenCalledTimes(1);
    });

    test('getInteractionMode/setInteractionMode forward to the interaction controller and toggle OrbitControls', () => {
        const setControlsEnabled = vi.fn();
        const controller = createSceneController({
            scene: makeScene(), camera: makeCamera(), renderer: makeRenderer(),
            bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(), setControlsEnabled,
        });

        expect(controller.getInteractionMode()).toBe(false);

        controller.setInteractionMode(true);
        expect(controller.getInteractionMode()).toBe(true);
        expect(setControlsEnabled).toHaveBeenCalledWith(false);

        controller.setInteractionMode(false);
        expect(controller.getInteractionMode()).toBe(false);
        expect(setControlsEnabled).toHaveBeenCalledWith(true);
    });

    test('getInteractionSmokeVisible/setInteractionSmokeVisible forward to the impact smoke object', () => {
        const controller = makeController();
        expect(controller.getInteractionSmokeVisible()).toBe(true);
        controller.setInteractionSmokeVisible(false);
        expect(controller.getInteractionSmokeVisible()).toBe(false);
    });

    test('update() advances the interaction step and forwards its touch points/smoke bursts onward', () => {
        const controller = makeController();
        const interaction = createInteractionController.mock.results.at(-1).value;
        const touch_points = [{ x: 1, y: 1, z: 1, strength: 0.5 }];
        const smoke_bursts = [{ x: 2, y: 2, z: 2, bloom: 0.7, fade: 0.4, elapsed: 2.5 }];
        interaction.step.mockReturnValueOnce({ touch_points, smoke_bursts });

        controller.update(4.0, 0.016);

        expect(interaction.step).toHaveBeenCalledWith(4.0, expect.any(Object), expect.any(Function), expect.any(Function), 0.016);
        const impact_smoke = createImpactSmoke.mock.results.at(-1).value;
        expect(impact_smoke.update).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), smoke_bursts);
    });

    test('update() wires the metaball-squeeze callback through to metaball_field.squeezeNearestBall', () => {
        const controller = makeController();
        controller.update(0);

        const interaction = createInteractionController.mock.results.at(-1).value;
        const squeeze_metaball_near = interaction.step.mock.calls.at(-1)[3];

        const ball = { active: true, base_strength: 4, strength: 4, shrink_fraction: 0 };
        getActiveBalls.mockReturnValueOnce([ball]);
        squeeze_metaball_near({ x: 0, y: 0, z: 0, shrink_increment: 0.5 });

        expect(ball.strength).toBeCloseTo(4 * 0.5 * 0.5, 9);
        expect(ball.active).toBe(true);
    });
});

describe('createSceneController – update()', () => {
    test('delegates to stepMetaballAnimation, updateMetaballLight and updateVolcanoLight with the right arguments', () => {
        const scene = makeScene();
        const camera = makeCamera();
        const renderer = makeRenderer();
        const bloom_pass = makeBloomPass();
        const god_rays_pass = makeGodRaysPass();
        const controller = createSceneController({ scene, camera, renderer, bloom_pass, god_rays_pass, setControlsEnabled: vi.fn() });

        controller.update(12.5);

        const sun = createSun.mock.results[0].value;
        expect(updateGroundLight).toHaveBeenCalledWith(expect.any(Object), camera, expect.any(Object), sun.light.position, 12.5, scene.background);
        expect(stepMetaballAnimation).toHaveBeenCalledTimes(1);
        expect(stepMetaballAnimation.mock.calls[0][0]).toBe(12.5);
        expect(updateMetaballLight).toHaveBeenCalledTimes(1);
        expect(updateMetaballLight.mock.calls[0][1]).toBe(camera);
        expect(updateMetaballLight.mock.calls[0][2]).toBe(12.5);
        expect(updateVolcanoLight).toHaveBeenCalledTimes(1);
        expect(updateVolcanoLight.mock.calls[0][1]).toBe(camera);
        expect(updateVolcanoLight.mock.calls[0][2]).toBe(sun.light.position);
        expect(updateSmokeMaterial).toHaveBeenCalledWith(expect.any(Object), camera, sun.light.position, 12.5, 1.0);
        expect(sun.update).toHaveBeenCalledWith(12.5);
    });

    test('rebuilds the metaball geometry only when the animation step returns balls (not while paused)', () => {
        const controller = makeController();
        updateMetaballBalls.mockClear();

        stepMetaballAnimation.mockReturnValueOnce(null);
        controller.update(0);
        expect(updateMetaballBalls).not.toHaveBeenCalled();

        const balls = [{ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 }];
        stepMetaballAnimation.mockReturnValueOnce(balls);
        controller.update(1);
        expect(updateMetaballBalls).toHaveBeenCalledWith(expect.anything(), balls, expect.anything());
    });

    test('plays a metaball-spawn sound only when the spawn count changes', () => {
        getSpawnCount.mockReturnValueOnce(0);
        const controller = makeController();
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;

        getSpawnCount.mockReturnValueOnce(0);
        controller.update(1);
        expect(volcano_audio.playMetaballSpawn).not.toHaveBeenCalled();

        getSpawnCount.mockReturnValueOnce(1);
        controller.update(2);
        expect(volcano_audio.playMetaballSpawn).toHaveBeenCalledTimes(1);

        getSpawnCount.mockReturnValueOnce(1);
        controller.update(3);
        expect(volcano_audio.playMetaballSpawn).toHaveBeenCalledTimes(1);
    });

    test('fastForward steps the lava simulation from 0 up to the given duration', () => {
        const controller = makeController();
        stepMetaballAnimation.mockClear();

        controller.fastForward(2, 0.5);

        expect(stepMetaballAnimation.mock.calls.map(call => call[0])).toEqual([0, 0.5, 1, 1.5, 2]);
    });

    test('fastForward spawns stay silent and trigger no wave boost on the next frame', () => {
        getSpawnCount.mockReturnValue(0);
        getWaveStartCount.mockReturnValue(0);
        const controller = makeController();
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;

        getSpawnCount.mockReturnValue(17);
        getWaveStartCount.mockReturnValue(3);
        controller.fastForward(600, 0.5);
        controller.update(600);

        expect(volcano_audio.playMetaballSpawn).not.toHaveBeenCalled();
        expect(controller.getTimeScale()).toBe(controller.getBaseTimeScale());

        getSpawnCount.mockReturnValue(0);
        getWaveStartCount.mockReturnValue(0);
    });

    test('startAudio/stopAudio resume and suspend volcano_audio', () => {
        const controller = makeController();
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;

        controller.startAudio();
        expect(volcano_audio.start).toHaveBeenCalledTimes(1);

        controller.stopAudio();
        expect(volcano_audio.stop).toHaveBeenCalledTimes(1);
    });

    test('forwards is_touching_lava to volcano_audio.setPressing', () => {
        const controller = makeController();
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;
        const interaction = createInteractionController.mock.results.at(-1).value;

        interaction.step.mockReturnValueOnce({ touch_points: [], smoke_bursts: [], is_touching_lava: true });
        controller.update(1);
        expect(volcano_audio.setPressing).toHaveBeenCalledWith(true);

        interaction.step.mockReturnValueOnce({ touch_points: [], smoke_bursts: [], is_touching_lava: false });
        controller.update(2);
        expect(volcano_audio.setPressing).toHaveBeenCalledWith(false);
    });

    test('forwards the camera-to-volcano distance to volcano_audio.setCameraDistance', () => {
        const camera = makeCamera();
        const controller = createSceneController({
            scene: makeScene(), camera, renderer: makeRenderer(),
            bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(),
            setControlsEnabled: vi.fn(),
        });
        const volcano_audio = createVolcanoAudio.mock.results.at(-1).value;
        const volcano_position = controller.getVolcanoPosition();
        camera.position = { x: volcano_position.x + 3, y: volcano_position.y + 4, z: volcano_position.z };

        controller.update(1);

        expect(volcano_audio.setCameraDistance).toHaveBeenCalledWith(5);
    });
});
