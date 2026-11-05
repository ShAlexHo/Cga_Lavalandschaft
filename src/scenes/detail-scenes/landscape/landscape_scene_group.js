import { defineSceneGroup } from '../shared/scene_group.js';
import { createMetaballAnimation } from '../../main-scene/animation/metaball_animation.js';
import { createRandom } from '../../main-scene/random.js';
import { RANDOM_SEED } from '../../main-scene/config.js';
import { createLandscapeController } from './landscape_controller.js';
import { LANDSCAPE_CAMERA_SETUP, LAVA_LANDSCAPE_CAMERA_SETUP, SUN_GOD_RAYS_CAMERA_SETUP } from './config.js';
import { setupVolcanoIrregularitiesGui } from './volcano_irregularities_gui.js';
import { setupSmokeAshGui } from './smoke_ash_gui.js';
import { setupLavaLandscapeGui } from './lava_landscape_gui.js';
import { setupSunGodRaysGui } from './sun_god_rays_gui.js';

const SMOKE_MODE = { with_smoke: true };
const CRACK_GROUND_MODE = { ...SMOKE_MODE, with_crack_ground: true };
const SUN_MODE = { ...CRACK_GROUND_MODE, with_sun: true, like_main_scene: true };

function withOwnLava(mode = {}) {
    return { ...mode, metaball_animation: createMetaballAnimation(createRandom(RANDOM_SEED)) };
}

export const LANDSCAPE_SCENE_GROUP = defineSceneGroup('landscape-scenes', {
    createController: createLandscapeController,
    with_god_rays: true,
    scenes: {
        'volcano-irregularities-scene': { mode: withOwnLava(), camera_setup: LANDSCAPE_CAMERA_SETUP, setupGui: setupVolcanoIrregularitiesGui },
        'smoke-ash-scene': { mode: withOwnLava(SMOKE_MODE), camera_setup: LANDSCAPE_CAMERA_SETUP, setupGui: setupSmokeAshGui },
        'lava-landscape-scene': { mode: withOwnLava(CRACK_GROUND_MODE), camera_setup: LAVA_LANDSCAPE_CAMERA_SETUP, setupGui: setupLavaLandscapeGui },
        'sun-god-rays-scene': { mode: withOwnLava(SUN_MODE), camera_setup: SUN_GOD_RAYS_CAMERA_SETUP, setupGui: setupSunGodRaysGui },
    },
});
