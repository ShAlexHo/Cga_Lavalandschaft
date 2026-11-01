import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../../metaballs-scene/metaballs_engine.js', () => ({
    createMetaballsEngine: vi.fn(({ resume_state }) => ({
        resume_state,
        getResumeState: vi.fn(() => ({ elapsed_time: 12 })),
        dispose: vi.fn(),
    })),
}));

import { createSceneEngine, getSceneEngine, closeSceneEngine } from '../scene_engine.js';
import { createMetaballsEngine } from '../../metaballs-scene/metaballs_engine.js';
import { setupVolcanoGui } from '../volcano_gui.js';
import { createVolcanoScenery } from '../volcano_scenery.js';
import { VOLCANO_CAMERA_SETUP } from '../../metaballs-scene/config.js';
import { CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE } from '../../main-scene/config.js';
import { closeOtherScenes } from '../../scene_registry.js';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('volcano scene engine', () => {
    test('is the metaballs engine with the full lava surface flowing down a volcano, and the volcano panel', () => {
        createSceneEngine();
        expect(createMetaballsEngine).toHaveBeenCalledWith({
            resume_state: null, noise: true, surface: true, createScenery: createVolcanoScenery, camera_setup: VOLCANO_CAMERA_SETUP, setupGui: setupVolcanoGui,
        });
    });

    test('frames the volcano exactly like the main scene does', () => {
        const { x, y, z } = VOLCANO_CAMERA_SETUP.position;
        expect(VOLCANO_CAMERA_SETUP.fov).toBe(MAIN_SCENE_CAMERA_FOV);
        expect(Math.hypot(x, y, z)).toBeCloseTo(MAIN_SCENE_CAMERA_DISTANCE, 9);
    });

    test('closing it keeps a resume state for the next engine', () => {
        const closed = getSceneEngine();
        closeSceneEngine();
        expect(closed.dispose).toHaveBeenCalled();

        const resumed = getSceneEngine();
        expect(resumed.resume_state).toEqual({ elapsed_time: 12 });
    });

    test('is closed through the scene registry when another scene opens', () => {
        const engine = getSceneEngine();
        closeOtherScenes('ground-scene');
        expect(engine.dispose).toHaveBeenCalled();
    });
});
