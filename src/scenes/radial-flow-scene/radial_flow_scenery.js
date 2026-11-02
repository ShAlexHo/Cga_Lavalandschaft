import { computeFlowBalls } from '../metaballs-scene/metaballs_animation.js';
import { createVolcanoLandscape } from '../metaballs-scene/volcano_landscape.js';
import { GROUND_DEFAULTS, RADIAL_FLOW_DEFAULTS, RADIAL_FLOW_BALL_RADIUS, SECTOR_COUNT_MINIMUM } from '../metaballs-scene/config.js';

export function createRadialFlowScenery(scene, settings) {
    const { ground_plate } = createVolcanoLandscape(scene);

    const methods = {
        getGroundVisible: ground_plate.getVisible,
        setGroundVisible: ground_plate.setVisible,
        getSlowDown: () => settings.slow_down,
        setSlowDown: value => { settings.slow_down = value; },
        getSectorsEnabled: () => settings.sectors_enabled,
        setSectorsEnabled: value => { settings.sectors_enabled = value; },
        getSectorCount: () => settings.sector_count,
        setSectorCount: value => { settings.sector_count = Math.max(SECTOR_COUNT_MINIMUM, Math.round(value)); },
    };

    return {
        computeBalls: elapsed_time => computeFlowBalls(elapsed_time, settings, { radial: true }),
        resetToDefaults(controller) {
            Object.assign(settings, RADIAL_FLOW_DEFAULTS);
            controller.setRadius(RADIAL_FLOW_BALL_RADIUS);
            ground_plate.setVisible(GROUND_DEFAULTS.ground_visible);
        },
        methods,
        setting_accessors: {
            ground_visible: [methods.getGroundVisible, methods.setGroundVisible],
            slow_down: [methods.getSlowDown, methods.setSlowDown],
            sectors_enabled: [methods.getSectorsEnabled, methods.setSectorsEnabled],
            sector_count: [methods.getSectorCount, methods.setSectorCount],
        },
    };
}
