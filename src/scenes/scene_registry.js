const open_scenes = new Map();

export function registerOpenScene(key, close, scene_names = [key]) {
    open_scenes.set(key, { close, scene_names });
}

export function closeOtherScenes(scene_name) {
    for (const [key, { close, scene_names }] of open_scenes) {
        if (scene_names.includes(scene_name)) continue;
        open_scenes.delete(key);
        close();
    }
}
