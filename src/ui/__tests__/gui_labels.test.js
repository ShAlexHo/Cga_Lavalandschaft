import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('dat.gui', () => ({ GUI: {} }));

import { GUI } from 'dat.gui';
import { createGuiLabels } from '../gui_labels.js';
import { setLanguage } from '../language.js';

function makeGui() {
    return {
        closed: true,
        addFolder: vi.fn(name => ({ name })),
    };
}

beforeEach(() => {
    setLanguage('en');
});

describe('createGuiLabels', () => {
    test('names controllers and folders in the current language', () => {
        const labels = createGuiLabels(makeGui());
        const controller = { name: vi.fn() };

        expect(labels.label(controller, 'gui.paused')).toBe(controller);
        expect(controller.name).toHaveBeenLastCalledWith('⏸ Paused');
        expect(labels.addFolder('gui.folder.ground').name).toBe('Ground');
    });

    test('once following the language, renames everything and the open/close button on every switch', () => {
        const labels = createGuiLabels(makeGui());
        const controller = { name: vi.fn() };
        labels.label(controller, 'gui.paused');
        const folder = labels.addFolder('gui.folder.ground');
        const stopFollowing = labels.followLanguage();
        expect(GUI.TEXT_OPEN).toBe('Open Controls');

        setLanguage('de');
        expect(controller.name).toHaveBeenLastCalledWith('⏸ Pausiert');
        expect(folder.name).toBe('Boden');
        expect(GUI.TEXT_OPEN).not.toBe('Open Controls');

        stopFollowing();
        setLanguage('en');
        expect(folder.name).toBe('Boden');
    });
});
