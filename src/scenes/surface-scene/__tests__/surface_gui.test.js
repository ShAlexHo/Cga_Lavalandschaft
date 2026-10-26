import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: vi.fn() }));

import { setupSurfaceGui } from '../surface_gui.js';
import { setLanguage } from '../../../ui/language.js';
import { makeMockGui, findControl } from '../../test-utils/mock_scene_gui.js';
import { DISPLACEMENT_STRENGTH_RANGE } from '../../metaballs-scene/config.js';

function makeFacade() {
    const state = { displacement_strength: 0.01 };
    return {
        isPaused: () => false, setPaused: vi.fn(),
        getSpeed: () => 1, setSpeed: vi.fn(),
        getNoiseEnabled: () => true, setNoiseEnabled: vi.fn(),
        getBumpEnabled: () => true, setBumpEnabled: vi.fn(),
        getDisplacementEnabled: () => true, setDisplacementEnabled: vi.fn(),
        getDisplacementStrength: () => state.displacement_strength,
        setDisplacementStrength: vi.fn(value => { state.displacement_strength = value; }),
        resetToDefaults: vi.fn(),
    };
}

beforeEach(() => {
    setLanguage('en');
    vi.clearAllMocks();
});

describe('setupSurfaceGui', () => {
    test('offers a noise switch and the surface relief parameters in an opened Surface folder', () => {
        const { registry, folders } = makeMockGui();
        setupSurfaceGui(makeFacade());

        expect(registry.map(entry => `${entry.folder}/${entry.key}`)).toEqual([
            'root/paused', 'root/speed', 'root/noise_enabled',
            'Surface/bump_enabled', 'Surface/displacement_enabled', 'Surface/displacement_strength',
            'root/reset',
        ]);
        expect(folders).toHaveLength(1);
        expect(folders[0].open).toHaveBeenCalled();
    });

    test('the displacement strength is a slider within the configured range, bound to the facade', () => {
        const { registry } = makeMockGui();
        const facade = makeFacade();
        setupSurfaceGui(facade);

        const strength = findControl(registry, 'displacement_strength');
        expect(strength.range).toEqual([DISPLACEMENT_STRENGTH_RANGE.min, DISPLACEMENT_STRENGTH_RANGE.max, DISPLACEMENT_STRENGTH_RANGE.step]);
        expect(strength.bound_object.displacement_strength).toBe(0.01);
        strength.bound_object.displacement_strength = 0.03;
        expect(facade.setDisplacementStrength).toHaveBeenCalledWith(0.03);
    });

    test('labels follow the language', () => {
        const { registry, folders } = makeMockGui();
        setupSurfaceGui(makeFacade());
        setLanguage('de');

        expect(findControl(registry, 'bump_enabled').controller.name).toHaveBeenLastCalledWith('Bump-Mapping');
        expect(findControl(registry, 'displacement_strength').controller.name).toHaveBeenLastCalledWith('Displacement-Stärke');
        expect(folders[0].name).toBe('Oberfläche');
    });
});
