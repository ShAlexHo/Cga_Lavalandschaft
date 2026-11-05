import { defineSceneGroup } from '../shared/scene_group.js';
import { createMetaballsController, createFloatingScenery } from './metaballs_controller.js';
import { setupMetaballsGui } from './metaballs_gui.js';
import { setupNoiseGui } from './noise_gui.js';
import { setupSurfaceGui } from './surface_gui.js';
import { setupGroundGui } from './ground_gui.js';
import { createGroundScenery } from './ground_scenery.js';
import { GROUND_CAMERA_SETUP } from './config.js';

export const NOISE_MODE = { with_noise: true };
export const SURFACE_MODE = { ...NOISE_MODE, with_surface: true };
const GROUND_MODE = { ...SURFACE_MODE, scenery: 'ground' };

export const METABALLS_SCENE_GROUP = defineSceneGroup('metaballs-scenes', {
    createController: createMetaballsController,
    controller_options: { sceneries: { floating: createFloatingScenery, ground: createGroundScenery } },
    scenes: {
        'metaballs-scene': { setupGui: setupMetaballsGui },
        'noise-scene': { mode: NOISE_MODE, setupGui: setupNoiseGui },
        'surface-scene': { mode: SURFACE_MODE, setupGui: setupSurfaceGui },
        'ground-scene': { mode: GROUND_MODE, camera_setup: GROUND_CAMERA_SETUP, setupGui: setupGroundGui },
    },
});
