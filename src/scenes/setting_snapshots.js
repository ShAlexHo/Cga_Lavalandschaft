export function createSettingSnapshots(setting_accessors) {
    return {
        getSnapshot: () => Object.fromEntries(Object.entries(setting_accessors).map(([key, [get]]) => [key, get()])),

        applySnapshot(snapshot) {
            for (const [key, value] of Object.entries(snapshot)) setting_accessors[key]?.[1](value);
        },
    };
}
