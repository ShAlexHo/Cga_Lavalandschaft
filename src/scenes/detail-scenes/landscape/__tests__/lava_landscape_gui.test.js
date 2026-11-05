import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupLavaLandscapeGui } from '../lava_landscape_gui.js';
import { setLanguage } from '../../../../ui/language.js';
import { makeMockGui, findControl } from '../../shared/test-utils/mock_scene_gui.js';
import {
    LANDSCAPE_SPEED_RANGE, GROUND_ROUGHNESS_RANGE, GROUND_STRUCTURE_FREQUENCY_RANGE, GROUND_PROXIMITY_RADIUS_RANGE, CRACK_SOFTNESS_RANGE,
} from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

const GROUND_METHODS = [
    'Color', 'Color2', 'DisplacementScale', 'DisplacementFrequency', 'ProximityRadius',
    'CrackColor', 'CrackColor2', 'CrackSoftness',
];

function makeFacade() {
    const facade = {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 6, setSpeed: vi.fn(),
        getFog: () => true, setFog: vi.fn(),
        resetToDefaults: vi.fn(),
    };
    for (const method of GROUND_METHODS) {
        facade[`getGround${method}`] = () => 0;
        facade[`setGround${method}`] = vi.fn();
    }
    return facade;
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupLavaLandscapeGui', () => {
    test('offers the fog, two rock and two crack colours, but no volcano and no choice of ground', () => {
        const { registry, folders } = makeMockGui();
        setupLavaLandscapeGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed', 'root/fog',
            'Ground/ground_color', 'Ground/ground_color_2',
            'Ground/ground_displacement_scale', 'Ground/ground_displacement_frequency', 'Ground/ground_proximity_radius',
            'Cracks/ground_crack_color', 'Cracks/ground_crack_color_2',
            'Cracks/ground_crack_softness',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
        expect(findControl(registry, 'speed').range).toEqual([LANDSCAPE_SPEED_RANGE.min, LANDSCAPE_SPEED_RANGE.max, LANDSCAPE_SPEED_RANGE.step]);
    });

    test('the ground sliders span ranges containing the landscape’s values, and every control writes through to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupLavaLandscapeGui(facade);

        const sliders = [
            ['ground_displacement_scale', GROUND_ROUGHNESS_RANGE, MAIN_SCENE_DEFAULTS.groundDisplacementScale],
            ['ground_displacement_frequency', GROUND_STRUCTURE_FREQUENCY_RANGE, MAIN_SCENE_DEFAULTS.groundDisplacementFrequency],
            ['ground_proximity_radius', GROUND_PROXIMITY_RADIUS_RANGE, MAIN_SCENE_DEFAULTS.groundProximityRadius],
            ['ground_crack_softness', CRACK_SOFTNESS_RANGE, MAIN_SCENE_DEFAULTS.groundCrackSoftness],
        ];
        for (const [key, range, landscape_value] of sliders) {
            expect(findControl(registry, key).range).toEqual([range.min, range.max, range.step]);
            expect(landscape_value).toBeGreaterThanOrEqual(range.min);
            expect(landscape_value).toBeLessThanOrEqual(range.max);
        }

        findControl(registry, 'ground_crack_color_2').bound_object.ground_crack_color_2 = '#123456';
        expect(facade.setGroundCrackColor2).toHaveBeenCalledWith('#123456');
        findControl(registry, 'fog').bound_object.fog = false;
        expect(facade.setFog).toHaveBeenCalledWith(false);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupLavaLandscapeGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'fog').controller.name).toHaveBeenLastCalledWith('Nebel');
        expect(findControl(registry, 'ground_color_2').controller.name).toHaveBeenLastCalledWith('Gesteinsfarbe 2');
        expect(findControl(registry, 'ground_crack_color_2').controller.name).toHaveBeenLastCalledWith('Rissfarbe 2');
        expect(findControl(registry, 'ground_crack_softness').controller.name).toHaveBeenLastCalledWith('Kantenweichheit');
        expect(folders.map(folder => folder.name)).toEqual(['Boden', 'Risse']);
    });
});
