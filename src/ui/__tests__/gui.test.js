import { describe, test, expect, vi, beforeEach } from 'vitest';

// ─── Mock dat.gui ────────────────────────────────────────────────────────────

vi.mock('dat.gui', () => {
    return { GUI: vi.fn() };
});

// ─── Mock persistence.js ─────────────────────────────────────────────────────

vi.mock('../persistence.js', () => ({
    save_to_local_storage: vi.fn(),
    load_from_local_storage: vi.fn(() => null),
    download_json: vi.fn(),
    upload_json: vi.fn(),
}));

import { GUI } from 'dat.gui';
import { save_to_local_storage, load_from_local_storage, download_json, upload_json } from '../persistence.js';
import { setup_gui } from '../gui.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** A minimal fake of the scene_controller facade, with sensible getter defaults. */
function make_facade(overrides = {}) {
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
        getVolcanoDispScale: vi.fn(() => 2.5),
        setVolcanoDispScale: vi.fn(),
        getVolcanoDispFreq: vi.fn(() => 0.5),
        setVolcanoDispFreq: vi.fn(),

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

/** A controller stub supporting the chaining setup_gui relies on: .name().onChange(). */
function make_controller() {
    const ctrl = {
        _onChange_cb: null,
        name: vi.fn().mockReturnThis(),
        onChange: vi.fn(function (cb) { ctrl._onChange_cb = cb; return ctrl; }),
        updateDisplay: vi.fn(),
    };
    return ctrl;
}

/**
 * Builds a fake dat.gui root + folders. Every add()/addColor() call is recorded
 * into `registry`, tagged with the folder name it was created under, so tests
 * can look up "the controller bound to Boden/hoehe" without caring about call
 * order.
 */
function make_mock_gui() {
    const registry = [];

    function record(folder_name) {
        return vi.fn((obj, key) => {
            const controller = make_controller();
            registry.push({ folder: folder_name, obj, key, controller });
            return controller;
        });
    }

    function make_folder(name) {
        return { add: record(name), addColor: record(name), open: vi.fn() };
    }

    const gui = {
        add: record('root'),
        addColor: record('root'),
        addFolder: vi.fn((name) => make_folder(name)),
    };
    GUI.mockImplementation(() => gui);
    return { gui, registry };
}

function find(registry, folder, key) {
    const entry = registry.find(e => e.folder === folder && e.key === key);
    if (!entry) throw new Error(`no controller registered for ${folder}/${key}`);
    return entry;
}

function fire(registry, folder, key, value) {
    const entry = find(registry, folder, key);
    expect(entry.controller._onChange_cb).toBeTypeOf('function');
    entry.controller._onChange_cb(value);
}

// ─── structure ───────────────────────────────────────────────────────────────

describe('setup_gui – structure', () => {
    test('creates a GUI instance', () => {
        const { } = make_mock_gui();
        setup_gui(make_facade());
        expect(GUI).toHaveBeenCalledOnce();
    });

    test('returns the GUI instance', () => {
        const { gui } = make_mock_gui();
        const result = setup_gui(make_facade());
        expect(result).toBe(gui);
    });

    test('creates all expected folders, including Boden and Vulkan unconditionally', () => {
        const { gui } = make_mock_gui();
        setup_gui(make_facade());
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).toEqual([
            'Metaballs', 'Lavafarbe', 'Noise', 'Boden', 'Vulkan',
            'Position (Vulkan + Lava)', 'Bloom', 'Speichern / Laden',
        ]);
    });

    test('root paused control is seeded from facade.isPaused() and writes back via setPaused', () => {
        const { registry } = make_mock_gui();
        const facade = make_facade({ isPaused: vi.fn(() => true) });
        setup_gui(facade);
        const entry = find(registry, 'root', 'paused');
        expect(entry.obj.paused).toBe(true);
        fire(registry, 'root', 'paused', false);
        expect(facade.setPaused).toHaveBeenCalledWith(false);
    });
});

// ─── Metaballs folder ────────────────────────────────────────────────────────

describe('setup_gui – Metaballs folder', () => {
    test('count control is seeded from getMetaballCount/getMaxMetaballCount and rebuilds via setMetaballCount', () => {
        const { registry } = make_mock_gui();
        const facade = make_facade({ getMetaballCount: vi.fn(() => 42), getMaxMetaballCount: vi.fn(() => 200) });
        setup_gui(facade);
        const entry = find(registry, 'Metaballs', 'count');
        expect(entry.obj.count).toBe(42);
        fire(registry, 'Metaballs', 'count', 77);
        expect(facade.setMetaballCount).toHaveBeenCalledWith(77);
    });

    test.each([
        ['isolation', 'setMetaballIsolation'],
        ['spread', 'setMetaballSpread'],
        ['speed_factor', 'setMetaballSpeed'],
        ['hoehe', 'setMetaballHeight'],
        ['flow_z_radius', 'setFlowRadius'],
    ])('%s onChange calls facade.%s', (key, setter) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Metaballs', key, 123);
        expect(facade[setter]).toHaveBeenCalledWith(123);
    });
});

// ─── Lavafarbe folder ────────────────────────────────────────────────────────

