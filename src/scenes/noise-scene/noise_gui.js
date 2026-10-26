import { createSceneGui } from '../scene_gui.js';

export function setupNoiseGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        noise_enabled: [facade.getNoiseEnabled, facade.setNoiseEnabled],
        noise_color_1: [facade.getNoiseColor1, facade.setNoiseColor1],
        noise_color_2: [facade.getNoiseColor2, facade.setNoiseColor2],
    });

    const noise_folder = scene_gui.addFolder('gui.folder.noise');
    bind(noise_folder.add(parameters, 'noise_enabled'), 'gui.enabled');
    bind(noise_folder.addColor(parameters, 'noise_color_1'), 'gui.noise.colour_1');
    bind(noise_folder.addColor(parameters, 'noise_color_2'), 'gui.noise.colour_2');
    noise_folder.open();

    return scene_gui.finish();
}
