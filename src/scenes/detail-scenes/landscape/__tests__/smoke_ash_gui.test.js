import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupSmokeAshGui } from '../smoke_ash_gui.js';
import { setLanguage } from '../../../../ui/language.js';
import { makeMockGui, findControl } from '../../shared/test-utils/mock_scene_gui.js';
import { SMOKE_COUNT_RANGE, SMOKE_RISE_SPEED_RANGE, SMOKE_EMBER_COOLING_TIME_RANGE } from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

function makeFacade() {
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 6, setSpeed: vi.fn(),
        getSmokeCount: () => 1600, setSmokeCount: vi.fn(),
        getSmokeRiseSpeed: () => 0.025, setSmokeRiseSpeed: vi.fn(),
        getSmokeEmberCoolingTime: () => 280, setSmokeEmberCoolingTime: vi.fn(),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupSmokeAshGui', () => {
    test('offers the playback controls and the smoke’s count, rise speed and ember cooling time, but no volcano choice', () => {
        const { registry, folders } = makeMockGui();
        setupSmokeAshGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Smoke & ash/smoke_count', 'Smoke & ash/smoke_rise_speed', 'Smoke & ash/smoke_ember_cooling_time',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
    });

    test('the smoke sliders span ranges that contain the landscape’s values, and write through to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupSmokeAshGui(facade);

        const ranges = [
            ['smoke_count', SMOKE_COUNT_RANGE, MAIN_SCENE_DEFAULTS.smokeCount, 'setSmokeCount'],
            ['smoke_rise_speed', SMOKE_RISE_SPEED_RANGE, MAIN_SCENE_DEFAULTS.smokeRiseSpeed, 'setSmokeRiseSpeed'],
            ['smoke_ember_cooling_time', SMOKE_EMBER_COOLING_TIME_RANGE, MAIN_SCENE_DEFAULTS.smokeEmberCoolingTime, 'setSmokeEmberCoolingTime'],
        ];
        for (const [key, range, landscape_value, setter] of ranges) {
            const control = findControl(registry, key);
            expect(control.range).toEqual([range.min, range.max, range.step]);
            expect(landscape_value).toBeGreaterThanOrEqual(range.min);
            expect(landscape_value).toBeLessThanOrEqual(range.max);
            control.bound_object[key] = range.min;
            expect(facade[setter]).toHaveBeenCalledWith(range.min);
        }
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupSmokeAshGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'smoke_ember_cooling_time').controller.name).toHaveBeenLastCalledWith('Abkühlzeit (Glut)');
        expect(folders.map(folder => folder.name)).toEqual(['Rauch & Asche']);
    });
});
