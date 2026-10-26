import { describe, test, expect } from 'vitest';
import { DETAIL_SCENES, findDetailScene, neighbouringDetailScenes, numberedTitle } from '../detail_scenes.js';
import { MESSAGES } from '../../ui/messages.js';

describe('DETAIL_SCENES', () => {
    test('numbers the detail scenes from 1 in their order, without the main scene', () => {
        expect(DETAIL_SCENES.map(detail => `${detail.number} ${detail.scene_name}`)).toEqual([
            '1 metaballs-scene', '2 noise-scene', '3 surface-scene', '4 ground-scene',
        ]);
        expect(findDetailScene('main-scene')).toBeNull();
    });

    test('every detail scene has a title in every language', () => {
        for (const messages of Object.values(MESSAGES)) {
            for (const { message_key_prefix } of DETAIL_SCENES) expect(messages[`${message_key_prefix}.title`]).toBeTruthy();
        }
    });
});

describe('neighbouringDetailScenes', () => {
    test('links each scene to the one before and after it, and stops at both ends', () => {
        expect(neighbouringDetailScenes('noise-scene')).toEqual({ previous: findDetailScene('metaballs-scene'), next: findDetailScene('surface-scene') });
        expect(neighbouringDetailScenes('metaballs-scene').previous).toBeNull();
        expect(neighbouringDetailScenes('ground-scene').next).toBeNull();
    });

    test('the main scene has no neighbours', () => {
        expect(neighbouringDetailScenes('main-scene')).toEqual({ previous: null, next: null });
    });
});

describe('numberedTitle', () => {
    test('puts the scene’s number in front of its title', () => {
        expect(numberedTitle(findDetailScene('surface-scene'), 'Surface irregularities')).toBe('3. Surface irregularities');
    });
});
