import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../metaballs-scene/detail_scene_engine.js', () => ({
    createDetailSceneEngine: vi.fn(({ resume_state }) => ({
        resume_state,
        getResumeState: vi.fn(() => ({ elapsed_time: 12 })),
        dispose: vi.fn(),
    })),
}));

import { createDetailSceneEngine } from '../metaballs-scene/detail_scene_engine.js';
import { closeOtherScenes } from '../scene_registry.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';
import { LANDSCAPE_VOLCANO_CAMERA_SETUP } from '../volcano-irregularities-scene/config.js';
import {
    CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE,
    CAMERA_MIN_DISTANCE as MAIN_SCENE_CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE as MAIN_SCENE_CAMERA_MAX_DISTANCE,
    CAMERA_MIN_POLAR_ANGLE as MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE as MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE,
} from '../main-scene/config.js';
import * as noise_scene from '../noise-scene/scene_engine.js';
import * as surface_scene from '../surface-scene/scene_engine.js';
import * as ground_scene from '../ground-scene/scene_engine.js';
import * as volcano_scene from '../volcano-scene/scene_engine.js';
import * as lava_flow_scene from '../lava-flow-scene/scene_engine.js';
import { setupNoiseGui } from '../noise-scene/noise_gui.js';
import { setupSurfaceGui } from '../surface-scene/surface_gui.js';
import { setupGroundGui } from '../ground-scene/ground_gui.js';
import { createGroundScenery } from '../ground-scene/ground_scenery.js';
import { setupVolcanoGui } from '../volcano-scene/volcano_gui.js';
import { createVolcanoScenery } from '../volcano-scene/volcano_scenery.js';
import { setupLavaFlowGui } from '../lava-flow-scene/lava_flow_gui.js';
import { createLavaFlowScenery } from '../lava-flow-scene/lava_flow_scenery.js';
import * as volcano_irregularities_scene from '../volcano-irregularities-scene/scene_engine.js';
import { createLandscapeVolcanoController } from '../volcano-irregularities-scene/landscape_volcano_controller.js';
import { setupVolcanoIrregularitiesGui } from '../volcano-irregularities-scene/volcano_irregularities_gui.js';
import * as smoke_ash_scene from '../smoke-ash-scene/scene_engine.js';
import { setupSmokeAshGui } from '../smoke-ash-scene/smoke_ash_gui.js';
import * as lava_landscape_scene from '../lava-landscape-scene/scene_engine.js';
import { setupLavaLandscapeGui } from '../lava-landscape-scene/lava_landscape_gui.js';
import { LAVA_LANDSCAPE_CAMERA_SETUP } from '../lava-landscape-scene/config.js';

const DETAIL_SCENE_ENGINES = [
    { scene_name: 'noise-scene', scene_module: noise_scene, options: { controller_options: { noise: true }, setupGui: setupNoiseGui } },
    { scene_name: 'surface-scene', scene_module: surface_scene, options: { controller_options: { noise: true, surface: true }, setupGui: setupSurfaceGui } },
    {
        scene_name: 'ground-scene', scene_module: ground_scene,
        options: { controller_options: { noise: true, surface: true, createScenery: createGroundScenery }, setupGui: setupGroundGui },
    },
    {
        scene_name: 'volcano-scene', scene_module: volcano_scene,
        options: {
            controller_options: { noise: true, surface: true, createScenery: createVolcanoScenery }, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupVolcanoGui,
        },
    },
    {
        scene_name: 'lava-flow-scene', scene_module: lava_flow_scene,
        options: {
            controller_options: { noise: true, surface: true, createScenery: createLavaFlowScenery },
            camera_setup: VOLCANO_CAMERA_SETUP,
            setupGui: setupLavaFlowGui,
        },
    },
    {
        scene_name: 'volcano-irregularities-scene', scene_module: volcano_irregularities_scene,
        options: {
            createController: createLandscapeVolcanoController,
            controller_options: { metaball_animation: expect.any(Object) },
            camera_setup: LANDSCAPE_VOLCANO_CAMERA_SETUP,
            setupGui: setupVolcanoIrregularitiesGui,
        },
    },
    {
        scene_name: 'smoke-ash-scene', scene_module: smoke_ash_scene,
        options: {
            createController: createLandscapeVolcanoController,
            controller_options: { metaball_animation: expect.any(Object), with_smoke: true },
            camera_setup: LANDSCAPE_VOLCANO_CAMERA_SETUP,
            setupGui: setupSmokeAshGui,
        },
    },
    {
        scene_name: 'lava-landscape-scene', scene_module: lava_landscape_scene,
        options: {
            createController: createLandscapeVolcanoController,
            controller_options: { metaball_animation: expect.any(Object), with_smoke: true, with_crack_ground: true },
            camera_setup: LAVA_LANDSCAPE_CAMERA_SETUP,
            setupGui: setupLavaLandscapeGui,
        },
    },
];

