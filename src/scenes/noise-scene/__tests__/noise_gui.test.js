import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { GUI } from 'dat.gui';
import { setupNoiseGui } from '../noise_gui.js';
import { setLanguage } from '../../../ui/language.js';

function makeController() {
    return { name: vi.fn().mockReturnThis(), updateDisplay: vi.fn() };
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
        destroy: vi.fn(),
    };
    GUI.mockImplementation(() => gui);
    return { gui, registry, folders };
}

function find(registry, key) {
    return registry.find(entry => entry.key === key);
}

function makeFacade() {
    const state = { noise_color_1: '#7c3027' };
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 1, setSpeed: vi.fn(),
        getNoiseEnabled: () => true, setNoiseEnabled: vi.fn(),
        getNoiseColor1: () => state.noise_color_1, setNoiseColor1: vi.fn(value => { state.noise_color_1 = value; }),
        getNoiseColor2: () => '#ea6927', setNoiseColor2: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupNoiseGui', () => {
    test('offers the colour noise parameters only, colours included, in an opened Noise folder', () => {
        const { registry, folders } = makeMockGui();
        setupNoiseGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Noise/noise_enabled', 'Noise/noise_color_1', 'Noise/noise_color_2',
            'root/reset',
        ]);
        expect(folders).toHaveLength(1);
        expect(folders[0].open).toHaveBeenCalled();
    });

    test('the noise colours are colour pickers bound to the facade', () => {
        const { gui, folders } = makeMockGui();
        const facade = makeFacade();
        setupNoiseGui(facade);

        const colour_keys = folders[0].addColor.mock.calls.map(call => call[1]);
        expect(colour_keys).toEqual(['noise_color_1', 'noise_color_2']);
        expect(gui.addColor).not.toHaveBeenCalled();

        const parameters = folders[0].addColor.mock.calls[0][0];
        expect(parameters.noise_color_1).toBe('#7c3027');
        parameters.noise_color_1 = '#ffffff';
        expect(facade.setNoiseColor1).toHaveBeenCalledWith('#ffffff');
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupNoiseGui(makeFacade());
        setLanguage('de');

        expect(find(registry, 'noise_color_1').controller.name).toHaveBeenLastCalledWith('primäre Farbe');
        expect(folders[0].name).toBe('Noise');
    });
});
