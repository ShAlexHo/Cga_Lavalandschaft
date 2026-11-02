import { createSceneGui } from '../scene_gui.js';
import { LANDSCAPE_VOLCANO_SPEED_RANGE } from './config.js';

export function setupLandscapeVolcanoGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind, widenLabel } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_VOLCANO_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        surface_irregularities: [facade.getSurfaceIrregularities, facade.setSurfaceIrregularities],
    });

    const volcano_folder = scene_gui.addFolder('gui.folder.volcano');
    widenLabel(bind(volcano_folder.add(parameters, 'surface_irregularities'), 'gui.volcano.surface_irregularities'));
    volcano_folder.open();

    return scene_gui.finish();
}
