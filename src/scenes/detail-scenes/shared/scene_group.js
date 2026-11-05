import { createDetailSceneEngine, createSceneGroupState } from './detail_scene_engine.js';
import { registerOpenScene } from '../../scene_registry.js';

export function defineSceneGroup(group_name, engine_options) {
    const group_state = createSceneGroupState();
    let engine = null;

    function closeGroup() {
        if (!engine) return;
        engine.dispose();
        engine = null;
    }

    function getGroupEngine() {
        if (!engine) {
            engine = createDetailSceneEngine({ ...engine_options, group_state });
            registerOpenScene(group_name, closeGroup, Object.keys(engine_options.scenes));
        }
        return engine;
    }

    return {
        sceneEngine: scene_name => ({ getSceneEngine: () => getGroupEngine().viewFor(scene_name) }),
    };
}
