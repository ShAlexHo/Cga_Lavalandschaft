const open_scenes = new Map();

export function registerOpenScene(scene_name, close) {
    open_scenes.set(scene_name, close);
}

export function defineSceneEngine(scene_name, createSceneEngine) {
    let engine = null;
    let resume_state = null;

    function closeSceneEngine() {
        if (!engine) return;
        resume_state = engine.getResumeState();
        engine.dispose();
        engine = null;
    }

    function getSceneEngine() {
        if (!engine) {
            engine = createSceneEngine(resume_state);
            registerOpenScene(scene_name, closeSceneEngine);
        }
        return engine;
    }

    return { getSceneEngine, closeSceneEngine };
}

export function closeOtherScenes(scene_name) {
    for (const [other_scene_name, close] of open_scenes) {
        if (other_scene_name === scene_name) continue;
        open_scenes.delete(other_scene_name);
        close();
    }
}
