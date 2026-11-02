import { createSceneGui } from '../scene_gui.js';
import { LANDSCAPE_VOLCANO_SPEED_RANGE } from '../volcano-irregularities-scene/config.js';
import {
    SUN_STRENGTH_RANGE, SUN_FOCUS_RANGE, GOD_RAYS_WEIGHT_RANGE, GOD_RAYS_EXPOSURE_RANGE, GOD_RAYS_DECAY_RANGE, GOD_RAYS_DENSITY_RANGE,
} from './config.js';

const SUN_SLIDERS = [
    ['sun_strength', SUN_STRENGTH_RANGE, 'gui.sun.strength'],
    ['sun_focus', SUN_FOCUS_RANGE, 'gui.sun.focus'],
];
const GOD_RAYS_SLIDERS = [
    ['god_rays_weight', GOD_RAYS_WEIGHT_RANGE, 'gui.strength'],
    ['god_rays_exposure', GOD_RAYS_EXPOSURE_RANGE, 'gui.god_rays.exposure'],
    ['god_rays_decay', GOD_RAYS_DECAY_RANGE, 'gui.god_rays.decay'],
    ['god_rays_density', GOD_RAYS_DENSITY_RANGE, 'gui.god_rays.density'],
];

export function setupSunGodRaysGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_VOLCANO_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        metaballs_visible: [facade.getMetaballsVisible, facade.setMetaballsVisible],
        sun_visible: [facade.getSunVisible, facade.setSunVisible],
        sun_strength: [facade.getSunStrength, facade.setSunStrength],
        sun_focus: [facade.getSunFocus, facade.setSunFocus],
        god_rays_weight: [facade.getGodRaysWeight, facade.setGodRaysWeight],
        god_rays_exposure: [facade.getGodRaysExposure, facade.setGodRaysExposure],
        god_rays_decay: [facade.getGodRaysDecay, facade.setGodRaysDecay],
        god_rays_density: [facade.getGodRaysDensity, facade.setGodRaysDensity],
        god_rays_tint_color: [facade.getGodRaysTintColor, facade.setGodRaysTintColor],
    });

    const metaballs_folder = scene_gui.addFolder('gui.folder.metaballs');
    bind(metaballs_folder.add(parameters, 'metaballs_visible'), 'gui.visible');
    metaballs_folder.open();

    const sun_folder = scene_gui.addFolder('gui.folder.sun');
    bind(sun_folder.add(parameters, 'sun_visible'), 'gui.visible');
    for (const [key, range, message_key] of SUN_SLIDERS) bind(sun_folder.add(parameters, key, range.min, range.max, range.step), message_key);
    sun_folder.open();

    const god_rays_folder = scene_gui.addFolder('gui.folder.god_rays');
    for (const [key, range, message_key] of GOD_RAYS_SLIDERS) bind(god_rays_folder.add(parameters, key, range.min, range.max, range.step), message_key);
    bind(god_rays_folder.addColor(parameters, 'god_rays_tint_color'), 'gui.colour');
    god_rays_folder.open();

    return scene_gui.finish();
}
