import { computeFlowBalls } from '../metaballs-scene/flow_animation.js';
import { createVolcanoLandscape } from '../metaballs-scene/volcano_landscape.js';
import { GROUND_DEFAULTS, VOLCANO_DEFAULTS } from '../metaballs-scene/config.js';

export function createVolcanoScenery(scene, settings) {
    const { ground_plate } = createVolcanoLandscape(scene);

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
