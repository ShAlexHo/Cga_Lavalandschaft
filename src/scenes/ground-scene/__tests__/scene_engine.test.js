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
import { setupGroundGui } from '../ground_gui.js';
import { closeOtherScenes } from '../../scene_registry.js';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('ground scene engine', () => {
    test('is the metaballs engine with the full lava surface on a floor, and the ground panel', () => {
        createSceneEngine();
        expect(createMetaballsEngine).toHaveBeenCalledWith({ resume_state: null, noise: true, surface: true, ground: true, setupGui: setupGroundGui });
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
