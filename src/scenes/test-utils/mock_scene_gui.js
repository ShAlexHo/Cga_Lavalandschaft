import { vi } from 'vitest';
import { GUI } from 'dat.gui';

function makeController() {
    return { name: vi.fn().mockReturnThis(), updateDisplay: vi.fn() };
}

export function makeMockGui() {
    const registry = [];
    const folders = [];

    function record(folder_name) {
        return vi.fn((bound_object, key, ...range) => {
            const controller = makeController();
            registry.push({ folder: folder_name, bound_object, key, range, controller });
            return controller;
        });
    }

    const gui = {
        domElement: document.createElement('div'),
        add: record('root'),
        addColor: record('root'),
        addFolder: vi.fn(name => {
            const folder = { name, add: record(name), addColor: record(name), open: vi.fn() };
            folders.push(folder);
            return folder;
        }),
        destroy: vi.fn(),
    };
    GUI.mockImplementation(() => gui);
    return { gui, registry, folders };
}

export function findControl(registry, key) {
    const entry = registry.find(candidate => candidate.key === key);
    if (!entry) throw new Error(`no controller registered for ${key}`);
    return entry;
}
