import { describe, test, expect, vi, beforeEach } from 'vitest';

// ─── Mock dat.gui ────────────────────────────────────────────────────────────

vi.mock('dat.gui', () => {
    return { GUI: vi.fn() };
});

// ─── Mock persistence.js ─────────────────────────────────────────────────────

vi.mock('../../persistence/persistence.js', () => ({
    saveToLocalStorage: vi.fn(),
    loadFromLocalStorage: vi.fn(() => null),
    downloadJson: vi.fn(),
    uploadJson: vi.fn(),
}));

import { GUI } from 'dat.gui';
import { saveToLocalStorage, loadFromLocalStorage, downloadJson, uploadJson } from '../../persistence/persistence.js';
import { setupGui } from '../gui.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** A minimal fake of the scene_controller facade, with sensible getter defaults. */
function makeFacade(overrides = {}) {
    return {
        isPaused: vi.fn(() => false),
        setPaused: vi.fn(),
        getInteractionMode: vi.fn(() => false),
        setInteractionMode: vi.fn(),
        getInteractionSmokeVisible: vi.fn(() => true),
        setInteractionSmokeVisible: vi.fn(),

        getMetaballCount: vi.fn(() => 100),
        setMetaballCount: vi.fn(),
        getMaxMetaballCount: vi.fn(() => 500),
        getMetaballIsolation: vi.fn(() => 50),
        setMetaballIsolation: vi.fn(),
        getMetaballSpread: vi.fn(() => 1.0),
        setMetaballSpread: vi.fn(),
        getMetaballSpeed: vi.fn(() => 0.003),
        setMetaballSpeed: vi.fn(),
        getMetaballSinkSpeed: vi.fn(() => 0.25),
        setMetaballSinkSpeed: vi.fn(),
        getMetaballDisappearY: vi.fn(() => 0.25),
        setMetaballDisappearY: vi.fn(),
        getMetaballHeight: vi.fn(() => 1.6),
        setMetaballHeight: vi.fn(),
        getFlowRadius: vi.fn(() => 11),
        setFlowRadius: vi.fn(),

        getColorHot: vi.fn(() => '#a01500'),
        setColorHot: vi.fn(),
        getColorCool: vi.fn(() => '#7c3027'),
        setColorCool: vi.fn(),
        getGlowEnabled: vi.fn(() => true),
        setGlowEnabled: vi.fn(),
        getGlowColor: vi.fn(() => '#ff3f00'),
        setGlowColor: vi.fn(),

        getNoiseEnabled: vi.fn(() => true),
        setNoiseEnabled: vi.fn(),
        getNoiseColor1: vi.fn(() => '#7c3027'),
        setNoiseColor1: vi.fn(),
        getNoiseColor2: vi.fn(() => '#ea6927'),
        setNoiseColor2: vi.fn(),
        getBumpEnabled: vi.fn(() => true),
        setBumpEnabled: vi.fn(),
        getDisplacementEnabled: vi.fn(() => true),
        setDisplacementEnabled: vi.fn(),
        getDisplacementStrength: vi.fn(() => 0.00005),
        setDisplacementStrength: vi.fn(),

        getGroundVisible: vi.fn(() => true),
        setGroundVisible: vi.fn(),
        getGroundColor: vi.fn(() => '#220500'),
        setGroundColor: vi.fn(),
        getGroundColor2: vi.fn(() => '#2a1f1a'),
        setGroundColor2: vi.fn(),
        getGroundColor3: vi.fn(() => '#1c1f24'),
        setGroundColor3: vi.fn(),
        getGroundColor4: vi.fn(() => '#35404a'),
        setGroundColor4: vi.fn(),
        getGroundCrackColor: vi.fn(() => '#050505'),
        setGroundCrackColor: vi.fn(),
        getGroundCrackColor2: vi.fn(() => '#ffaa00'),
        setGroundCrackColor2: vi.fn(),
        getGroundCrackColor3: vi.fn(() => '#ffd700'),
        setGroundCrackColor3: vi.fn(),
        getGroundCrackColor4: vi.fn(() => '#dd0000'),
        setGroundCrackColor4: vi.fn(),
        getGroundCrackSoftness: vi.fn(() => 0.25),
        setGroundCrackSoftness: vi.fn(),
        getGroundProximityColor: vi.fn(() => '#9b9696'),
        setGroundProximityColor: vi.fn(),
        getGroundProximityNoiseColor: vi.fn(() => '#8a3a1a'),
        setGroundProximityNoiseColor: vi.fn(),
        getGroundProximityRadius: vi.fn(() => 18),
        setGroundProximityRadius: vi.fn(),
        getGroundSunFocusRadius: vi.fn(() => 4.5),
        setGroundSunFocusRadius: vi.fn(),
        getGroundRockVarianceRadius: vi.fn(() => 45.0),
        setGroundRockVarianceRadius: vi.fn(),
        getGroundDisplacementScale: vi.fn(() => 0.6),
        setGroundDisplacementScale: vi.fn(),
        getGroundDisplacementFrequency: vi.fn(() => 0.08),
        setGroundDisplacementFrequency: vi.fn(),
        getGroundHeight: vi.fn(() => -6),
        setGroundHeight: vi.fn(),

        getVolcanoVisible: vi.fn(() => true),
        setVolcanoVisible: vi.fn(),
        getVolcanoRockColor: vi.fn(() => '#afafaf'),
        setVolcanoRockColor: vi.fn(),
        getVolcanoDisplacementScale: vi.fn(() => 2.5),
        setVolcanoDisplacementScale: vi.fn(),
        getVolcanoDisplacementFrequency: vi.fn(() => 0.5),
        setVolcanoDisplacementFrequency: vi.fn(),

        getSunVisible: vi.fn(() => true),
        setSunVisible: vi.fn(),
        getSunStrength: vi.fn(() => 0.06),
        setSunStrength: vi.fn(),
        getSunFocus: vi.fn(() => 8.0),
        setSunFocus: vi.fn(),

        getSmokeVisible: vi.fn(() => true),
        setSmokeVisible: vi.fn(),
        getSmokeCount: vi.fn(() => 200),
        setSmokeCount: vi.fn(),
        getMaxSmokeCount: vi.fn(() => 400),
        getSmokeSpread: vi.fn(() => 1.0),
        setSmokeSpread: vi.fn(),
        getSmokeRiseSpeed: vi.fn(() => 1.0),
        setSmokeRiseSpeed: vi.fn(),
        getSmokeColor1: vi.fn(() => '#5c4534'),
        setSmokeColor1: vi.fn(),
        getSmokeColor2: vi.fn(() => '#cac2b4'),
        setSmokeColor2: vi.fn(),
        getSmokeColor3: vi.fn(() => '#d9622a'),
        setSmokeColor3: vi.fn(),
        getSmokeParticleSize: vi.fn(() => 22),
        setSmokeParticleSize: vi.fn(),
        getSmokeEmberCoolingTime: vi.fn(() => 2.5),
        setSmokeEmberCoolingTime: vi.fn(),

        getOffsetX: vi.fn(() => 0),
        setOffsetX: vi.fn(),
        getOffsetY: vi.fn(() => 0),
        setOffsetY: vi.fn(),
        getOffsetZ: vi.fn(() => 0),
        setOffsetZ: vi.fn(),

        getBloomEnabled: vi.fn(() => true),
        setBloomEnabled: vi.fn(),
        getBloomStrength: vi.fn(() => 0.8),
        setBloomStrength: vi.fn(),
        getBloomRadius: vi.fn(() => 0.5),
        setBloomRadius: vi.fn(),
        getBloomThreshold: vi.fn(() => 0.3),
        setBloomThreshold: vi.fn(),

        getSkyColor: vi.fn(() => '#6b2f1a'),
        setSkyColor: vi.fn(),

        getGodRaysWeight: vi.fn(() => 0.25),
        setGodRaysWeight: vi.fn(),
        getGodRaysExposure: vi.fn(() => 0.5),
        setGodRaysExposure: vi.fn(),
        getGodRaysDecay: vi.fn(() => 0.96),
        setGodRaysDecay: vi.fn(),
        getGodRaysDensity: vi.fn(() => 0.93),
        setGodRaysDensity: vi.fn(),
        getGodRaysTintColor: vi.fn(() => '#ff2211'),
        setGodRaysTintColor: vi.fn(),

        getSnapshot: vi.fn(() => ({ paused: false })),
        applySnapshot: vi.fn(),
        resetToDefaults: vi.fn(),

        ...overrides,
    };
}

