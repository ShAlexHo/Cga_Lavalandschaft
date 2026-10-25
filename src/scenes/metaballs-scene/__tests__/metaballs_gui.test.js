import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { GUI } from 'dat.gui';
import { setupMetaballsGui } from '../metaballs_gui.js';
import { setLanguage } from '../../../ui/language.js';

function makeController() {
    const controller = {
        name: vi.fn().mockReturnThis(),
        updateDisplay: vi.fn(),
    };
    return controller;
}

function makeMockGui() {
    const registry = [];
    const folders = [];

    function record(folder_name) {
        return vi.fn((bound_object, key, ...range) => {
            const controller = makeController();
            registry.push({ folder: folder_name, bound_object, key, range, controller });
            return controller;
        });
    }

    const gui = {
        domElement: document.createElement('div'),
        add: record('root'),
        addColor: record('root'),
        addFolder: vi.fn(name => {
            const folder = { name, add: record(name), addColor: record(name), open: vi.fn() };
            folders.push(folder);
            return folder;
        }),
    };
    GUI.mockImplementation(() => gui);
    return { gui, registry, folders };
}

function find(registry, key) {
    const entry = registry.find(candidate => candidate.key === key);
    if (!entry) throw new Error(`no controller registered for ${key}`);
    return entry;
}

function makeFacade() {
    const state = { paused: false, speed: 1, count: 7, isolation: 50, color_hot: '#a01500' };
    return {
        isPaused: () => state.paused, setPaused: vi.fn(value => { state.paused = value; }),
        getSpeed: () => state.speed, setSpeed: vi.fn(value => { state.speed = value; }),
        getCount: () => state.count, setCount: vi.fn(value => { state.count = value; }),
        getMaxCount: () => 24,
        getIsolation: () => state.isolation, setIsolation: vi.fn(value => { state.isolation = value; }),
        getRadius: () => 1.2, setRadius: vi.fn(),
        getSubtractScale: () => 1, setSubtractScale: vi.fn(),
        getSpread: () => 1, setSpread: vi.fn(),
        getRaymarchSteps: () => 48, setRaymarchSteps: vi.fn(),
        getColorHot: () => state.color_hot, setColorHot: vi.fn(value => { state.color_hot = value; }),
        getColorCool: () => '#7c3027', setColorCool: vi.fn(),
        getGlowEnabled: () => true, setGlowEnabled: vi.fn(),
        getGlowColor: () => '#ff3f00', setGlowColor: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupMetaballsGui', () => {
    test('is not auto-placed, but sits in its own fixed top-right container', () => {
        const { gui } = makeMockGui();
        const { container } = setupMetaballsGui(makeFacade());

        expect(GUI.mock.calls[0][0]).toMatchObject({ autoPlace: false });
        expect(container.className).toBe('dg ac');
        expect(container.contains(gui.domElement)).toBe(true);
    });

    test('aborting the signal removes the panel and stops following language changes', () => {
        const { gui, registry } = makeMockGui();
        gui.destroy = vi.fn();
        const lifetime = new AbortController();
        const { container } = setupMetaballsGui(makeFacade(), { signal: lifetime.signal });
        document.body.appendChild(container);
        const isolation = find(registry, 'isolation').controller;

        lifetime.abort();
        isolation.name.mockClear();
        setLanguage('de');

        expect(gui.destroy).toHaveBeenCalledTimes(1);
        expect(container.isConnected).toBe(false);
        expect(isolation.name).not.toHaveBeenCalled();
    });

    test('offers the explorable metaball parameters, with the field parameters in an opened folder', () => {
        const { registry, folders } = makeMockGui();
        setupMetaballsGui(makeFacade());

        expect(registry.map(entry => entry.key)).toEqual([
            'paused', 'speed',
            'count', 'isolation', 'spread',
            'color_hot', 'color_cool', 'glow_enabled', 'glow_color',
            'reset',
        ]);
        expect(folders.map(folder => folder.name)).toEqual(['Metaballs', 'Lava colour']);
        expect(folders[0].open).toHaveBeenCalled();
    });

    test('the count slider goes up to the facade’s maximum', () => {
        const { registry } = makeMockGui();
        setupMetaballsGui(makeFacade());
        expect(find(registry, 'count').range).toEqual([1, 24, 1]);
    });

    test('controls read and write the facade directly', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupMetaballsGui(facade);

        const isolation = find(registry, 'isolation').bound_object;
        expect(isolation.isolation).toBe(50);
        isolation.isolation = 90;
        expect(facade.setIsolation).toHaveBeenCalledWith(90);
        expect(isolation.isolation).toBe(90);

        find(registry, 'color_hot').bound_object.color_hot = '#ffffff';
        expect(facade.setColorHot).toHaveBeenCalledWith('#ffffff');
    });

    test('reset restores the facade’s defaults and refreshes every control', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupMetaballsGui(facade);

        find(registry, 'reset').bound_object.reset();

        expect(facade.resetToDefaults).toHaveBeenCalledOnce();
        registry.filter(entry => entry.key !== 'reset').forEach(entry => expect(entry.controller.updateDisplay).toHaveBeenCalled());
    });

    test('labels follow the current language, also after switching', () => {
        const { registry, folders } = makeMockGui();
        setupMetaballsGui(makeFacade());
        expect(find(registry, 'isolation').controller.name).toHaveBeenLastCalledWith('Threshold (isolation)');

        setLanguage('de');

        expect(find(registry, 'isolation').controller.name).toHaveBeenLastCalledWith('Schwellwert (Isolation)');
        expect(find(registry, 'reset').controller.name).toHaveBeenLastCalledWith('🔄 Auf Standard zurücksetzen');
        expect(folders[1].name).toBe('Lavafarbe');
    });
});
