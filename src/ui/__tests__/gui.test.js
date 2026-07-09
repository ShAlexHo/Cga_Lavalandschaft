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

        getMetaballCount: vi.fn(() => 100),
        setMetaballCount: vi.fn(),
        getMaxMetaballCount: vi.fn(() => 500),
        getMetaballIsolation: vi.fn(() => 50),
        setMetaballIsolation: vi.fn(),
        getMetaballSpread: vi.fn(() => 1.0),
        setMetaballSpread: vi.fn(),
        getMetaballSpeed: vi.fn(() => 0.003),
        setMetaballSpeed: vi.fn(),
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
        getGroundHeight: vi.fn(() => -6),
        setGroundHeight: vi.fn(),

        getVolcanoVisible: vi.fn(() => true),
        setVolcanoVisible: vi.fn(),
        getVolcanoRockColor: vi.fn(() => '#afafaf'),
        setVolcanoRockColor: vi.fn(),
        getVolcanoCrackColor: vi.fn(() => '#0a0a0a'),
        setVolcanoCrackColor: vi.fn(),
        getVolcanoDisplacementScale: vi.fn(() => 2.5),
        setVolcanoDisplacementScale: vi.fn(),
        getVolcanoDisplacementFrequency: vi.fn(() => 0.5),
        setVolcanoDisplacementFrequency: vi.fn(),

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

        getOffsetX: vi.fn(() => 0),
        setOffsetX: vi.fn(),
        getOffsetY: vi.fn(() => 0),
        setOffsetY: vi.fn(),
        getOffsetZ: vi.fn(() => 0),
        setOffsetZ: vi.fn(),

        getBloom: vi.fn(() => ({ enabled: true, strength: 0.8, radius: 0.5, threshold: 0.3 })),
        setBloom: vi.fn(),

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
            'Metaballs', 'Lavafarbe', 'Noise', 'Boden', 'Vulkan', 'Rauch & Asche',
            'Position (Vulkan + Lava)', 'Bloom', 'Speichern / Laden',
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
        ['crack_color', 'setVolcanoCrackColor', '#000001'],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Vulkan', key, value);
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
        ['enabled', { enabled: false }],
        ['strength', { strength: 1.2 }],
        ['radius', { radius: 0.9 }],
        ['threshold', { threshold: 0.6 }],
    ])('%s onChange calls facade.setBloom with a partial patch', (key, patch) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        const value = Object.values(patch)[0];
        fire(registry, 'Bloom', key, value);
        expect(facade.setBloom).toHaveBeenCalledWith(patch);
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
