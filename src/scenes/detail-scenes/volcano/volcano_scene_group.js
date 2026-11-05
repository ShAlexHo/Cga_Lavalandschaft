import { defineSceneGroup } from '../shared/scene_group.js';
import { createMetaballsController } from '../metaballs/metaballs_controller.js';
import { SURFACE_MODE } from '../metaballs/metaballs_scene_group.js';
import { VOLCANO_CAMERA_SETUP } from './config.js';
import { createVolcanoScenery } from './volcano_scenery.js';
import { setupVolcanoGui } from './volcano_gui.js';
import { setupLavaFlowGui } from './lava_flow_gui.js';

const VOLCANO_MODE = { ...SURFACE_MODE, scenery: 'volcano' };
const LAVA_FLOW_MODE = { ...VOLCANO_MODE, with_radial_flow: true };

export const VOLCANO_SCENE_GROUP = defineSceneGroup('volcano-scenes', {
    createController: createMetaballsController,
    controller_options: { sceneries: { volcano: createVolcanoScenery } },
    scenes: {
        'volcano-scene': { mode: VOLCANO_MODE, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupVolcanoGui },
        'lava-flow-scene': { mode: LAVA_FLOW_MODE, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupLavaFlowGui },
    },
});
