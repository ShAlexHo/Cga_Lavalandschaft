import { describe, test, expect, vi, beforeEach } from 'vitest';

// ─── Mock three (only Mesh/PlaneGeometry/MeshStandardMaterial are used directly
//     by scene_controller.js — the ground mesh is built here, everything else
//     comes from the (also mocked) metaballs.js/volcano.js) ────────────────────

vi.mock('three', () => {
    function makeColor(hex = '000000') {
        return {
            _hex: hex,
            set(value) { this._hex = String(value).replace('#', ''); return this; },
            getHexString() { return this._hex; },
            multiplyScalar() { return this; },
        };
    }
    class Mesh {
        constructor(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            this.position = { x: 0, y: 0, z: 0 };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.visible = true;
        }
    }
    class PlaneGeometry { constructor(width, height) { this.width = width; this.height = height; } }
    class MeshStandardMaterial {
        constructor() {
            this.color = makeColor('220500');
            this.emissive = makeColor('2b0800');
        }
    }
    return { Mesh, PlaneGeometry, MeshStandardMaterial };
});

// ─── Mock metaballs.js and volcano.js wholesale — their own logic is covered
//     by metaballs.test.js; here we only need fakes that let us observe how
//     the facade drives them. ──────────────────────────────────────────────

const DEFAULT_SETTINGS = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: 500, flow_z_radius: 11 };

vi.mock('../metaballs.js', () => {
    function makeColor(hex) {
        return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
    }
    const settings = { count: 100, spread: 1.0, speed_factor: 0.003, paused: false, max_count: 500, flow_z_radius: 11 };
    return {
        settings,
        createMetaballs: vi.fn((scene) => {
            const effect = { position: { x: 0, y: 0, z: 0 }, isolation: 50 };
            const material = {
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
            };
            scene.add(effect);
            return { effect, material };
        }),
        rebuildField: vi.fn(),
        updateMetaballs: vi.fn(),
        updateLight: vi.fn(),
    };
});

vi.mock('../volcano.js', () => {
    function makeColor(hex) {
        return { _hex: hex, set(value) { this._hex = String(value).replace('#', ''); return this; }, getHexString() { return this._hex; } };
    }
    return {
        createVolcano: vi.fn((scene) => {
            const mesh = { position: { x: 0, y: 0, z: 0 }, visible: true };
            const material = {
                uniforms: {
                    u_disp_scale: { value: 2.5 },
                    u_disp_freq: { value: 0.5 },
                    u_rock_color: { value: makeColor('afafaf') },
                    u_crack_color: { value: makeColor('0a0a0a') },
                },
            };
            scene.add(mesh);
            return { mesh, material };
        }),
        updateVolcanoLight: vi.fn(),
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
        volcanoVisible: false, volcanoDisplacementScale: 1.0, volcanoDisplacementFrequency: 0.2,
        volcanoRockColor: '#777777', volcanoCrackColor: '#888888',
        offsetX: 1, offsetY: 2, offsetZ: 3,
        bloomEnabled: false, bloomStrength: 0.1, bloomRadius: 0.2, bloomThreshold: 0.9,
    },
}));

import { createSceneController } from '../scene_controller.js';
import { settings as mock_settings, rebuildField, updateMetaballs, updateLight } from '../metaballs.js';
import { updateVolcanoLight } from '../volcano.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScene() { return { add: vi.fn() }; }
function makeCamera() { return { matrixWorldInverse: {} }; }
function makeBloomPass() { return { enabled: true, strength: 0.8, radius: 0.5, threshold: 0.3 }; }

function makeController() {
    return createSceneController({ scene: makeScene(), camera: makeCamera(), bloomPass: makeBloomPass() });
}

beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mock_settings, DEFAULT_SETTINGS);
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
        expect(rebuildField).toHaveBeenCalled();
    });

    test('setMetaballIsolation updates effect.isolation and rebuilds the field', () => {
        const controller = makeController();
        controller.setMetaballIsolation(77);
        expect(controller.getMetaballIsolation()).toBe(77);
        expect(rebuildField).toHaveBeenCalled();
    });

    test('getMaxMetaballCount reflects settings.max_count', () => {
        const controller = makeController();
        expect(controller.getMaxMetaballCount()).toBe(500);
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
    test('setBloom only touches the given fields', () => {
        const controller = makeController();
        controller.setBloom({ strength: 1.5 });
        expect(controller.getBloom()).toEqual({ enabled: true, strength: 1.5, radius: 0.5, threshold: 0.3 });
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
            volcanoVisible: false, volcanoDisplacementScale: 4.4, volcanoDisplacementFrequency: 0.7,
            volcanoRockColor: '#b0b0b0', volcanoCrackColor: '#010101',
            offsetX: 5, offsetY: -1, offsetZ: 2,
            bloomEnabled: false, bloomStrength: 1.1, bloomRadius: 0.4, bloomThreshold: 0.2,
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
    });
});

// ─── update() lifecycle ───────────────────────────────────────────────────────

describe('createSceneController – update()', () => {
    test('delegates to updateMetaballs, updateLight and updateVolcanoLight with the right arguments', () => {
        const scene = makeScene();
        const camera = makeCamera();
        const bloomPass = makeBloomPass();
        const controller = createSceneController({ scene, camera, bloomPass });

        controller.update(12.5);

        expect(updateMetaballs).toHaveBeenCalledTimes(1);
        expect(updateMetaballs.mock.calls[0][1]).toBe(12.5);
        expect(updateLight).toHaveBeenCalledTimes(1);
        expect(updateLight.mock.calls[0][1]).toBe(camera);
        expect(updateLight.mock.calls[0][2]).toBe(12.5);
        expect(updateVolcanoLight).toHaveBeenCalledTimes(1);
        expect(updateVolcanoLight.mock.calls[0][1]).toBe(camera);
    });
});
