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
import { setupSurfaceGui } from '../surface_gui.js';
import { closeOtherScenes } from '../../scene_registry.js';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('surface scene engine', () => {
    test('is the metaballs engine with noise and surface relief available, and the surface panel', () => {
        createSceneEngine();
        expect(createMetaballsEngine).toHaveBeenCalledWith({ resume_state: null, noise: true, surface: true, setupGui: setupSurfaceGui });
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
        closeOtherScenes('metaballs-scene');
        expect(engine.dispose).toHaveBeenCalled();
    });
});
