import { createSceneGui } from '../shared/scene_gui.js';
import { BALL_COUNT_RANGE, ISOLATION_RANGE, SPREAD_RANGE } from './config.js';

export function setupMetaballsGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        count: [facade.getCount, facade.setCount],
        isolation: [facade.getIsolation, facade.setIsolation],
        spread: [facade.getSpread, facade.setSpread],
        color_hot: [facade.getColorHot, facade.setColorHot],
        color_cool: [facade.getColorCool, facade.setColorCool],
        glow_enabled: [facade.getGlowEnabled, facade.setGlowEnabled],
        glow_color: [facade.getGlowColor, facade.setGlowColor],
    });

    const field_folder = scene_gui.addFolder('gui.folder.metaballs');
    scene_gui.addSlider(field_folder, parameters, 'count', BALL_COUNT_RANGE, 'gui.metaballs.count');
    scene_gui.addSlider(field_folder, parameters, 'isolation', ISOLATION_RANGE, 'gui.metaballs.isolation');
    scene_gui.addSlider(field_folder, parameters, 'spread', SPREAD_RANGE, 'gui.metaballs.spread');

    const colors_folder = scene_gui.addFolder('gui.folder.lava_colour', { open: false });
    bind(colors_folder.addColor(parameters, 'color_hot'), 'gui.lava.colour_hot');
    bind(colors_folder.addColor(parameters, 'color_cool'), 'gui.lava.colour_cool');
    bind(colors_folder.add(parameters, 'glow_enabled'), 'gui.lava.glow');
    bind(colors_folder.addColor(parameters, 'glow_color'), 'gui.lava.glow_colour');

    return scene_gui.finish();
}
