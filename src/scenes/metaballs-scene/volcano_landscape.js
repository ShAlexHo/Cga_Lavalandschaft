import { createGroundPlate } from './ground_plate.js';
import { createVolcanoLathe } from './volcano_lathe.js';
import { createLavaLights } from './lava_lights.js';
import { VOLCANO_GROUND_PLATE_SIZE, VOLCANO_GLOW_LIGHT_POSITION } from './config.js';

export function createVolcanoLandscape(scene) {
    const ground_plate = createGroundPlate(scene, VOLCANO_GROUND_PLATE_SIZE);
    ground_plate.setHeight(0);
    createVolcanoLathe(scene);
    createLavaLights(scene, VOLCANO_GLOW_LIGHT_POSITION);
    return { ground_plate };
}
