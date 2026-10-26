import { createSceneGui } from '../scene_gui.js';
import { GROUND_HEIGHT_RANGE, GROUND_BALL_COUNT_RANGE } from '../metaballs-scene/config.js';

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
    bind(metaballs_folder.add(parameters, 'count', GROUND_BALL_COUNT_RANGE.min, GROUND_BALL_COUNT_RANGE.max, GROUND_BALL_COUNT_RANGE.step), 'gui.metaballs.count');
    metaballs_folder.open();

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    bind(ground_folder.add(parameters, 'ground_visible'), 'gui.visible');
    const { min, max, step } = GROUND_HEIGHT_RANGE;
    bind(ground_folder.add(parameters, 'ground_height', min, max, step), 'gui.height');
    ground_folder.open();

    return scene_gui.finish();
}
