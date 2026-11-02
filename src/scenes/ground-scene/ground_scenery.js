import { computeBalls } from '../metaballs-scene/metaballs_animation.js';
import { createGroundPlate } from '../metaballs-scene/ground_plate.js';
import { createLavaLights } from '../metaballs-scene/lava_lights.js';
import { GROUND_DEFAULTS } from '../metaballs-scene/config.js';
import { GROUND_PATH_SPEED_SCALE, GROUND_PLATE_SIZE, GROUND_GLOW_LIGHT_POSITION } from './config.js';

export function createGroundScenery(scene, settings) {
    const ground_plate = createGroundPlate(scene, GROUND_PLATE_SIZE);
    createLavaLights(scene, GROUND_GLOW_LIGHT_POSITION);

    const methods = {
        getGroundVisible: ground_plate.getVisible,
        setGroundVisible: ground_plate.setVisible,
        getGroundHeight: ground_plate.getHeight,
        setGroundHeight: ground_plate.setHeight,
    };

    return {
        computeBalls: elapsed_time => computeBalls(elapsed_time * GROUND_PATH_SPEED_SCALE, settings, { planar: true }),
        resetToDefaults() {
            settings.count = GROUND_DEFAULTS.count;
            ground_plate.setVisible(GROUND_DEFAULTS.ground_visible);
            ground_plate.setHeight(GROUND_DEFAULTS.ground_height);
        },
        methods,
        setting_accessors: {
            ground_visible: [methods.getGroundVisible, methods.setGroundVisible],
            ground_height: [methods.getGroundHeight, methods.setGroundHeight],
        },
    };
}
