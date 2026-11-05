import { createSceneGui } from '../shared/scene_gui.js';
import { LANDSCAPE_SPEED_RANGE, SMOKE_COUNT_RANGE, SMOKE_RISE_SPEED_RANGE, SMOKE_EMBER_COOLING_TIME_RANGE } from './config.js';

export function setupSmokeAshGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        smoke_count: [facade.getSmokeCount, facade.setSmokeCount],
        smoke_rise_speed: [facade.getSmokeRiseSpeed, facade.setSmokeRiseSpeed],
        smoke_ember_cooling_time: [facade.getSmokeEmberCoolingTime, facade.setSmokeEmberCoolingTime],
    });

    const smoke_folder = scene_gui.addFolder('gui.folder.smoke');
    scene_gui.addSlider(smoke_folder, parameters, 'smoke_count', SMOKE_COUNT_RANGE, 'gui.smoke.count');
    scene_gui.addSlider(smoke_folder, parameters, 'smoke_rise_speed', SMOKE_RISE_SPEED_RANGE, 'gui.smoke.rise_speed');
    scene_gui.addSlider(smoke_folder, parameters, 'smoke_ember_cooling_time', SMOKE_EMBER_COOLING_TIME_RANGE, 'gui.smoke.ember_cooling_time');

    return scene_gui.finish();
}