describe('setup_gui – Lavafarbe folder', () => {
    test.each([
        ['farbe_hell', 'setColorHot', '#ff0000'],
        ['farbe_dunkel', 'setColorCool', '#220000'],
        ['gluehen', 'setGlowEnabled', false],
        ['glueh_farbe', 'setGlowColor', '#ffaa00'],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Lavafarbe', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Noise folder ────────────────────────────────────────────────────────────

describe('setup_gui – Noise folder', () => {
    test.each([
        ['noise', 'setNoiseEnabled', false],
        ['noise_farbe_1', 'setNoiseColor1', '#111111'],
        ['noise_farbe_2', 'setNoiseColor2', '#222222'],
        ['bumping', 'setBumpEnabled', false],
        ['displacement', 'setDisplacementEnabled', false],
        ['staerke', 'setDisplacementStrength', 0.0012],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Noise', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Boden folder ────────────────────────────────────────────────────────────

describe('setup_gui – Boden folder', () => {
    test.each([
        ['sichtbar', 'setGroundVisible', false],
        ['farbe', 'setGroundColor', '#550000'],
        ['hoehe', 'setGroundHeight', -1.5],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Boden', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Vulkan folder ───────────────────────────────────────────────────────────

describe('setup_gui – Vulkan folder', () => {
    test.each([
        ['sichtbar', 'setVolcanoVisible', false],
        ['disp_scale', 'setVolcanoDispScale', 3.2],
        ['disp_freq', 'setVolcanoDispFreq', 0.9],
        ['fels_farbe', 'setVolcanoRockColor', '#999999'],
        ['riss_farbe', 'setVolcanoCrackColor', '#000001'],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Vulkan', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Position folder ─────────────────────────────────────────────────────────

describe('setup_gui – Position folder', () => {
    test.each([
        ['x', 'setOffsetX', 4.5],
        ['y', 'setOffsetY', -2.0],
        ['z', 'setOffsetZ', 1.1],
    ])('%s onChange calls facade.%s', (key, setter, value) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        fire(registry, 'Position (Vulkan + Lava)', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Bloom folder ────────────────────────────────────────────────────────────

describe('setup_gui – Bloom folder', () => {
    test.each([
        ['enabled', { enabled: false }],
        ['strength', { strength: 1.2 }],
        ['radius', { radius: 0.9 }],
        ['threshold', { threshold: 0.6 }],
    ])('%s onChange calls facade.setBloom with a partial patch', (key, patch) => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);
        const value = Object.values(patch)[0];
        fire(registry, 'Bloom', key, value);
        expect(facade.setBloom).toHaveBeenCalledWith(patch);
    });
});

// ─── Persistenz ──────────────────────────────────────────────────────────────

describe('setup_gui – Speichern / Laden', () => {
    beforeEach(() => {
        save_to_local_storage.mockClear();
        load_from_local_storage.mockClear().mockReturnValue(null);
        download_json.mockClear();
        upload_json.mockClear();
    });

    test('speichern saves the facade snapshot to localStorage and as a download', () => {
        const { registry } = make_mock_gui();
        const snapshot = { paused: true, count: 7 };
        const facade = make_facade({ getSnapshot: vi.fn(() => snapshot) });
        setup_gui(facade);

        const entry = find(registry, 'Speichern / Laden', 'speichern');
        entry.obj.speichern();

        expect(save_to_local_storage).toHaveBeenCalledWith(snapshot);
        expect(download_json).toHaveBeenCalledWith(snapshot);
    });

    test('laden applies the uploaded data via the facade and refreshes every controller display', () => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);

        const uploaded = { count: 55 };
        upload_json.mockImplementation(on_loaded => on_loaded(uploaded));

        const entry = find(registry, 'Speichern / Laden', 'laden');
        entry.obj.laden();

        expect(facade.applySnapshot).toHaveBeenCalledWith(uploaded);
        registry
            .filter(e => e.folder !== 'Speichern / Laden')
            .forEach(e => expect(e.controller.updateDisplay).toHaveBeenCalled());
    });

    test('standard resets the facade to defaults and refreshes every controller display', () => {
        const { registry } = make_mock_gui();
        const facade = make_facade();
        setup_gui(facade);

        const entry = find(registry, 'Speichern / Laden', 'standard');
        entry.obj.standard();

        expect(facade.resetToDefaults).toHaveBeenCalledOnce();
        registry
            .filter(e => e.folder !== 'Speichern / Laden')
            .forEach(e => expect(e.controller.updateDisplay).toHaveBeenCalled());
    });

    test('applies a saved snapshot from localStorage on boot and refreshes the display', () => {
        make_mock_gui();
        const saved = { count: 9 };
        load_from_local_storage.mockReturnValue(saved);
        const facade = make_facade();

        setup_gui(facade);

        expect(facade.applySnapshot).toHaveBeenCalledWith(saved);
    });

    test('does not touch the facade on boot when there is no saved snapshot', () => {
        make_mock_gui();
        load_from_local_storage.mockReturnValue(null);
        const facade = make_facade();

        setup_gui(facade);

        expect(facade.applySnapshot).not.toHaveBeenCalled();
    });

    test('registers a beforeunload handler that saves the current snapshot', () => {
        make_mock_gui();
        const snapshot = { paused: false };
        const facade = make_facade({ getSnapshot: vi.fn(() => snapshot) });
        const add_spy = vi.spyOn(window, 'addEventListener');

        setup_gui(facade);
        const handler = add_spy.mock.calls.find(c => c[0] === 'beforeunload')[1];
        save_to_local_storage.mockClear();
        handler();

        expect(save_to_local_storage).toHaveBeenCalledWith(snapshot);
        add_spy.mockRestore();
    });
});
