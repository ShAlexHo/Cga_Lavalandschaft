import { createSceneGui } from '../scene_gui.js';
import { DISPLACEMENT_STRENGTH_RANGE } from '../metaballs-scene/config.js';

export function setupSurfaceGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { gui, bind } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        noise_enabled: [facade.getNoiseEnabled, facade.setNoiseEnabled],
        bump_enabled: [facade.getBumpEnabled, facade.setBumpEnabled],
        displacement_enabled: [facade.getDisplacementEnabled, facade.setDisplacementEnabled],
        displacement_strength: [facade.getDisplacementStrength, facade.setDisplacementStrength],
    });

    bind(gui.add(parameters, 'noise_enabled'), 'gui.surface.noise');

    const surface_folder = scene_gui.addFolder('gui.folder.surface');
    bind(surface_folder.add(parameters, 'bump_enabled'), 'gui.surface.bump_mapping');
    bind(surface_folder.add(parameters, 'displacement_enabled'), 'gui.surface.displacement_mapping');
    const { min, max, step } = DISPLACEMENT_STRENGTH_RANGE;
    bind(surface_folder.add(parameters, 'displacement_strength', min, max, step), 'gui.surface.displacement_strength');
    surface_folder.open();

    return scene_gui.finish();
}
