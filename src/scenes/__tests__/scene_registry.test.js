import { describe, test, expect, vi } from 'vitest';
import { closeOtherScenes, registerOpenScene } from '../scene_registry.js';

describe('closeOtherScenes', () => {
    test('closes every open scene except the one being opened', () => {
        const close_main = vi.fn();
        const close_group = vi.fn();
        registerOpenScene('main-scene', close_main);
        registerOpenScene('some-group', close_group, ['first-scene', 'second-scene']);

        closeOtherScenes('second-scene');
        expect(close_main).toHaveBeenCalled();
        expect(close_group).not.toHaveBeenCalled();

        closeOtherScenes('main-scene');
        expect(close_group).toHaveBeenCalled();
    });
});
