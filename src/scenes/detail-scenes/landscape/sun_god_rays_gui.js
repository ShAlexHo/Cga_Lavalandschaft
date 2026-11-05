import { createSceneGui } from '../shared/scene_gui.js';
import {
    LANDSCAPE_SPEED_RANGE, GOD_RAYS_WEIGHT_RANGE, GOD_RAYS_DECAY_RANGE, GOD_RAYS_DENSITY_RANGE,
} from './config.js';

const GOD_RAYS_SLIDERS = [
    ['god_rays_weight', GOD_RAYS_WEIGHT_RANGE, 'gui.strength'],
    ['god_rays_decay', GOD_RAYS_DECAY_RANGE, 'gui.god_rays.decay'],
    ['god_rays_density', GOD_RAYS_DENSITY_RANGE, 'gui.god_rays.density'],
];

export function setupSunGodRaysGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        metaballs_visible: [facade.getMetaballsVisible, facade.setMetaballsVisible],
        god_rays_weight: [facade.getGodRaysWeight, facade.setGodRaysWeight],
        god_rays_decay: [facade.getGodRaysDecay, facade.setGodRaysDecay],
        god_rays_density: [facade.getGodRaysDensity, facade.setGodRaysDensity],
        god_rays_tint_color: [facade.getGodRaysTintColor, facade.setGodRaysTintColor],
    });

    const metaballs_folder = scene_gui.addFolder('gui.folder.metaballs');
    bind(metaballs_folder.add(parameters, 'metaballs_visible'), 'gui.visible');

    const god_rays_folder = scene_gui.addFolder('gui.folder.god_rays');
    for (const [key, range, message_key] of GOD_RAYS_SLIDERS) scene_gui.addSlider(god_rays_folder, parameters, key, range, message_key);
    bind(god_rays_folder.addColor(parameters, 'god_rays_tint_color'), 'gui.colour');

    return scene_gui.finish();
}
