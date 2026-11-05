import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createScenePreparation } from '../scene_preparation.js';

let idle_callbacks;
let scene_preparation;

function makeLoader() {
    const engine = { prepare: vi.fn() };
    const loadEngine = vi.fn(async () => ({ getSceneEngine: () => engine }));
    return { engine, loadEngine };
}

async function runIdleTime() {
    const callbacks = idle_callbacks.splice(0);
    callbacks.forEach(callback => callback());
    await vi.advanceTimersByTimeAsync(0);
}

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    idle_callbacks = [];
    vi.stubGlobal('requestIdleCallback', vi.fn(callback => idle_callbacks.push(callback)));
    scene_preparation = createScenePreparation();
});

afterEach(() => {
    scene_preparation.dispose();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

async function prepareOneScene() {
    await runIdleTime();
    await runIdleTime();
}

describe('createScenePreparation', () => {
    test('loads a requested scene in one idle period and prepares it in the next, never forced by a timeout, and only once', async () => {
        const { engine, loadEngine } = makeLoader();
        scene_preparation.request('noise-scene', loadEngine);
        scene_preparation.request('noise-scene', loadEngine);

        expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function));
        expect(loadEngine).not.toHaveBeenCalled();

        await runIdleTime();
        expect(loadEngine).toHaveBeenCalledTimes(1);
        expect(engine.prepare).not.toHaveBeenCalled();

        await runIdleTime();
        expect(engine.prepare).toHaveBeenCalledTimes(1);
        expect(engine.prepare).toHaveBeenCalledWith(expect.any(Function));
        expect(idle_callbacks).toHaveLength(0);
    });

    test('prepares one scene after the other, the one pointed at most recently first', async () => {
        const first = makeLoader();
        const second = makeLoader();
        scene_preparation.request('noise-scene', first.loadEngine);
        scene_preparation.request('surface-scene', second.loadEngine);

        await prepareOneScene();
        expect(second.engine.prepare).toHaveBeenCalled();
        expect(first.engine.prepare).not.toHaveBeenCalled();

        await prepareOneScene();
        expect(first.engine.prepare).toHaveBeenCalled();
    });

    test('pointing at a waiting scene again moves it to the front of the queue', async () => {
        const pointed_again = makeLoader();
        const waiting = makeLoader();
        const latest = makeLoader();
        scene_preparation.request('noise-scene', pointed_again.loadEngine);
        scene_preparation.request('surface-scene', waiting.loadEngine);
        scene_preparation.request('ground-scene', latest.loadEngine);
        scene_preparation.request('noise-scene', pointed_again.loadEngine);

        await prepareOneScene();
        expect(pointed_again.engine.prepare).toHaveBeenCalledTimes(1);
        await prepareOneScene();
        expect(latest.engine.prepare).toHaveBeenCalled();
        expect(waiting.engine.prepare).not.toHaveBeenCalled();
    });

    test('waits until scrolling has paused for half a second before loading or preparing', async () => {
        const { engine, loadEngine } = makeLoader();
        window.dispatchEvent(new Event('scroll'));
        scene_preparation.request('main-scene', loadEngine);

        await runIdleTime();
        expect(loadEngine).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(300);
        window.dispatchEvent(new Event('wheel'));
        await vi.advanceTimersByTimeAsync(300);
        await runIdleTime();
        expect(loadEngine).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(500);
        await runIdleTime();
        expect(loadEngine).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('touchmove'));
        await runIdleTime();
        expect(engine.prepare).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(500);
        await runIdleTime();
        expect(engine.prepare).toHaveBeenCalledTimes(1);
    });

    test('a scene that builds in steps takes one step per quiet idle period, pausing while the page is scrolled', async () => {
        const steps = [];
        const prepareSceneEngineGradually = vi.fn(async waitForTurn => {
            await waitForTurn();
            steps.push('renderer');
            await waitForTurn();
            steps.push('warm-up');
        });
        const getSceneEngine = vi.fn();
        scene_preparation.request('main-scene', async () => ({ prepareSceneEngineGradually, getSceneEngine }));

        await runIdleTime();
        expect(prepareSceneEngineGradually).toHaveBeenCalledWith(expect.any(Function));
        expect(steps).toEqual([]);

        await runIdleTime();
        expect(steps).toEqual(['renderer']);

        window.dispatchEvent(new Event('scroll'));
        await runIdleTime();
        expect(steps).toEqual(['renderer']);

        await vi.advanceTimersByTimeAsync(500);
        await runIdleTime();
        expect(steps).toEqual(['renderer', 'warm-up']);
        expect(getSceneEngine).not.toHaveBeenCalled();
    });

    test('after dispose, nothing more is prepared and scrolling is no longer watched', async () => {
        const { engine, loadEngine } = makeLoader();
        const remove_listener = vi.spyOn(window, 'removeEventListener');
        scene_preparation.request('main-scene', loadEngine);
        scene_preparation.dispose();

        await prepareOneScene();
        expect(loadEngine).not.toHaveBeenCalled();
        expect(engine.prepare).not.toHaveBeenCalled();
        expect(remove_listener).toHaveBeenCalledWith('scroll', expect.any(Function));
        scene_preparation.request('noise-scene', loadEngine);
        expect(idle_callbacks).toHaveLength(0);
    });
});
