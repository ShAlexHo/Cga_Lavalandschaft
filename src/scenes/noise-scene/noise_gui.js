import { createSceneGui } from '../scene_gui.js';

export function setupNoiseGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { gui, bind } = scene_gui;

    const parameters = scene_gui.liveParameters({
        paused: [facade.isPaused, facade.setPaused],
        speed: [facade.getSpeed, facade.setSpeed],
        noise_enabled: [facade.getNoiseEnabled, facade.setNoiseEnabled],
        noise_color_1: [facade.getNoiseColor1, facade.setNoiseColor1],
        noise_color_2: [facade.getNoiseColor2, facade.setNoiseColor2],
    });

    bind(gui.add(parameters, 'paused'), 'gui.paused');
    bind(gui.add(parameters, 'speed', 0, 3, 0.05), 'gui.metaballs.speed');

    const noise_folder = scene_gui.addFolder('gui.folder.noise');
    bind(noise_folder.add(parameters, 'noise_enabled'), 'gui.enabled');
    bind(noise_folder.addColor(parameters, 'noise_color_1'), 'gui.noise.colour_1');
    bind(noise_folder.addColor(parameters, 'noise_color_2'), 'gui.noise.colour_2');
    noise_folder.open();

    return scene_gui.finish();
}
