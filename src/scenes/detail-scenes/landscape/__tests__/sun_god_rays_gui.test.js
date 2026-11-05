import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupSunGodRaysGui } from '../sun_god_rays_gui.js';
import { setLanguage } from '../../../../ui/language.js';
import { makeMockGui, findControl } from '../../shared/test-utils/mock_scene_gui.js';
import {
    LANDSCAPE_SPEED_RANGE, GOD_RAYS_WEIGHT_RANGE, GOD_RAYS_DECAY_RANGE, GOD_RAYS_DENSITY_RANGE,
} from '../config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';

const SUN_METHODS = ['MetaballsVisible', 'GodRaysWeight', 'GodRaysDecay', 'GodRaysDensity', 'GodRaysTintColor'];

function makeFacade() {
    const facade = {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 6, setSpeed: vi.fn(),
        resetToDefaults: vi.fn(),
    };
    for (const method of SUN_METHODS) {
        facade[`get${method}`] = () => 0;
        facade[`set${method}`] = vi.fn();
    }
    return facade;
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupSunGodRaysGui', () => {
    test('offers to hide the metaballs and the god rays’ settings, but neither the sun nor the volcano nor the ground', () => {
        const { registry, folders } = makeMockGui();
        setupSunGodRaysGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed',
            'Metaballs/metaballs_visible',
            'God rays/god_rays_weight', 'God rays/god_rays_decay', 'God rays/god_rays_density', 'God rays/god_rays_tint_color',
            'root/reset',
        ]);
        folders.forEach(folder => expect(folder.open).toHaveBeenCalled());
        expect(findControl(registry, 'speed').range).toEqual([LANDSCAPE_SPEED_RANGE.min, LANDSCAPE_SPEED_RANGE.max, LANDSCAPE_SPEED_RANGE.step]);
    });

    test('the sliders span ranges containing the landscape’s values, and every control writes through to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupSunGodRaysGui(facade);

        const sliders = [
            ['god_rays_weight', GOD_RAYS_WEIGHT_RANGE, MAIN_SCENE_DEFAULTS.godRaysWeight],
            ['god_rays_decay', GOD_RAYS_DECAY_RANGE, MAIN_SCENE_DEFAULTS.godRaysDecay],
            ['god_rays_density', GOD_RAYS_DENSITY_RANGE, MAIN_SCENE_DEFAULTS.godRaysDensity],
        ];
        for (const [key, range, landscape_value] of sliders) {
            expect(findControl(registry, key).range).toEqual([range.min, range.max, range.step]);
            expect(landscape_value).toBeGreaterThanOrEqual(range.min);
            expect(landscape_value).toBeLessThanOrEqual(range.max);
        }

        findControl(registry, 'metaballs_visible').bound_object.metaballs_visible = false;
        expect(facade.setMetaballsVisible).toHaveBeenCalledWith(false);
        findControl(registry, 'god_rays_tint_color').bound_object.god_rays_tint_color = '#123456';
        expect(facade.setGodRaysTintColor).toHaveBeenCalledWith('#123456');
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupSunGodRaysGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'god_rays_decay').controller.name).toHaveBeenLastCalledWith('Abklingrate');
        expect(findControl(registry, 'metaballs_visible').controller.name).toHaveBeenLastCalledWith('Sichtbar');
        expect(folders.map(folder => folder.name)).toEqual(['Metaballs', 'Lichtstrahlen']);
    });
});
