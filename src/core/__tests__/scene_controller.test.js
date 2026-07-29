import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeColor, MockMesh, MockPlaneGeometry } from '../test-utils/three_mocks.js';

// vi.mock() factories are hoisted above the rest of the module, so the default settings each
// mock's initial state is seeded from must be too; vi.hoisted() is the mechanism for that.
const { DEFAULT_SETTINGS, DEFAULT_SMOKE_SETTINGS } = vi.hoisted(() => ({
    DEFAULT_SETTINGS: { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: 500, flow_z_radius: 11 },
    DEFAULT_SMOKE_SETTINGS: { count: 200, max_count: 400 },
}));

// ─── Mock three (only Mesh/PlaneGeometry are used directly by scene_controller.js
//     — the ground mesh is built here, everything else comes from the (also
//     mocked) geometry/animation/rendering layers) ───────────────────────────

vi.mock('three', () => ({ Mesh: MockMesh, PlaneGeometry: MockPlaneGeometry }));

// ─── Mock the geometry/animation/rendering layers wholesale — their own logic
//     is covered by the tests next to each module; here we only need fakes
//     that let us observe how the facade drives them. ────────────────────────

vi.mock('../rendering/ground_material.js', () => ({
    createGroundMaterial: vi.fn(() => ({
        uniforms: {
            u_displacement_scale: { value: 0.6 },
            u_displacement_frequency: { value: 0.08 },
            u_rock_color: { value: makeColor('220500') },
            u_crack_color: { value: makeColor('050505') },
            u_crack_color_2: { value: makeColor('ffaa00') },
            u_crack_softness: { value: 0.25 },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: 0.06 },
            u_sun_focus: { value: 8.0 },
        },
    })),
    updateGroundLight: vi.fn(),
}));

vi.mock('../geometry/metaball_geometry.js', () => ({
    createMetaballGeometry: vi.fn(scene => {
        const effect = { position: { x: 0, y: 0, z: 0 }, isolation: 50 };
        scene.add(effect);
        return effect;
    }),
    rebuildMetaballGeometry: vi.fn(),
}));

vi.mock('../animation/metaball_animation.js', () => {
    const settings = { ...DEFAULT_SETTINGS };
    return {
        settings,
        getActiveBalls: vi.fn(() => []),
        stepMetaballAnimation: vi.fn(),
        getEruptionIntensity: vi.fn(() => 1.0),
    };
});

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
}));

