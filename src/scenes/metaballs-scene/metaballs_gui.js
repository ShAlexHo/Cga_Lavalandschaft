import { createSceneGui } from '../scene_gui.js';
import { BALL_COUNT_RANGE } from './config.js';

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
    bind(field_folder.add(parameters, 'count', BALL_COUNT_RANGE.min, BALL_COUNT_RANGE.max, BALL_COUNT_RANGE.step), 'gui.metaballs.count');
    bind(field_folder.add(parameters, 'isolation', 10, 150, 1), 'gui.metaballs.isolation');
    bind(field_folder.add(parameters, 'spread', 0, 2, 0.05), 'gui.metaballs.spread');
    field_folder.open();

    const colors_folder = scene_gui.addFolder('gui.folder.lava_colour');
    bind(colors_folder.addColor(parameters, 'color_hot'), 'gui.lava.colour_hot');
    bind(colors_folder.addColor(parameters, 'color_cool'), 'gui.lava.colour_cool');
    bind(colors_folder.add(parameters, 'glow_enabled'), 'gui.lava.glow');
    bind(colors_folder.addColor(parameters, 'glow_color'), 'gui.lava.glow_colour');

    return scene_gui.finish();
}
