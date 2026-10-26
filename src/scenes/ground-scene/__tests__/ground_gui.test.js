import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupGroundGui } from '../ground_gui.js';
import { setLanguage } from '../../../ui/language.js';
import { makeMockGui, findControl } from '../../test-utils/mock_scene_gui.js';
import { GROUND_HEIGHT_RANGE, GROUND_BALL_COUNT_RANGE } from '../../metaballs-scene/config.js';


function makeFacade() {
    const state = { ground_height: -1 };
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 1, setSpeed: vi.fn(),
        getBloomEnabled: () => true, setBloomEnabled: vi.fn(),
        getCount: () => 20, setCount: vi.fn(),
        getGroundVisible: () => true, setGroundVisible: vi.fn(),
        getGroundHeight: () => state.ground_height,
        setGroundHeight: vi.fn(value => { state.ground_height = value; }),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupGroundGui', () => {
    test('offers a bloom switch, the ball count and the floor’s visibility and height, in opened folders', () => {
        const { registry, folders } = makeMockGui();
        setupGroundGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed', 'root/bloom_enabled',
            'Metaballs/count',
            'Ground/ground_visible', 'Ground/ground_height',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
    });

    test('the count and height sliders span their configured ranges', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupGroundGui(facade);

        expect(findControl(registry, 'count').range).toEqual([GROUND_BALL_COUNT_RANGE.min, GROUND_BALL_COUNT_RANGE.max, GROUND_BALL_COUNT_RANGE.step]);
        const height = findControl(registry, 'ground_height');
        expect(height.range).toEqual([GROUND_HEIGHT_RANGE.min, GROUND_HEIGHT_RANGE.max, GROUND_HEIGHT_RANGE.step]);
        height.bound_object.ground_height = 0.5;
        expect(facade.setGroundHeight).toHaveBeenCalledWith(0.5);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupGroundGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'ground_height').controller.name).toHaveBeenLastCalledWith('Höhe');
        expect(findControl(registry, 'count').controller.name).toHaveBeenLastCalledWith('Anzahl');
        expect(folders.map(folder => folder.name)).toEqual(['Metaballs', 'Boden']);
    });
});
