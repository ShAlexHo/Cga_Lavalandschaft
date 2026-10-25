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

import { setupGui } from '../gui.js';
import { GUI } from 'dat.gui';
import { saveToLocalStorage, loadFromLocalStorage } from '../../persistence/persistence.js';
import { setLanguage } from '../../../../ui/language.js';

// the folder-based lookups below use the German labels
beforeEach(() => setLanguage('de'));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** A minimal fake of the scene_controller facade, with sensible getter defaults. */
function makeFacade(overrides = {}) {
    return {
        isPaused: vi.fn(() => false),
        setPaused: vi.fn(),
        getTimeScale: vi.fn(() => 1),
        setTimeScale: vi.fn(),
        getBaseTimeScale: vi.fn(() => 1),
        getInteractionMode: vi.fn(() => false),
        setInteractionMode: vi.fn(),
        getInteractionSmokeVisible: vi.fn(() => true),
        setInteractionSmokeVisible: vi.fn(),

        getMetaballCount: vi.fn(() => 100),
        setMetaballCount: vi.fn(),
        getMaxMetaballCount: vi.fn(() => 500),
        getMetaballIsolation: vi.fn(() => 50),
        setMetaballIsolation: vi.fn(),
        getMetaballRadius: vi.fn(() => 1),
        setMetaballRadius: vi.fn(),
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

        getSoundEnabled: vi.fn(() => true),
        setSoundEnabled: vi.fn(),
        getSoundVolume: vi.fn(() => 0.5),
        setSoundVolume: vi.fn(),

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
        onChange: vi.fn(callback => { controller._on_change_callback = callback; return controller; }),
        listen: vi.fn().mockReturnThis(),
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
            registry.push({ folder: folder_name, bound_object, key, controller });
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

    test('starts with the GUI collapsed', () => {
        makeMockGui();
        setupGui(makeFacade());
        expect(GUI).toHaveBeenCalledWith({ closed: true });
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
            'Bloom', 'Himmel', 'Lichtstrahlen', 'Sound', 'Zurücksetzen',
        ]);
    });

    test('root paused control is seeded from facade.isPaused() and writes back via setPaused', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ isPaused: vi.fn(() => true) });
        setupGui(facade);
        const entry = find(registry, 'root', 'paused');
        expect(entry.bound_object.paused).toBe(true);
        fire(registry, 'root', 'paused', false);
        expect(facade.setPaused).toHaveBeenCalledWith(false);
    });

    test('root time_scale control is seeded from facade.getBaseTimeScale() and writes back via setTimeScale', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getBaseTimeScale: vi.fn(() => 2.5) });
        setupGui(facade);
        const entry = find(registry, 'root', 'time_scale');
        expect(entry.bound_object.time_scale).toBe(2.5);
        fire(registry, 'root', 'time_scale', 4);
        expect(facade.setTimeScale).toHaveBeenCalledWith(4);
    });

    test('root time_scale control is not affected by facade.getTimeScale() (the live, possibly-boosted value), so dragging it is never fought by an active boost', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getBaseTimeScale: vi.fn(() => 2.5), getTimeScale: vi.fn(() => 25) });
        setupGui(facade);
        const entry = find(registry, 'root', 'time_scale');
        expect(entry.bound_object.time_scale).toBe(2.5);
    });

    test('root interaction_mode control is seeded from facade.getInteractionMode() and writes back via setInteractionMode', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getInteractionMode: vi.fn(() => true) });
        setupGui(facade);
        const entry = find(registry, 'root', 'interaction_mode');
        expect(entry.bound_object.interaction_mode).toBe(true);
        fire(registry, 'root', 'interaction_mode', false);
        expect(facade.setInteractionMode).toHaveBeenCalledWith(false);
    });

    test('root autonomous_mode control mirrors the inverse of facade.getInteractionMode() and writes back the inverse via setInteractionMode', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade({ getInteractionMode: vi.fn(() => true) });
        setupGui(facade);
        const entry = find(registry, 'root', 'autonomous_mode');
        expect(entry.bound_object.autonomous_mode).toBe(false); // interaction mode is on -> not autonomous
        fire(registry, 'root', 'autonomous_mode', true); // switching autonomous mode on...
        expect(facade.setInteractionMode).toHaveBeenCalledWith(false); // ...turns interaction mode off
    });
});

// ─── Metaballs folder ────────────────────────────────────────────────────────

