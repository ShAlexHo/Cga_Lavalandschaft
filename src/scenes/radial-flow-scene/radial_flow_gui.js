import { createSceneGui } from '../scene_gui.js';
import { SECTOR_COUNT_MINIMUM } from './config.js';

export function setupRadialFlowGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind, widenLabel } = scene_gui;
    scene_gui.addPlaybackControls();

    const parameters = scene_gui.liveParameters({
        slow_down: [facade.getSlowDown, facade.setSlowDown],
        sectors_enabled: [facade.getSectorsEnabled, facade.setSectorsEnabled],
        sector_count: [facade.getSectorCount, facade.setSectorCount],
        ground_visible: [facade.getGroundVisible, facade.setGroundVisible],
    });

    const speed_folder = scene_gui.addFolder('gui.folder.flow_speed');
    widenLabel(bind(speed_folder.add(parameters, 'slow_down'), 'gui.metaballs.slow_down'));
    speed_folder.open();

    const distribution_folder = scene_gui.addFolder('gui.folder.distribution');
    bind(distribution_folder.add(parameters, 'sectors_enabled'), 'gui.metaballs.sectors_enabled');
    bind(distribution_folder.add(parameters, 'sector_count', SECTOR_COUNT_MINIMUM, undefined, 1), 'gui.metaballs.sector_count');
    distribution_folder.open();

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    bind(ground_folder.add(parameters, 'ground_visible'), 'gui.visible');
    ground_folder.open();

    return scene_gui.finish();
}