/** A controller stub supporting the chaining setupGui relies on: .name().onChange(). */
function makeController() {
    const controller = {
        _on_change_callback: null,
        name: vi.fn().mockReturnThis(),
        onChange: vi.fn(function (callback) { controller._on_change_callback = callback; return controller; }),
        updateDisplay: vi.fn(),
    };
    return controller;
}

/**
 * Builds a fake dat.gui root + folders. Every add()/addColor() call is recorded
 * into `registry`, tagged with the folder name it was created under, so tests
 * can look up "the controller bound to Boden/height" without caring about call
 * order.
 */
function makeMockGui() {
    const registry = [];

    function record(folder_name) {
        return vi.fn((bound_object, key) => {
            const controller = makeController();
            registry.push({ folder: folder_name, obj: bound_object, key, controller });
            return controller;
        });
    }

    function makeFolder(name) {
        return { add: record(name), addColor: record(name), open: vi.fn() };
    }

    const gui = {
        add: record('root'),
        addColor: record('root'),
        addFolder: vi.fn(name => makeFolder(name)),
    };
    GUI.mockImplementation(() => gui);
    return { gui, registry };
}

function find(registry, folder, key) {
    const entry = registry.find(entry => entry.folder === folder && entry.key === key);
    if (!entry) throw new Error(`no controller registered for ${folder}/${key}`);
    return entry;
}