describe('setupGui – Metaballs folder', () => {
    test('height control is seeded from facade.getMetaballHeight()', () => {
        const { registry } = makeMockGui();
        setupGui(makeFacade({ getMetaballHeight: vi.fn(() => 0.7) }));
        expect(find(registry, 'Metaballs', 'height').bound_object.height).toBe(0.7);
    });

    test('height onChange calls facade.setMetaballHeight', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Metaballs', 'height', 2.5);
        expect(facade.setMetaballHeight).toHaveBeenCalledWith(2.5);
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
        ['proximity_radius', 'setGroundProximityRadius', 12.5],
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
        expect(entry.bound_object.count).toBe(150);
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

// ─── Bloom folder ────────────────────────────────────────────────────────────

describe('setupGui – Bloom folder', () => {
    test.each([
        ['enabled', 'setBloomEnabled', false],
        ['strength', 'setBloomStrength', 1.2],
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

// ─── Sound folder ────────────────────────────────────────────────────────────

describe('setupGui – Sound folder', () => {
    test.each([
        ['enabled', false, 'setSoundEnabled'],
        ['volume', 0.8, 'setSoundVolume'],
    ])('%s onChange calls facade.%s', (key, value, setter) => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);
        fire(registry, 'Sound', key, value);
        expect(facade[setter]).toHaveBeenCalledWith(value);
    });
});

// ─── Persistenz ──────────────────────────────────────────────────────────────

describe('setupGui – Zurücksetzen', () => {
    beforeEach(() => {
        saveToLocalStorage.mockClear();
        loadFromLocalStorage.mockClear().mockReturnValue(null);
    });

    test('reset resets the facade to defaults and refreshes every controller display', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade);

        const entry = find(registry, 'Zurücksetzen', 'reset');
        entry.bound_object.reset();

        expect(facade.resetToDefaults).toHaveBeenCalledOnce();
        registry
            .filter(entry => entry.folder !== 'Zurücksetzen')
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

// ─── Language ────────────────────────────────────────────────────────────────

describe('setupGui – language', () => {
    test('labels folders and controls in English when English is selected', () => {
        setLanguage('en');
        const { gui, registry } = makeMockGui();
        setupGui(makeFacade());

        expect(gui.addFolder.mock.calls.map(call => call[0])).toContain('Ground');
        expect(find(registry, 'Ground', 'height').controller.name).toHaveBeenLastCalledWith('Height');
        expect(find(registry, 'root', 'interaction_mode').controller.name).toHaveBeenLastCalledWith('Interaction mode');
    });

    test('relabels controls and folders live when the language changes', () => {
        setLanguage('en');
        const { gui, registry } = makeMockGui();
        setupGui(makeFacade());
        const ground_folder = gui.addFolder.mock.results[gui.addFolder.mock.calls.findIndex(call => call[0] === 'Ground')].value;

        setLanguage('de');

        expect(find(registry, 'Ground', 'height').controller.name).toHaveBeenLastCalledWith('Höhe');
        expect(find(registry, 'root', 'interaction_mode').controller.name).toHaveBeenLastCalledWith('Interaktionsmodus');
        expect(ground_folder.name).toBe('Boden');
    });

    test('translates the open/close button and re-renders it', () => {
        setLanguage('en');
        const { gui } = makeMockGui();
        setupGui(makeFacade());
        const closed_setter = vi.fn();
        Object.defineProperty(gui, 'closed', { get: () => true, set: closed_setter, configurable: true });

        setLanguage('de');

        expect(GUI.TEXT_OPEN).toBe('Steuerung öffnen');
        expect(GUI.TEXT_CLOSED).toBe('Steuerung schließen');
        expect(closed_setter).toHaveBeenCalledWith(true);
    });
});

// ─── mode_controls_only ──────────────────────────────────────────────────────

describe('setupGui – mode_controls_only', () => {
    beforeEach(() => {
        saveToLocalStorage.mockClear();
        loadFromLocalStorage.mockClear().mockReturnValue(null);
    });

    test('shows only the time scale and the mode toggles, without any folder', () => {
        const { gui, registry } = makeMockGui();
        setupGui(makeFacade(), { mode_controls_only: true });

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual(['root/time_scale', 'root/autonomous_mode', 'root/interaction_mode', 'root/reset']);
        expect(gui.addFolder).not.toHaveBeenCalled();
    });

    test('the reset button resets the facade to defaults and refreshes the visible controls', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade, { mode_controls_only: true });

        const entry = find(registry, 'root', 'reset');
        expect(entry.controller.name).toHaveBeenLastCalledWith('🔄 Auf Standard zurücksetzen');
        entry.bound_object.reset();

        expect(facade.resetToDefaults).toHaveBeenCalledOnce();
        registry
            .filter(other => other.key !== 'reset')
            .forEach(other => expect(other.controller.updateDisplay).toHaveBeenCalled());
    });

    test('the time scale slider ranges from 1 to 6 in whole steps and writes back via setTimeScale', () => {
        const { gui, registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade, { mode_controls_only: true });

        const time_scale_call = gui.add.mock.calls.find(call => call[1] === 'time_scale');
        expect(time_scale_call.slice(2)).toEqual([1, 6, 1]);
        fire(registry, 'root', 'time_scale', 4);
        expect(facade.setTimeScale).toHaveBeenCalledWith(4);
    });

    test('restores the saved time scale, clamped to the slider range', () => {
        makeMockGui();
        loadFromLocalStorage.mockReturnValue({ interactionMode: false, timeScale: 50 });
        const facade = makeFacade();
        setupGui(facade, { mode_controls_only: true });

        expect(facade.applySnapshot).toHaveBeenCalledWith({ interactionMode: false, timeScale: 6 });
    });

    test('the mode toggles still write back via setInteractionMode', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGui(facade, { mode_controls_only: true });

        fire(registry, 'root', 'interaction_mode', true);
        expect(facade.setInteractionMode).toHaveBeenLastCalledWith(true);
        fire(registry, 'root', 'autonomous_mode', true);
        expect(facade.setInteractionMode).toHaveBeenLastCalledWith(false);
    });

    test('restores only the saved interaction mode, not the hidden settings', () => {
        makeMockGui();
        loadFromLocalStorage.mockReturnValue({ interactionMode: true, metaballHeight: 0.7, skyColor: '#ffffff' });
        const facade = makeFacade();
        setupGui(facade, { mode_controls_only: true });

        expect(facade.applySnapshot).toHaveBeenCalledWith({ interactionMode: true });
    });

    test('still saves the snapshot on beforeunload', () => {
        makeMockGui();
        const snapshot = { interactionMode: true };
        const facade = makeFacade({ getSnapshot: vi.fn(() => snapshot) });
        const add_event_listener_spy = vi.spyOn(window, 'addEventListener');

        setupGui(facade, { mode_controls_only: true });
        const handler = add_event_listener_spy.mock.calls.find(call => call[0] === 'beforeunload')[1];
        handler();

        expect(saveToLocalStorage).toHaveBeenCalledWith(snapshot);
        add_event_listener_spy.mockRestore();
    });
});
