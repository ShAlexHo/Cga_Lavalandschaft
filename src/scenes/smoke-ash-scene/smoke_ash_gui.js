import { createSceneGui } from '../scene_gui.js';
import { LANDSCAPE_VOLCANO_SPEED_RANGE } from '../volcano-irregularities-scene/config.js';
import { SMOKE_COUNT_RANGE, SMOKE_RISE_SPEED_RANGE, SMOKE_EMBER_COOLING_TIME_RANGE } from './config.js';

export function setupSmokeAshGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_VOLCANO_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        smoke_count: [facade.getSmokeCount, facade.setSmokeCount],
        smoke_rise_speed: [facade.getSmokeRiseSpeed, facade.setSmokeRiseSpeed],
        smoke_ember_cooling_time: [facade.getSmokeEmberCoolingTime, facade.setSmokeEmberCoolingTime],
    });

    const smoke_folder = scene_gui.addFolder('gui.folder.smoke');
    bind(smoke_folder.add(parameters, 'smoke_count', SMOKE_COUNT_RANGE.min, SMOKE_COUNT_RANGE.max, SMOKE_COUNT_RANGE.step), 'gui.smoke.count');
    const rise = SMOKE_RISE_SPEED_RANGE;
    bind(smoke_folder.add(parameters, 'smoke_rise_speed', rise.min, rise.max, rise.step), 'gui.smoke.rise_speed');
    const cooling = SMOKE_EMBER_COOLING_TIME_RANGE;
    bind(smoke_folder.add(parameters, 'smoke_ember_cooling_time', cooling.min, cooling.max, cooling.step), 'gui.smoke.ember_cooling_time');
    smoke_folder.open();

    return scene_gui.finish();
}
