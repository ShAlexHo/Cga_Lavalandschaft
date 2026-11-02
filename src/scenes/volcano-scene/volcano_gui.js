import { createSceneGui } from '../scene_gui.js';
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
    bind(metaballs_folder.add(parameters, 'spawn_height', SPAWN_HEIGHT_RANGE.min, SPAWN_HEIGHT_RANGE.max, SPAWN_HEIGHT_RANGE.step), 'gui.metaballs.spawn_height');
    bind(metaballs_folder.add(parameters, 'flow_slope', FLOW_SLOPE_RANGE.min, FLOW_SLOPE_RANGE.max, FLOW_SLOPE_RANGE.step), 'gui.metaballs.flow_slope');
    metaballs_folder.open();

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    bind(ground_folder.add(parameters, 'ground_visible'), 'gui.visible');
    ground_folder.open();

    return scene_gui.finish();
}
