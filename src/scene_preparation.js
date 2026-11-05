const SCROLL_QUIET_MILLISECONDS = 500;
const IDLE_FALLBACK_MILLISECONDS = 300;
const INTERACTION_EVENTS = ['scroll', 'wheel', 'touchmove'];

function runWhenIdle(callback) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(callback);
    else setTimeout(callback, IDLE_FALLBACK_MILLISECONDS);
}

export function createScenePreparation() {
    const queue = [];
    const requested = new Set();
    let last_interaction_time = -Infinity;
    let is_busy = false;
    let is_disposed = false;

    function noteInteraction() {
        last_interaction_time = performance.now();
    }

    INTERACTION_EVENTS.forEach(type => window.addEventListener(type, noteInteraction, { passive: true }));

    function waitForTurn() {
        return new Promise(resolve => {
            function checkQuiet() {
                if (is_disposed) return;
                const quiet_remaining = last_interaction_time + SCROLL_QUIET_MILLISECONDS - performance.now();
                if (quiet_remaining > 0) setTimeout(() => runWhenIdle(checkQuiet), quiet_remaining);
                else resolve();
            }
            runWhenIdle(checkQuiet);
        });
    }

    function scheduleNext() {
        if (is_busy || is_disposed || queue.length === 0) return;
        is_busy = true;
        prepareNext();
    }

    async function prepareNext() {
        await waitForTurn();
        const { loadEngine } = queue.shift();
        const scene_module = await loadEngine();
        if (scene_module.prepareSceneEngineGradually) {
            await scene_module.prepareSceneEngineGradually(waitForTurn);
        } else {
            await waitForTurn();
            await scene_module.getSceneEngine().prepare(waitForTurn);
        }
        is_busy = false;
        scheduleNext();
    }

    return {
        request(scene_name, loadEngine) {
            if (is_disposed) return;
            if (requested.has(scene_name)) {
                const index = queue.findIndex(entry => entry.scene_name === scene_name);
                if (index > 0) queue.unshift(...queue.splice(index, 1));
                return;
            }
            requested.add(scene_name);
            queue.unshift({ scene_name, loadEngine });
            scheduleNext();
        },
        dispose() {
            is_disposed = true;
            queue.length = 0;
            INTERACTION_EVENTS.forEach(type => window.removeEventListener(type, noteInteraction));
        },
    };
}
