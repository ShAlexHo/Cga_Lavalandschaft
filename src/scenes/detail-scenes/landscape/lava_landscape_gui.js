import { createSceneGui } from '../shared/scene_gui.js';
import {
    LANDSCAPE_SPEED_RANGE, GROUND_ROUGHNESS_RANGE, GROUND_STRUCTURE_FREQUENCY_RANGE, GROUND_PROXIMITY_RADIUS_RANGE, CRACK_SOFTNESS_RANGE,
} from './config.js';

const ROCK_COLOURS = [
    ['ground_color', 'gui.ground.rock_colour_1'],
    ['ground_color_2', 'gui.ground.rock_colour_2'],
];
const CRACK_COLOURS = [
    ['ground_crack_color', 'gui.ground.crack_colour_1'],
    ['ground_crack_color_2', 'gui.ground.crack_colour_2'],
];

export function setupLavaLandscapeGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        fog: [facade.getFog, facade.setFog],
        ground_color: [facade.getGroundColor, facade.setGroundColor],
        ground_color_2: [facade.getGroundColor2, facade.setGroundColor2],
        ground_displacement_scale: [facade.getGroundDisplacementScale, facade.setGroundDisplacementScale],
        ground_displacement_frequency: [facade.getGroundDisplacementFrequency, facade.setGroundDisplacementFrequency],
        ground_proximity_radius: [facade.getGroundProximityRadius, facade.setGroundProximityRadius],
        ground_crack_color: [facade.getGroundCrackColor, facade.setGroundCrackColor],
        ground_crack_color_2: [facade.getGroundCrackColor2, facade.setGroundCrackColor2],
        ground_crack_softness: [facade.getGroundCrackSoftness, facade.setGroundCrackSoftness],
    });

    bind(scene_gui.gui.add(parameters, 'fog'), 'gui.fog');

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    for (const [key, message_key] of ROCK_COLOURS) bind(ground_folder.addColor(parameters, key), message_key);
    scene_gui.addSlider(ground_folder, parameters, 'ground_displacement_scale', GROUND_ROUGHNESS_RANGE, 'gui.ground.displacement_scale');
    scene_gui.addSlider(ground_folder, parameters, 'ground_displacement_frequency', GROUND_STRUCTURE_FREQUENCY_RANGE, 'gui.ground.displacement_frequency');
    scene_gui.addSlider(ground_folder, parameters, 'ground_proximity_radius', GROUND_PROXIMITY_RADIUS_RANGE, 'gui.ground.proximity_radius');

    const cracks_folder = scene_gui.addFolder('gui.folder.cracks');
    for (const [key, message_key] of CRACK_COLOURS) bind(cracks_folder.addColor(parameters, key), message_key);
    scene_gui.addSlider(cracks_folder, parameters, 'ground_crack_softness', CRACK_SOFTNESS_RANGE, 'gui.ground.crack_softness');

    return scene_gui.finish();
}
