import { createGroundPlate } from './ground_plate.js';
import { createVolcanoLathe } from './volcano_lathe.js';
import { createLavaLights } from './lava_lights.js';
import { VOLCANO_GROUND_PLATE_SIZE, VOLCANO_GLOW_LIGHT_POSITION } from './config.js';

export function createVolcanoLandscape(scene, { volcano_profile, with_ground_plate = true } = {}) {
    const ground_plate = with_ground_plate ? createGroundPlate(scene, VOLCANO_GROUND_PLATE_SIZE) : null;
    ground_plate?.setHeight(0);
    const volcano_lathe = createVolcanoLathe(scene, volcano_profile);
    createLavaLights(scene, VOLCANO_GLOW_LIGHT_POSITION);
    return { ground_plate, volcano_lathe };
}