beforeEach(() => {
    vi.clearAllMocks();
});

describe.each(DETAIL_SCENE_ENGINES)('$scene_name engine', ({ scene_module, options }) => {
    test('is the detail scene engine with the scene’s own controller options, camera and panel', () => {
        scene_module.createSceneEngine();
        expect(createDetailSceneEngine).toHaveBeenCalledWith({ resume_state: null, ...options });
    });

    test('closing it keeps a resume state for the next engine', () => {
        const closed = scene_module.getSceneEngine();
        scene_module.closeSceneEngine();
        expect(closed.dispose).toHaveBeenCalled();

        const resumed = scene_module.getSceneEngine();
        expect(resumed.resume_state).toEqual({ elapsed_time: 12 });
    });

    test('is closed through the scene registry when another scene opens', () => {
        const engine = scene_module.getSceneEngine();
        closeOtherScenes('main-scene');
        expect(engine.dispose).toHaveBeenCalled();
    });
});

describe('metaball animations of the landscape-like scenes', () => {
    test('every scene keeps an animation of its own, so switching between them leaves each scene’s lava intact', () => {
        volcano_irregularities_scene.createSceneEngine();
        smoke_ash_scene.createSceneEngine();
        lava_landscape_scene.createSceneEngine();
        const animations = createDetailSceneEngine.mock.calls.slice(-3).map(([options]) => options.controller_options.metaball_animation);
        expect(new Set(animations).size).toBe(3);
    });
});

describe('volcano camera setup', () => {
    test('the lava landscape keeps the camera above the ground and below the top, like the main scene', () => {
        expect(LAVA_LANDSCAPE_CAMERA_SETUP).toEqual({
            ...LANDSCAPE_VOLCANO_CAMERA_SETUP,
            polar_angle: { min: MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, max: MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE },
        });
        const { y, z } = LAVA_LANDSCAPE_CAMERA_SETUP.position;
        const starting_polar_angle = Math.atan2(z, y);
        expect(starting_polar_angle).toBeGreaterThan(MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE);
        expect(starting_polar_angle).toBeLessThan(MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE);
    });

    test('frames the volcano exactly like the main scene does', () => {
        const { x, y, z } = VOLCANO_CAMERA_SETUP.position;
        expect(VOLCANO_CAMERA_SETUP.fov).toBe(MAIN_SCENE_CAMERA_FOV);
        expect(Math.hypot(x, y, z)).toBeCloseTo(MAIN_SCENE_CAMERA_DISTANCE, 9);
    });

    test('the landscape volcano keeps the same framing, but its camera does not turn by itself and zooms as far as the main scene’s', () => {
        expect(LANDSCAPE_VOLCANO_CAMERA_SETUP).toEqual({
            ...VOLCANO_CAMERA_SETUP,
            auto_rotate: false,
            zoom_distance: { min: MAIN_SCENE_CAMERA_MIN_DISTANCE, max: MAIN_SCENE_CAMERA_MAX_DISTANCE },
        });
        expect(VOLCANO_CAMERA_SETUP.auto_rotate).toBe(true);
        expect(VOLCANO_CAMERA_SETUP.zoom_distance).toBeUndefined();
    });
});
