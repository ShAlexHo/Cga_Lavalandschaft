import { createSceneGui } from '../shared/scene_gui.js';
import { GROUND_HEIGHT_RANGE, GROUND_BALL_COUNT_RANGE } from './config.js';

export function setupGroundGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { gui, bind } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        bloom_enabled: [facade.getBloomEnabled, facade.setBloomEnabled],
        count: [facade.getCount, facade.setCount],
        ground_visible: [facade.getGroundVisible, facade.setGroundVisible],
        ground_height: [facade.getGroundHeight, facade.setGroundHeight],
    });

    bind(gui.add(parameters, 'bloom_enabled'), 'gui.bloom');

    const metaballs_folder = scene_gui.addFolder('gui.folder.metaballs');
    scene_gui.addSlider(metaballs_folder, parameters, 'count', GROUND_BALL_COUNT_RANGE, 'gui.metaballs.count');

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    bind(ground_folder.add(parameters, 'ground_visible'), 'gui.visible');
    scene_gui.addSlider(ground_folder, parameters, 'ground_height', GROUND_HEIGHT_RANGE, 'gui.height');

    return scene_gui.finish();
}
