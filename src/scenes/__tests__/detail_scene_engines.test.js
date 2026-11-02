import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../metaballs-scene/metaballs_engine.js', () => ({
    createMetaballsEngine: vi.fn(({ resume_state }) => ({
        resume_state,
        getResumeState: vi.fn(() => ({ elapsed_time: 12 })),
        dispose: vi.fn(),
    })),
}));

import { createMetaballsEngine } from '../metaballs-scene/metaballs_engine.js';
import { closeOtherScenes } from '../scene_registry.js';
import { VOLCANO_CAMERA_SETUP } from '../metaballs-scene/config.js';
import { CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE } from '../main-scene/config.js';
import * as noise_scene from '../noise-scene/scene_engine.js';
import * as surface_scene from '../surface-scene/scene_engine.js';
import * as ground_scene from '../ground-scene/scene_engine.js';
import * as volcano_scene from '../volcano-scene/scene_engine.js';
import * as radial_flow_scene from '../radial-flow-scene/scene_engine.js';
import { setupNoiseGui } from '../noise-scene/noise_gui.js';
import { setupSurfaceGui } from '../surface-scene/surface_gui.js';
import { setupGroundGui } from '../ground-scene/ground_gui.js';
import { createGroundScenery } from '../ground-scene/ground_scenery.js';
import { setupVolcanoGui } from '../volcano-scene/volcano_gui.js';
import { createVolcanoScenery } from '../volcano-scene/volcano_scenery.js';
import { setupRadialFlowGui } from '../radial-flow-scene/radial_flow_gui.js';
import { createRadialFlowScenery } from '../radial-flow-scene/radial_flow_scenery.js';

const DETAIL_SCENE_ENGINES = [
    { scene_name: 'noise-scene', scene_module: noise_scene, options: { noise: true, setupGui: setupNoiseGui } },
    { scene_name: 'surface-scene', scene_module: surface_scene, options: { noise: true, surface: true, setupGui: setupSurfaceGui } },
    {
        scene_name: 'ground-scene', scene_module: ground_scene,
        options: { noise: true, surface: true, createScenery: createGroundScenery, setupGui: setupGroundGui },
    },
    {
        scene_name: 'volcano-scene', scene_module: volcano_scene,
        options: { noise: true, surface: true, createScenery: createVolcanoScenery, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupVolcanoGui },
    },
    {
        scene_name: 'radial-flow-scene', scene_module: radial_flow_scene,
        options: { noise: true, surface: true, createScenery: createRadialFlowScenery, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupRadialFlowGui },
    },
];

beforeEach(() => {
    vi.clearAllMocks();
});

describe.each(DETAIL_SCENE_ENGINES)('$scene_name engine', ({ scene_module, options }) => {
    test('is the metaballs engine with the scene’s own options, scenery and panel', () => {
        scene_module.createSceneEngine();
        expect(createMetaballsEngine).toHaveBeenCalledWith({ resume_state: null, ...options });
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

describe('volcano camera setup', () => {
    test('frames the volcano exactly like the main scene does', () => {
        const { x, y, z } = VOLCANO_CAMERA_SETUP.position;
        expect(VOLCANO_CAMERA_SETUP.fov).toBe(MAIN_SCENE_CAMERA_FOV);
        expect(Math.hypot(x, y, z)).toBeCloseTo(MAIN_SCENE_CAMERA_DISTANCE, 9);
    });
});
