import { createSceneGui } from '../shared/scene_gui.js';
import { SPAWN_HEIGHT_RANGE, FLOW_SLOPE_RANGE } from './config.js';

export function setupVolcanoGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        spawn_height: [facade.getSpawnHeight, facade.setSpawnHeight],
        flow_slope: [facade.getFlowSlope, facade.setFlowSlope],
        ground_visible: [facade.getGroundVisible, facade.setGroundVisible],
    });

    const metaballs_folder = scene_gui.addFolder('gui.folder.metaballs');
    scene_gui.addSlider(metaballs_folder, parameters, 'spawn_height', SPAWN_HEIGHT_RANGE, 'gui.metaballs.spawn_height');
    scene_gui.addSlider(metaballs_folder, parameters, 'flow_slope', FLOW_SLOPE_RANGE, 'gui.metaballs.flow_slope');

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    bind(ground_folder.add(parameters, 'ground_visible'), 'gui.visible');

    return scene_gui.finish();
}
