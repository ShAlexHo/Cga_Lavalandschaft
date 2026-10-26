import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupNoiseGui } from '../noise_gui.js';
import { setLanguage } from '../../../ui/language.js';
import { makeMockGui, findControl } from '../../test-utils/mock_scene_gui.js';

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

        expect(findControl(registry, 'noise_color_1').controller.name).toHaveBeenLastCalledWith('primäre Farbe');
        expect(folders[0].name).toBe('Noise');
    });
});
