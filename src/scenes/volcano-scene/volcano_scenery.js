import { computeFlowBalls } from '../metaballs-scene/metaballs_animation.js';
import { createGroundPlate } from '../metaballs-scene/ground_plate.js';
import { createVolcanoLathe } from '../metaballs-scene/volcano_lathe.js';
import { createLavaLights } from '../metaballs-scene/lava_lights.js';
import { GROUND_DEFAULTS, VOLCANO_DEFAULTS, VOLCANO_GROUND_PLATE_SIZE, VOLCANO_GLOW_LIGHT_POSITION } from '../metaballs-scene/config.js';

export function createVolcanoScenery(scene, settings) {
    const ground_plate = createGroundPlate(scene, VOLCANO_GROUND_PLATE_SIZE);
    ground_plate.setHeight(0);
    createVolcanoLathe(scene);
    createLavaLights(scene, VOLCANO_GLOW_LIGHT_POSITION);

    const methods = {
        getGroundVisible: ground_plate.getVisible,
        setGroundVisible: ground_plate.setVisible,
        getSpawnHeight: () => settings.spawn_height,
        setSpawnHeight: value => { settings.spawn_height = value; },
        getFlowSlope: () => settings.flow_slope,
        setFlowSlope: value => { settings.flow_slope = value; },
    };

    return {
        computeBalls: elapsed_time => computeFlowBalls(elapsed_time, settings),
        resetToDefaults() {
            Object.assign(settings, VOLCANO_DEFAULTS);
            ground_plate.setVisible(GROUND_DEFAULTS.ground_visible);
        },
        methods,
        setting_accessors: {
            ground_visible: [methods.getGroundVisible, methods.setGroundVisible],
            spawn_height: [methods.getSpawnHeight, methods.setSpawnHeight],
            flow_slope: [methods.getFlowSlope, methods.setFlowSlope],
        },
    };
}