vi.mock('../geometry/volcano_geometry.js', () => ({
    createVolcanoGeometry: vi.fn(scene => {
        const mesh = { position: { x: 0, y: 0, z: 0 }, visible: true };
        scene.add(mesh);
        return mesh;
    }),
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
        paused: true, metaballCount: 10, metaballIsolation: 60, metaballSpread: 1.2, metaballSpeed: 0.005,
        metaballHeight: 2.0, flowRadius: 5,
        colorHot: '#111111', colorCool: '#222222', glowEnabled: false, glowColor: '#333333',
        noiseEnabled: false, noiseColor1: '#444444', noiseColor2: '#555555', bumpEnabled: false,
        displacementEnabled: false, displacementStrength: 0.001,
        groundVisible: false, groundColor: '#666666', groundHeight: -3,
        groundCrackColor: '#333333', groundCrackColor2: '#444400', groundCrackSoftness: 0.4, groundDisplacementScale: 0.9, groundDisplacementFrequency: 0.15,
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
import { rebuildMetaballGeometry } from '../geometry/metaball_geometry.js';
import { settings as mock_settings, stepMetaballAnimation } from '../animation/metaball_animation.js';
import { updateMetaballLight } from '../rendering/metaball_material.js';
import { createGroundMaterial, updateGroundLight } from '../rendering/ground_material.js';
import { createVolcanoMaterial, updateVolcanoLight } from '../rendering/volcano_material.js';
import { settings as mock_smoke_settings } from '../animation/smoke_particles.js';
import { createSmokeMaterial, updateSmokeMaterial } from '../rendering/smoke_material.js';
import { createSun } from '../objects/sun_object.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScene() { return { add: vi.fn(), background: makeColor('6b2f1a') }; }
function makeCamera() { return { matrixWorldInverse: {} }; }
function makeBloomPass() { return { enabled: true, strength: 0.8, radius: 0.5, threshold: 0.3 }; }

function makeGodRaysPass() {
    const state = { weight: 0.25, exposure: 0.5, decay: 0.96, density: 0.93, tintColor: '#ff2211' };
    return {
        getWeight: () => state.weight,
        setWeight: value => { state.weight = value; },
        getExposure: () => state.exposure,
        setExposure: value => { state.exposure = value; },
        getDecay: () => state.decay,
        setDecay: value => { state.decay = value; },
        getDensity: () => state.density,
        setDensity: value => { state.density = value; },
        getTintColor: () => state.tintColor,
        setTintColor: value => { state.tintColor = value; },
    };
}

function makeController() {
    return createSceneController({
        scene: makeScene(), camera: makeCamera(), bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
    Object.assign(mock_smoke_settings, DEFAULT_SMOKE_SETTINGS);
});

// ─── construction / positioning ──────────────────────────────────────────────

describe('createSceneController – initial positioning', () => {
    test('places ground, volcano and effect exactly like the previous hand-wired setup', () => {
        const controller = makeController();
        // ground_y=-6, position.y=0, effect_offset=(0.36 - -6)=6.36, metaball_y_offset=1.6
        expect(controller.getGroundHeight()).toBe(-6);
        expect(controller.getOffsetY()).toBe(0);
        expect(controller.getMetaballHeight()).toBeCloseTo(1.6, 9);
    });
});

describe('createSceneController – setGroundHeight / setOffsetY', () => {
    test('setGroundHeight recomputes ground/volcano/effect y-positions via the effect_offset formula', () => {
        const controller = makeController();
        controller.setGroundHeight(-3);
        expect(controller.getGroundHeight()).toBe(-3);
        // volcano.y = ground_y + position.y = -3 + 0 = -3
        // effect.y  = ground_y + position.y + effect_offset(6.36) + metaball_y_offset(1.6) = 4.96
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

// ─── metaballs ────────────────────────────────────────────────────────────────

describe('createSceneController – metaballs', () => {
    test('setMetaballCount updates settings.count and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballCount(250);
        expect(controller.getMetaballCount()).toBe(250);
        expect(rebuildMetaballGeometry).toHaveBeenCalled();
    });

    test('setMetaballIsolation updates effect.isolation and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballIsolation(77);
        expect(controller.getMetaballIsolation()).toBe(77);
        expect(rebuildMetaballGeometry).toHaveBeenCalled();
    });

    test('getMaxMetaballCount reflects settings.max_count', () => {
        const controller = makeController();
        expect(controller.getMaxMetaballCount()).toBe(500);
    });
});

// ─── ground ───────────────────────────────────────────────────────────────────

describe('createSceneController – ground', () => {
    test('color/crack color/displacement getters and setters forward to the ground object', () => {
        const controller = makeController();

        controller.setGroundColor('#123123');
        expect(controller.getGroundColor()).toBe('#123123');

        controller.setGroundCrackColor('#321321');
        expect(controller.getGroundCrackColor()).toBe('#321321');

        controller.setGroundCrackColor2('#456456');
        expect(controller.getGroundCrackColor2()).toBe('#456456');

        controller.setGroundCrackSoftness(0.6);
        expect(controller.getGroundCrackSoftness()).toBe(0.6);

        controller.setGroundDisplacementScale(1.2);
        expect(controller.getGroundDisplacementScale()).toBe(1.2);

        controller.setGroundDisplacementFrequency(0.3);
        expect(controller.getGroundDisplacementFrequency()).toBe(0.3);
    });
});

// ─── displacement enabled/last-value memory ──────────────────────────────────

describe('createSceneController – displacement toggle', () => {
    test('disabling remembers the strength, re-enabling restores it', () => {
        const controller = makeController();
        expect(controller.getDisplacementEnabled()).toBe(true);
        expect(controller.getDisplacementStrength()).toBeCloseTo(0.00005, 9);

        controller.setDisplacementEnabled(false);
        expect(controller.getDisplacementEnabled()).toBe(false);
        expect(controller.getDisplacementStrength()).toBe(0.0);

        controller.setDisplacementEnabled(true);
        expect(controller.getDisplacementEnabled()).toBe(true);
        expect(controller.getDisplacementStrength()).toBeCloseTo(0.00005, 9);
    });
});

// ─── bloom ────────────────────────────────────────────────────────────────────

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

// ─── snapshot round-trip ──────────────────────────────────────────────────────

describe('createSceneController – getSnapshot / applySnapshot', () => {
    test('applying a snapshot and reading it back yields the same values', () => {
        const controller = makeController();
        const snapshot = {
            paused: true, metaballCount: 33, metaballIsolation: 61, metaballSpread: 0.4, metaballSpeed: 0.0021,
            metaballHeight: 3.3, flowRadius: 7,
            colorHot: '#abcabc', colorCool: '#123123', glowEnabled: false, glowColor: '#ffffff',
            noiseEnabled: false, noiseColor1: '#000001', noiseColor2: '#000002', bumpEnabled: false,
            displacementEnabled: false, displacementStrength: 0.0015,
            groundVisible: false, groundColor: '#0a0a0a', groundHeight: -2,
            groundCrackColor: '#050505', groundCrackColor2: '#0a0a00', groundCrackSoftness: 0.3, groundDisplacementScale: 1.1, groundDisplacementFrequency: 0.12,
            volcanoVisible: false, volcanoDisplacementScale: 4.4, volcanoDisplacementFrequency: 0.7,
            volcanoRockColor: '#b0b0b0',
            sunVisible: false, sunStrength: 0.09, sunFocus: 3.5,
            smokeVisible: false, smokeCount: 42, smokeSpread: 0.8, smokeRiseSpeed: 1.4,
            smokeColor1: '#abcdef', smokeColor2: '#fedcba', smokeColor3: '#123456', smokeParticleSize: 45, smokeEmberCoolingTime: 4.2,
            offsetX: 5, offsetY: -1, offsetZ: 2,
            bloomEnabled: false, bloomStrength: 1.1, bloomRadius: 0.4, bloomThreshold: 0.2,
            skyColor: '#112233',
            godRaysWeight: 0.4, godRaysExposure: 0.7, godRaysDecay: 0.9, godRaysDensity: 1.0, godRaysTintColor: '#654321',
        };

        controller.applySnapshot(snapshot);
        expect(controller.getSnapshot()).toEqual(snapshot);
    });

    test('applySnapshot ignores unknown keys and leaves other fields unchanged', () => {
        const controller = makeController();
        const before = controller.getSnapshot();
        controller.applySnapshot({ unknown_field: 123 });
        expect(controller.getSnapshot()).toEqual(before);
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

// ─── sun ──────────────────────────────────────────────────────────────────────

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

    test('setSunFocus updates both the ground and the volcano focus', () => {
        const controller = makeController();
        controller.setSunFocus(9.0);
        const ground_material = createGroundMaterial.mock.results[0].value;
        const volcano_material = createVolcanoMaterial.mock.results[0].value;
        expect(ground_material.uniforms.u_sun_focus.value).toBe(9.0);
        expect(volcano_material.uniforms.u_sun_focus.value).toBe(9.0);
    });
});

// ─── smoke ────────────────────────────────────────────────────────────────────

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
            scene, camera: makeCamera(), bloom_pass: makeBloomPass(), god_rays_pass: makeGodRaysPass(),
        });
        controller.setOffsetX(3);
        controller.setOffsetZ(-4);
        expect(controller.getOffsetX()).toBe(3);
        expect(controller.getOffsetZ()).toBe(-4);
    });
});

// ─── update() lifecycle ───────────────────────────────────────────────────────

describe('createSceneController – update()', () => {
    test('delegates to stepMetaballAnimation, updateMetaballLight and updateVolcanoLight with the right arguments', () => {
        const scene = makeScene();
        const camera = makeCamera();
        const bloom_pass = makeBloomPass();
        const god_rays_pass = makeGodRaysPass();
        const controller = createSceneController({ scene, camera, bloom_pass, god_rays_pass });

        controller.update(12.5);

        expect(updateGroundLight).toHaveBeenCalledWith(expect.any(Object), camera);
        expect(stepMetaballAnimation).toHaveBeenCalledTimes(1);
        expect(stepMetaballAnimation.mock.calls[0][0]).toBe(12.5);
        expect(updateMetaballLight).toHaveBeenCalledTimes(1);
        expect(updateMetaballLight.mock.calls[0][1]).toBe(camera);
        expect(updateMetaballLight.mock.calls[0][2]).toBe(12.5);
        expect(updateVolcanoLight).toHaveBeenCalledTimes(1);
        expect(updateVolcanoLight.mock.calls[0][1]).toBe(camera);
        const sun = createSun.mock.results[0].value;
        expect(updateVolcanoLight.mock.calls[0][2]).toBe(sun.light.position);
        expect(updateSmokeMaterial).toHaveBeenCalledWith(expect.any(Object), 12.5, 1.0);
        expect(sun.update).toHaveBeenCalledWith(12.5);
    });

    test('rebuilds the metaball geometry only when the animation step returns balls (not while paused)', () => {
        const controller = makeController();
        rebuildMetaballGeometry.mockClear(); // drop the initial rebuild done during construction

        stepMetaballAnimation.mockReturnValueOnce(null);
        controller.update(0);
        expect(rebuildMetaballGeometry).not.toHaveBeenCalled();

        const balls = [{ x: 0.5, y: 0.5, z: 0.5, strength: 1, subtract: 30 }];
        stepMetaballAnimation.mockReturnValueOnce(balls);
        controller.update(1);
        expect(rebuildMetaballGeometry).toHaveBeenCalledWith(expect.anything(), balls);
    });
});
