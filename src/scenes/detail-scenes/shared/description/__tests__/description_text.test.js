import { describe, test, expect } from 'vitest';
import { splitSceneReferences } from '../description_text.js';

const SCENE_NAMES = ['metaballs-scene', 'noise-scene', 'surface-scene'];

describe('splitSceneReferences', () => {
    test('turns German and English references to existing scenes into links and keeps the text around them', () => {
        expect(splitSceneReferences('Wie in Szene 2 (siehe Szene 3).', SCENE_NAMES)).toEqual([
            { text: 'Wie in ' },
            { text: 'Szene 2', scene_name: 'noise-scene' },
            { text: ' (siehe ' },
            { text: 'Szene 3', scene_name: 'surface-scene' },
            { text: ').' },
        ]);
        expect(splitSceneReferences('as in scene 1', SCENE_NAMES)).toEqual([
            { text: 'as in ' },
            { text: 'scene 1', scene_name: 'metaballs-scene' },
        ]);
    });

    test('leaves unknown scene numbers and texts without references unchanged', () => {
        expect(splitSceneReferences('in Szene 12 und in der Hauptszene', SCENE_NAMES)).toEqual([{ text: 'in Szene 12 und in der Hauptszene' }]);
        expect(splitSceneReferences('', SCENE_NAMES)).toEqual([]);
    });
});