function fire(registry, folder, key, value) {
    const entry = find(registry, folder, key);
    expect(entry.controller._on_change_callback).toBeTypeOf('function');
    entry.controller._on_change_callback(value);
}

// ─── structure ───────────────────────────────────────────────────────────────

describe('setupGui – structure', () => {
    test('creates a GUI instance', () => {
        makeMockGui();
        setupGui(makeFacade());
        expect(GUI).toHaveBeenCalledOnce();
    });

    test('returns the GUI instance', () => {
        const { gui } = makeMockGui();
        const result = setupGui(makeFacade());
        expect(result).toBe(gui);
    });

    test('creates all expected folders, including Boden and Vulkan unconditionally', () => {
        const { gui } = makeMockGui();
        setupGui(makeFacade());
        const folders = gui.addFolder.mock.calls.map(call => call[0]);
        expect(folders).toEqual([
            'Metaballs', 'Lavafarbe', 'Noise', 'Boden', 'Vulkan', 'Sonne', 'Rauch & Asche',
            'Position (Vulkan + Lava)', 'Bloom', 'Himmel', 'Lichtstrahlen', 'Speichern / Laden',
        ]);
    });

    test('root paused control is seeded from facade.isPaused() and writes back via setPaused', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ isPaused: vi.fn(() => true) });
        setupGui(facade);
        const entry = find(registry, 'root', 'paused');
        expect(entry.obj.paused).toBe(true);
        fire(registry, 'root', 'paused', false);
        expect(facade.setPaused).toHaveBeenCalledWith(false);
    });

    test('root interaction_mode control is seeded from facade.getInteractionMode() and writes back via setInteractionMode', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getInteractionMode: vi.fn(() => true) });
        setupGui(facade);
        const entry = find(registry, 'root', 'interaction_mode');
        expect(entry.obj.interaction_mode).toBe(true);
        fire(registry, 'root', 'interaction_mode', false);
        expect(facade.setInteractionMode).toHaveBeenCalledWith(false);
    });

    test('root interaction_smoke_visible control is seeded from facade.getInteractionSmokeVisible() and writes back via setInteractionSmokeVisible', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getInteractionSmokeVisible: vi.fn(() => false) });
        setupGui(facade);
        const entry = find(registry, 'root', 'interaction_smoke_visible');
        expect(entry.obj.interaction_smoke_visible).toBe(false);
        fire(registry, 'root', 'interaction_smoke_visible', true);
        expect(facade.setInteractionSmokeVisible).toHaveBeenCalledWith(true);
    });
});

// ─── Metaballs folder ────────────────────────────────────────────────────────

describe('setupGui – Metaballs folder', () => {
    test('count control is seeded from getMetaballCount/getMaxMetaballCount and rebuilds via setMetaballCount', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getMetaballCount: vi.fn(() => 42), getMaxMetaballCount: vi.fn(() => 200) });
        setupGui(facade);
        const entry = find(registry, 'Metaballs', 'count');
        expect(entry.obj.count).toBe(42);
        fire(registry, 'Metaballs', 'count', 77);
        expect(facade.setMetaballCount).toHaveBeenCalledWith(77);
    });

    test.each([
        ['isolation', 'setMetaballIsolation'],
        ['spread', 'setMetaballSpread'],
        ['speed_factor', 'setMetaballSpeed'],
        ['sink_speed', 'setMetaballSinkSpeed'],
        ['disappear_y', 'setMetaballDisappearY'],
        ['height', 'setMetaballHeight'],
        ['flow_z_radius', 'setFlowRadius'],
    ])('%s onChange calls facade.%s', (key, setter) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Metaballs', key, 123);
        expect(facade[setter]).toHaveBeenCalledWith(123);
    });
});

