import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupRadialFlowGui } from '../radial_flow_gui.js';
import { setLanguage } from '../../../ui/language.js';
import { makeMockGui, findControl } from '../../test-utils/mock_scene_gui.js';
import { SECTOR_COUNT_MINIMUM } from '../../metaballs-scene/config.js';

function makeFacade() {
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 2, setSpeed: vi.fn(),
        getSlowDown: () => false, setSlowDown: vi.fn(),
        getSectorsEnabled: () => false, setSectorsEnabled: vi.fn(),
        getSectorCount: () => 6, setSectorCount: vi.fn(),
        getGroundVisible: () => true, setGroundVisible: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupRadialFlowGui', () => {
    test('keeps the flow speed and the distribution in separate folders, next to the playback controls and the ground’s visibility', () => {
        const { registry, folders } = makeMockGui();
        setupRadialFlowGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Flow speed/slow_down',
            'Distribution/sectors_enabled', 'Distribution/sector_count',
            'Ground/ground_visible',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
    });

    test('the slowing switch writes through to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupRadialFlowGui(facade);

        findControl(registry, 'slow_down').bound_object.slow_down = true;
        expect(facade.setSlowDown).toHaveBeenCalledWith(true);
    });

    test('only the decreasing-speed switch gets a wide label, so its long name is shown in full', () => {
        const { registry } = makeMockGui();
        setupRadialFlowGui(makeFacade());

        const wide_rows = registry.filter(entry => entry.controller.domElement.closest('li').classList.contains('wide-label'));
        expect(wide_rows.map(entry => entry.key)).toEqual(['slow_down']);
    });

    test('the sector count is an open number field of whole numbers, starting at one sector', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupRadialFlowGui(facade);

        const sector_count = findControl(registry, 'sector_count');
        expect(sector_count.range).toEqual([SECTOR_COUNT_MINIMUM, undefined, 1]);
        sector_count.bound_object.sector_count = 9;
        expect(facade.setSectorCount).toHaveBeenCalledWith(9);
        findControl(registry, 'sectors_enabled').bound_object.sectors_enabled = true;
        expect(facade.setSectorsEnabled).toHaveBeenCalledWith(true);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupRadialFlowGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'slow_down').controller.name).toHaveBeenLastCalledWith('Abnehmend, nicht mehr konstant');
        expect(findControl(registry, 'sectors_enabled').controller.name).toHaveBeenLastCalledWith('Trennung in Sektoren');
        expect(findControl(registry, 'sector_count').controller.name).toHaveBeenLastCalledWith('Anzahl Sektoren');
        expect(folders.map(folder => folder.name)).toEqual(['Fließgeschwindigkeit', 'Verteilung', 'Boden']);
    });
});
