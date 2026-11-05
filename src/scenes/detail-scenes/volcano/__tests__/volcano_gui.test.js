import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupVolcanoGui } from '../volcano_gui.js';
import { setLanguage } from '../../../../ui/language.js';
import { makeMockGui, findControl } from '../../shared/test-utils/mock_scene_gui.js';
import { SPAWN_HEIGHT_RANGE, FLOW_SLOPE_RANGE, VOLCANO_DEFAULTS } from '../config.js';

function makeFacade() {
    const state = { spawn_height: VOLCANO_DEFAULTS.spawn_height, flow_slope: VOLCANO_DEFAULTS.flow_slope };
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => VOLCANO_DEFAULTS.speed, setSpeed: vi.fn(),
        getSpawnHeight: () => state.spawn_height,
        setSpawnHeight: vi.fn(value => { state.spawn_height = value; }),
        getFlowSlope: () => state.flow_slope,
        setFlowSlope: vi.fn(value => { state.flow_slope = value; }),
        getGroundVisible: () => true, setGroundVisible: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupVolcanoGui', () => {
    test('offers the playback controls, the spawn height and flow slope, and the ground’s visibility, in opened folders', () => {
        const { registry, folders } = makeMockGui();
        setupVolcanoGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Metaballs/spawn_height', 'Metaballs/flow_slope',
            'Ground/ground_visible',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
    });

    test('the sliders span their configured ranges and write through to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupVolcanoGui(facade);

        const spawn_height = findControl(registry, 'spawn_height');
        expect(spawn_height.range).toEqual([SPAWN_HEIGHT_RANGE.min, SPAWN_HEIGHT_RANGE.max, SPAWN_HEIGHT_RANGE.step]);
        spawn_height.bound_object.spawn_height = 7;
        expect(facade.setSpawnHeight).toHaveBeenCalledWith(7);

        const flow_slope = findControl(registry, 'flow_slope');
        expect(flow_slope.range).toEqual([FLOW_SLOPE_RANGE.min, FLOW_SLOPE_RANGE.max, FLOW_SLOPE_RANGE.step]);
        flow_slope.bound_object.flow_slope = 1.2;
        expect(facade.setFlowSlope).toHaveBeenCalledWith(1.2);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupVolcanoGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'spawn_height').controller.name).toHaveBeenLastCalledWith('Entstehungshöhe');
        expect(findControl(registry, 'flow_slope').controller.name).toHaveBeenLastCalledWith('Gefälle');
        expect(findControl(registry, 'ground_visible').controller.name).toHaveBeenLastCalledWith('Sichtbar');
        expect(folders.map(folder => folder.name)).toEqual(['Metaballs', 'Boden']);
    });
});