// ─── Lavafarbe folder ────────────────────────────────────────────────────────

describe('setupGui – Lavafarbe folder', () => {
    test.each([
        ['color_hot', 'setColorHot', '#ff0000'],
        ['color_cool', 'setColorCool', '#220000'],
        ['glow_enabled', 'setGlowEnabled', false],
        ['glow_color', 'setGlowColor', '#ffaa00'],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Lavafarbe', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Noise folder ────────────────────────────────────────────────────────────

describe('setupGui – Noise folder', () => {
    test.each([
        ['noise', 'setNoiseEnabled', false],
        ['noise_color_1', 'setNoiseColor1', '#111111'],
        ['noise_color_2', 'setNoiseColor2', '#222222'],
        ['bumping', 'setBumpEnabled', false],
        ['displacement', 'setDisplacementEnabled', false],
        ['strength', 'setDisplacementStrength', 0.0012],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Noise', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Boden folder ────────────────────────────────────────────────────────────

describe('setupGui – Boden folder', () => {
    test.each([
        ['visible', 'setGroundVisible', false],
        ['color', 'setGroundColor', '#550000'],
        ['color_2', 'setGroundColor2', '#553300'],
        ['color_3', 'setGroundColor3', '#003355'],
        ['color_4', 'setGroundColor4', '#445566'],
        ['crack_color', 'setGroundCrackColor', '#000001'],
        ['crack_color_2', 'setGroundCrackColor2', '#000002'],
        ['crack_color_3', 'setGroundCrackColor3', '#000003'],
        ['crack_color_4', 'setGroundCrackColor4', '#000004'],
        ['crack_softness', 'setGroundCrackSoftness', 0.6],
        ['proximity_color', 'setGroundProximityColor', '#654321'],
        ['proximity_noise_color', 'setGroundProximityNoiseColor', '#123abc'],
        ['proximity_radius', 'setGroundProximityRadius', 12.5],
        ['sun_focus_radius', 'setGroundSunFocusRadius', 6.5],
        ['rock_variance_radius', 'setGroundRockVarianceRadius', 55.0],
        ['displacement_scale', 'setGroundDisplacementScale', 1.2],
        ['displacement_frequency', 'setGroundDisplacementFrequency', 0.2],
        ['height', 'setGroundHeight', -1.5],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Boden', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Vulkan folder ───────────────────────────────────────────────────────────

describe('setupGui – Vulkan folder', () => {
    test.each([
        ['visible', 'setVolcanoVisible', false],
        ['displacement_scale', 'setVolcanoDisplacementScale', 3.2],
        ['displacement_frequency', 'setVolcanoDisplacementFrequency', 0.9],
        ['rock_color', 'setVolcanoRockColor', '#999999'],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Vulkan', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Sonne folder ────────────────────────────────────────────────────────────

describe('setupGui – Sonne folder', () => {
    test.each([
        ['visible', 'setSunVisible', false],
        ['strength', 'setSunStrength', 0.12],
        ['focus', 'setSunFocus', 8.0],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Sonne', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Rauch & Asche folder ────────────────────────────────────────────────────

describe('setupGui – Rauch & Asche folder', () => {
    test('count control is seeded from getSmokeCount/getMaxSmokeCount and writes back via setSmokeCount', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getSmokeCount: vi.fn(() => 150), getMaxSmokeCount: vi.fn(() => 300) });
        setupGui(facade);
        const entry = find(registry, 'Rauch & Asche', 'count');
        expect(entry.obj.count).toBe(150);
        fire(registry, 'Rauch & Asche', 'count', 90);
        expect(facade.setSmokeCount).toHaveBeenCalledWith(90);
    });

    test.each([
        ['visible', 'setSmokeVisible', false],
        ['spread', 'setSmokeSpread', 1.8],
        ['rise_speed', 'setSmokeRiseSpeed', 2.1],
        ['color_1', 'setSmokeColor1', '#334455'],
        ['color_2', 'setSmokeColor2', '#aabbcc'],
        ['color_3', 'setSmokeColor3', '#ff8800'],
        ['particle_size', 'setSmokeParticleSize', 120],
        ['ember_cooling_time', 'setSmokeEmberCoolingTime', 4.5],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Rauch & Asche', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Position folder ─────────────────────────────────────────────────────────

describe('setupGui – Position folder', () => {
    test.each([
        ['x', 'setOffsetX', 4.5],
        ['y', 'setOffsetY', -2.0],
        ['z', 'setOffsetZ', 1.1],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Position (Vulkan + Lava)', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Bloom folder ────────────────────────────────────────────────────────────

describe('setupGui – Bloom folder', () => {
    test.each([
        ['enabled', 'setBloomEnabled', false],
        ['strength', 'setBloomStrength', 1.2],
        ['radius', 'setBloomRadius', 0.9],
        ['threshold', 'setBloomThreshold', 0.6],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Bloom', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Himmel folder ───────────────────────────────────────────────────────────

describe('setupGui – Himmel folder', () => {
    test('color onChange calls facade.setSkyColor', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Himmel', 'color', '#123456');
        expect(facade.setSkyColor).toHaveBeenCalledWith('#123456');
    });
});

// ─── Lichtstrahlen folder ────────────────────────────────────────────────────

describe('setupGui – Lichtstrahlen folder', () => {
    test.each([
        ['weight', 0.6, 'setGodRaysWeight'],
        ['exposure', 0.9, 'setGodRaysExposure'],
        ['decay', 0.88, 'setGodRaysDecay'],
        ['density', 1.1, 'setGodRaysDensity'],
        ['tint_color', '#abcdef', 'setGodRaysTintColor'],
    ])('%s onChange calls facade.%s', (key, value, setter) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Lichtstrahlen', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Persistenz ──────────────────────────────────────────────────────────────

describe('setupGui – Speichern / Laden', () => {
    beforeEach(() => {
        saveToLocalStorage.mockClear();
        loadFromLocalStorage.mockClear().mockReturnValue(null);
        downloadJson.mockClear();
        uploadJson.mockClear();
    });

    test('save saves the facade snapshot to localStorage and as a download', () => {
        const { registry } = makeMockGui();
        const snapshot = { paused: true, count: 7 };
        const facade = makeFacade({ getSnapshot: vi.fn(() => snapshot) });
        setupGui(facade);

        const entry = find(registry, 'Speichern / Laden', 'save');
        entry.obj.save();

        expect(saveToLocalStorage).toHaveBeenCalledWith(snapshot);
        expect(downloadJson).toHaveBeenCalledWith(snapshot);
    });

    test('load applies the uploaded data via the facade and refreshes every controller display', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);

        const uploaded = { count: 55 };
        uploadJson.mockImplementation(on_loaded => on_loaded(uploaded));

        const entry = find(registry, 'Speichern / Laden', 'load');
        entry.obj.load();

        expect(facade.applySnapshot).toHaveBeenCalledWith(uploaded);
        registry
            .filter(entry => entry.folder !== 'Speichern / Laden')
            .forEach(entry => expect(entry.controller.updateDisplay).toHaveBeenCalled());
    });

    test('reset resets the facade to defaults and refreshes every controller display', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);

        const entry = find(registry, 'Speichern / Laden', 'reset');
        entry.obj.reset();

        expect(facade.resetToDefaults).toHaveBeenCalledOnce();
        registry
            .filter(entry => entry.folder !== 'Speichern / Laden')
            .forEach(entry => expect(entry.controller.updateDisplay).toHaveBeenCalled());
    });

    test('applies a saved snapshot from localStorage on boot and refreshes the display', () => {
        makeMockGui();
        const saved = { count: 9 };
        loadFromLocalStorage.mockReturnValue(saved);
        const facade = makeFacade();

        setupGui(facade);

        expect(facade.applySnapshot).toHaveBeenCalledWith(saved);
    });

    test('does not touch the facade on boot when there is no saved snapshot', () => {
        makeMockGui();
        loadFromLocalStorage.mockReturnValue(null);
        const facade = makeFacade();

        setupGui(facade);

        expect(facade.applySnapshot).not.toHaveBeenCalled();
    });

    test('registers a beforeunload handler that saves the current snapshot', () => {
        makeMockGui();
        const snapshot = { paused: false };
        const facade = makeFacade({ getSnapshot: vi.fn(() => snapshot) });
        const add_event_listener_spy = vi.spyOn(window, 'addEventListener');

        setupGui(facade);
        const handler = add_event_listener_spy.mock.calls.find(call => call[0] === 'beforeunload')[1];
        saveToLocalStorage.mockClear();
        handler();

        expect(saveToLocalStorage).toHaveBeenCalledWith(snapshot);
        add_event_listener_spy.mockRestore();
    });
});
