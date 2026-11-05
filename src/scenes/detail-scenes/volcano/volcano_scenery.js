import { computeFlowBalls } from './flow_animation.js';
import { createVolcanoLandscape } from './volcano_landscape.js';
import { GROUND_DEFAULTS } from '../metaballs/config.js';
import { VOLCANO_DEFAULTS, LAVA_FLOW_DEFAULTS, LAVA_FLOW_BALL_RADIUS, SECTOR_COUNT_MINIMUM } from './config.js';

const STRAIGHT_FLOW_DEFAULTS = { ...VOLCANO_DEFAULTS, slow_down: false, sectors_enabled: false };

export function createVolcanoScenery(scene, settings) {
    const { ground_plate } = createVolcanoLandscape(scene);
    let radial = false;

    const methods = {
        getGroundVisible: ground_plate.getVisible,
        setGroundVisible: ground_plate.setVisible,
        getSpawnHeight: () => settings.spawn_height,
        setSpawnHeight: value => { settings.spawn_height = value; },
        getFlowSlope: () => settings.flow_slope,
        setFlowSlope: value => { settings.flow_slope = value; },
        getSlowDown: () => settings.slow_down,
        setSlowDown: value => { settings.slow_down = value; },
        getSectorsEnabled: () => settings.sectors_enabled,
        setSectorsEnabled: value => { settings.sectors_enabled = value; },
        getSectorCount: () => settings.sector_count,
        setSectorCount: value => { settings.sector_count = Math.max(SECTOR_COUNT_MINIMUM, Math.round(value)); },
    };

    const straight_accessors = {
        ground_visible: [methods.getGroundVisible, methods.setGroundVisible],
        spawn_height: [methods.getSpawnHeight, methods.setSpawnHeight],
        flow_slope: [methods.getFlowSlope, methods.setFlowSlope],
    };
    const radial_accessors = {
        ground_visible: [methods.getGroundVisible, methods.setGroundVisible],
        slow_down: [methods.getSlowDown, methods.setSlowDown],
        sectors_enabled: [methods.getSectorsEnabled, methods.setSectorsEnabled],
        sector_count: [methods.getSectorCount, methods.setSectorCount],
    };

    return {
        activate(mode) {
            radial = mode.with_radial_flow;
        },
        deactivate: () => ground_plate.setVisible(false),
        computeBalls: elapsed_time => computeFlowBalls(elapsed_time, settings, { radial }),
        resetToDefaults(controller) {
            Object.assign(settings, radial ? LAVA_FLOW_DEFAULTS : STRAIGHT_FLOW_DEFAULTS);
            if (radial) controller.setRadius(LAVA_FLOW_BALL_RADIUS);
            ground_plate.setVisible(GROUND_DEFAULTS.ground_visible);
        },
        methods,
        get setting_accessors() {
            return radial ? radial_accessors : straight_accessors;
        },
    };
}
