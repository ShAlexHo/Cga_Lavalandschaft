import { describe, test, expect } from 'vitest';
import { createSettingSnapshots } from '../setting_snapshots.js';

function makeSettings() {
    const values = { speed: 1, visible: true };
    const setting_accessors = {
        speed: [() => values.speed, value => { values.speed = value; }],
        visible: [() => values.visible, value => { values.visible = value; }],
    };
    return { values, setting_accessors };
}

describe('createSettingSnapshots', () => {
    test('a snapshot holds every setting’s current value', () => {
        const { values, setting_accessors } = makeSettings();
        values.speed = 3;
        expect(createSettingSnapshots(setting_accessors).getSnapshot()).toEqual({ speed: 3, visible: true });
    });

    test('applying a snapshot sets the known settings and ignores unknown ones', () => {
        const { values, setting_accessors } = makeSettings();
        createSettingSnapshots(setting_accessors).applySnapshot({ speed: 2, unknown: 5 });
        expect(values).toEqual({ speed: 2, visible: true });
    });

    test('settings added to the accessors later are part of the snapshots too', () => {
        const { setting_accessors } = makeSettings();
        const snapshots = createSettingSnapshots(setting_accessors);
        let count = 7;
        setting_accessors.count = [() => count, value => { count = value; }];

        expect(snapshots.getSnapshot()).toMatchObject({ count: 7 });
        snapshots.applySnapshot({ count: 9 });
        expect(count).toBe(9);
    });
});
