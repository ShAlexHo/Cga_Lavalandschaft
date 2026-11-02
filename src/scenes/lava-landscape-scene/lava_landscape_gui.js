import { createSceneGui } from '../scene_gui.js';
import { LANDSCAPE_VOLCANO_SPEED_RANGE } from '../volcano-irregularities-scene/config.js';
import { GROUND_ROUGHNESS_RANGE, GROUND_STRUCTURE_FREQUENCY_RANGE, GROUND_PROXIMITY_RADIUS_RANGE, CRACK_SOFTNESS_RANGE } from './config.js';

const ROCK_COLOURS = [
    ['ground_color', 'gui.ground.rock_colour_1'],
    ['ground_color_2', 'gui.ground.rock_colour_2'],
    ['ground_color_3', 'gui.ground.rock_colour_3'],
    ['ground_color_4', 'gui.ground.rock_colour_4'],
];
const CRACK_COLOURS = [
    ['ground_crack_color', 'gui.ground.crack_colour_1'],
    ['ground_crack_color_2', 'gui.ground.crack_colour_2'],
    ['ground_crack_color_3', 'gui.ground.crack_colour_3'],
    ['ground_crack_color_4', 'gui.ground.crack_colour_4'],
];

export function setupLavaLandscapeGui(facade, { signal } = {}) {
    const scene_gui = createSceneGui(facade, { signal });
    const { bind } = scene_gui;
    scene_gui.addPlaybackControls({ speed_range: LANDSCAPE_VOLCANO_SPEED_RANGE });

    const parameters = scene_gui.liveParameters({
        fog: [facade.getFog, facade.setFog],
        ground_color: [facade.getGroundColor, facade.setGroundColor],
        ground_color_2: [facade.getGroundColor2, facade.setGroundColor2],
        ground_color_3: [facade.getGroundColor3, facade.setGroundColor3],
        ground_color_4: [facade.getGroundColor4, facade.setGroundColor4],
        ground_displacement_scale: [facade.getGroundDisplacementScale, facade.setGroundDisplacementScale],
        ground_displacement_frequency: [facade.getGroundDisplacementFrequency, facade.setGroundDisplacementFrequency],
        ground_proximity_radius: [facade.getGroundProximityRadius, facade.setGroundProximityRadius],
        ground_crack_color: [facade.getGroundCrackColor, facade.setGroundCrackColor],
        ground_crack_color_2: [facade.getGroundCrackColor2, facade.setGroundCrackColor2],
        ground_crack_color_3: [facade.getGroundCrackColor3, facade.setGroundCrackColor3],
        ground_crack_color_4: [facade.getGroundCrackColor4, facade.setGroundCrackColor4],
        ground_crack_softness: [facade.getGroundCrackSoftness, facade.setGroundCrackSoftness],
    });

    bind(scene_gui.gui.add(parameters, 'fog'), 'gui.fog');

    const ground_folder = scene_gui.addFolder('gui.folder.ground');
    for (const [key, message_key] of ROCK_COLOURS) bind(ground_folder.addColor(parameters, key), message_key);
    const roughness = GROUND_ROUGHNESS_RANGE;
    bind(ground_folder.add(parameters, 'ground_displacement_scale', roughness.min, roughness.max, roughness.step), 'gui.ground.displacement_scale');
    const frequency = GROUND_STRUCTURE_FREQUENCY_RANGE;
    bind(ground_folder.add(parameters, 'ground_displacement_frequency', frequency.min, frequency.max, frequency.step), 'gui.ground.displacement_frequency');
    const proximity = GROUND_PROXIMITY_RADIUS_RANGE;
    bind(ground_folder.add(parameters, 'ground_proximity_radius', proximity.min, proximity.max, proximity.step), 'gui.ground.proximity_radius');
    ground_folder.open();

    const cracks_folder = scene_gui.addFolder('gui.folder.cracks');
    for (const [key, message_key] of CRACK_COLOURS) bind(cracks_folder.addColor(parameters, key), message_key);
    const softness = CRACK_SOFTNESS_RANGE;
    bind(cracks_folder.add(parameters, 'ground_crack_softness', softness.min, softness.max, softness.step), 'gui.ground.crack_softness');
    cracks_folder.open();

    return scene_gui.finish();
}
