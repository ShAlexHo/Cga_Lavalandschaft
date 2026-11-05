import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupVolcanoIrregularitiesGui } from '../volcano_irregularities_gui.js';
import { setLanguage } from '../../../../ui/language.js';
import { makeMockGui, findControl } from '../../shared/test-utils/mock_scene_gui.js';
import { LANDSCAPE_SPEED_RANGE } from '../config.js';

function makeFacade() {
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 1, setSpeed: vi.fn(),
        getSurfaceIrregularities: () => true, setSurfaceIrregularities: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupVolcanoIrregularitiesGui', () => {
    test('offers the playback controls and the choice of volcano, but no ground switch', () => {
        const { registry, folders } = makeMockGui();
        setupVolcanoIrregularitiesGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Volcano/surface_irregularities',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
    });

    test('the speed can be turned up to eight', () => {
        const { registry } = makeMockGui();
        setupVolcanoIrregularitiesGui(makeFacade());
        expect(findControl(registry, 'speed').range).toEqual([LANDSCAPE_SPEED_RANGE.min, 8, LANDSCAPE_SPEED_RANGE.step]);
    });

    test('switching the surface irregularities off chooses the simplified volcano', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupVolcanoIrregularitiesGui(facade);

        findControl(registry, 'surface_irregularities').bound_object.surface_irregularities = false;
        expect(facade.setSurfaceIrregularities).toHaveBeenCalledWith(false);
        expect(findControl(registry, 'surface_irregularities').controller.domElement.closest('li').classList.contains('wide-label')).toBe(true);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupVolcanoIrregularitiesGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'surface_irregularities').controller.name).toHaveBeenLastCalledWith('Oberflächenunebenheiten');
        expect(folders.map(folder => folder.name)).toEqual(['Vulkan']);
    });
});
