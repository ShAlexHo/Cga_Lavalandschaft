import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

const clock_state = vi.hoisted(() => ({ deltas: [] }));
const renderer_state = vi.hoisted(() => ({ last: null }));

vi.mock('three', () => ({
    Scene: class { add() {} },
    Color: class { constructor(value) { this.value = value; } },
    WebGLRenderer: class {
        constructor() {
            this.domElement = document.createElement('canvas');
            this.domElement.toDataURL = vi.fn(() => 'data:image/jpeg;base64,AAAA');
            this.shadowMap = {};
            this.setSize = vi.fn();
            this.setPixelRatio = vi.fn();
            this.compile = vi.fn();
            this.dispose = vi.fn();
            this.forceContextLoss = vi.fn();
            renderer_state.last = this;
        }
    },
    Clock: class {
        getDelta() { return clock_state.deltas.shift() ?? 0; }
    },
    ReinhardToneMapping: 'reinhard',
    PCFSoftShadowMap: 'pcf-soft',
}));

vi.mock('../scene_controller.js', () => ({
    createSceneController: vi.fn(() => ({
        update: vi.fn(),
        getTimeScale: vi.fn(() => 1),
        isPaused: vi.fn(() => false),
        getInteractionMode: vi.fn(() => false),
        getVolcanoPosition: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
        getSunMesh: vi.fn(),
        getGroundMesh: vi.fn(),
        getVolcanoMesh: vi.fn(),
        startAudio: vi.fn(),
        stopAudio: vi.fn(),
        closeAudio: vi.fn(),
        fastForward: vi.fn(),
        getSnapshot: vi.fn(() => ({ timeScale: 1, groundHeight: -6 })),
        applySnapshot: vi.fn(),
    })),
}));

vi.mock('../objects/camera_object.js', () => ({
    createCameraController: vi.fn(() => ({
        camera: { position: { copy: vi.fn(), clone: vi.fn(() => ({ x: 1, y: 2, z: 3 })) } },
        update: vi.fn(),
        resize: vi.fn(),
        setControlsEnabled: vi.fn(),
    })),
}));

vi.mock('../objects/key_light_object.js', () => ({ createKeyLight: vi.fn() }));

vi.mock('../rendering/post_processing.js', () => ({
    createPostProcessing: vi.fn(() => ({
        bloom_pass: {},
        god_rays_pass: {},
        setOccluders: vi.fn(),
        resize: vi.fn(),
        render: vi.fn(),
    })),
}));

vi.mock('../ui/gui.js', () => ({
    setupGui: vi.fn(() => {
        const wrapper = document.createElement('div');
        const panel = document.createElement('div');
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);
        return { domElement: panel };
    }),
}));

import { createSceneEngine, getSceneEngine, closeSceneEngine } from '../scene_engine.js';
import { closeOtherScenes } from '../../scene_registry.js';
import { createSceneController } from '../scene_controller.js';
import { createCameraController } from '../objects/camera_object.js';
import { createPostProcessing } from '../rendering/post_processing.js';
import { setupGui } from '../ui/gui.js';
import { SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS } from '../config.js';

let pending_frame = null;
let next_frame_id = 1;

function runFrame() {
    const callback = pending_frame;
    pending_frame = null;
    callback();
}

function makeContainer(width = 800, height = 600) {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: width });
    Object.defineProperty(container, 'clientHeight', { value: height });
    document.body.appendChild(container);
    return container;
}

function lastController() {
    return createSceneController.mock.results.at(-1).value;
}

function lastUpdateTime() {
    return lastController().update.mock.calls.at(-1)[0];
}

beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    clock_state.deltas = [];
    pending_frame = null;
    vi.stubGlobal('requestAnimationFrame', vi.fn(callback => { pending_frame = callback; return next_frame_id++; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn(() => { pending_frame = null; }));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('createSceneEngine', () => {
    test('fast-forwards the lava simulation and starts the clock at the warm-up time', () => {
        const engine = createSceneEngine();

        expect(lastController().fastForward).toHaveBeenCalledWith(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS);
        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS);
    });

    test('sets up the GUI with only the mode toggles, restoring the saved ones on a fresh start', () => {
        createSceneEngine();
        expect(setupGui).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ mode_controls_only: true, restore_saved: true }));
    });

    test('detaches the GUI panel from <body> until the scene is mounted', () => {
        createSceneEngine();
        const gui_panel = setupGui.mock.results.at(-1).value.domElement;
        expect(gui_panel.parentElement.isConnected).toBe(false);
    });

    test('mount() moves the canvas and GUI panel into the container and renders a frame', () => {
        const engine = createSceneEngine();
        const container = makeContainer();
        engine.mount(container);

        const gui_panel = setupGui.mock.results.at(-1).value.domElement;
        expect(container.querySelector('canvas')).not.toBeNull();
        expect(container.contains(gui_panel)).toBe(true);
        expect(createPostProcessing.mock.results.at(-1).value.render).toHaveBeenCalled();
    });

    test('mount() sizes camera, renderer and post-processing to the container', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer(1024, 512));

        expect(createCameraController.mock.results.at(-1).value.resize).toHaveBeenCalledWith(1024, 512);
        expect(createPostProcessing.mock.results.at(-1).value.resize).toHaveBeenCalledWith(1024, 512);
    });

    test('elapsed time accumulates scaled frame deltas', () => {
        const engine = createSceneEngine();
        lastController().getTimeScale.mockReturnValue(2);
        clock_state.deltas = [0, 0.5, 0.25];
        engine.mount(makeContainer());
        runFrame();

        expect(engine.getElapsedTime()).toBeCloseTo(SCENE_WARM_UP_SECONDS + 1.5);
        expect(lastUpdateTime()).toBeCloseTo(SCENE_WARM_UP_SECONDS + 1.5);
    });

    test('elapsed time does not advance while the scene is paused', () => {
        const engine = createSceneEngine();
        lastController().isPaused.mockReturnValue(true);
        clock_state.deltas = [0, 1, 1];
        engine.mount(makeContainer());
        runFrame();

        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS);
    });

    test('unmount() stops the render loop and suspends audio', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.unmount();

        expect(cancelAnimationFrame).toHaveBeenCalled();
        expect(pending_frame).toBeNull();
        expect(lastController().stopAudio).toHaveBeenCalledTimes(1);
    });

    test('re-mounting resumes from the elapsed time it was left at, ignoring the time spent away', () => {
        const engine = createSceneEngine();
        clock_state.deltas = [0, 1, 1];
        engine.mount(makeContainer());
        runFrame();
        engine.unmount();
        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2);

        clock_state.deltas = [120, 0.5];
        engine.mount(makeContainer());

        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS + 2.5);
        expect(lastUpdateTime()).toBe(SCENE_WARM_UP_SECONDS + 2.5);
    });

    test('re-mounting keeps the same scene controller, so settings survive', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.unmount();
        engine.mount(makeContainer());

        expect(createSceneController).toHaveBeenCalledTimes(1);
    });

    test('mount() starts audio, and listens for a gesture in case the browser still blocks it', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        expect(lastController().startAudio).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('pointerdown'));
        expect(lastController().startAudio).toHaveBeenCalledTimes(2);
    });

    test('unmount() removes the audio gesture listeners', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.unmount();

        window.dispatchEvent(new Event('pointerdown'));
        window.dispatchEvent(new Event('keydown'));
        expect(lastController().startAudio).toHaveBeenCalledTimes(1);
    });

    test('unmount() stops reacting to window resizes', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.unmount();
        const resize = createCameraController.mock.results.at(-1).value.resize;
        resize.mockClear();

        window.dispatchEvent(new Event('resize'));
        expect(resize).not.toHaveBeenCalled();
    });

    test('prepare() compiles the shaders and renders one off-screen frame without starting the loop', () => {
        const engine = createSceneEngine();
        engine.prepare();

        expect(renderer_state.last.compile).toHaveBeenCalledTimes(1);
        expect(createPostProcessing.mock.results.at(-1).value.render).toHaveBeenCalledTimes(1);
        expect(requestAnimationFrame).not.toHaveBeenCalled();
        expect(renderer_state.last.domElement.isConnected).toBe(false);
    });

    test('prepare() does not advance scene time', () => {
        const engine = createSceneEngine();
        clock_state.deltas = [5];
        engine.prepare();

        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS);
        expect(lastController().update).not.toHaveBeenCalled();
    });

    test('prepare() only does its work once', () => {
        const engine = createSceneEngine();
        engine.prepare();
        engine.prepare();

        expect(renderer_state.last.compile).toHaveBeenCalledTimes(1);
    });

    test('prepare() is skipped once the scene has been mounted', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.prepare();

        expect(renderer_state.last.compile).not.toHaveBeenCalled();
    });

    test('captureScreenshot() renders a fresh frame and returns a JPEG data URL', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        const render = createPostProcessing.mock.results.at(-1).value.render;
        render.mockClear();

        expect(engine.captureScreenshot()).toMatch(/^data:image\/jpeg/);
        expect(render).toHaveBeenCalledTimes(1);
    });
});

describe('createSceneEngine – closing and resuming', () => {
    const RESUME_STATE = { elapsed_time: 9000, snapshot: { timeScale: 4, groundHeight: -6 }, camera_position: { x: 5, y: 6, z: 7 } };

    test('getResumeState() captures scene time, settings and camera position', () => {
        const engine = createSceneEngine();
        expect(engine.getResumeState()).toEqual({
            elapsed_time: SCENE_WARM_UP_SECONDS,
            snapshot: { timeScale: 1, groundHeight: -6 },
            camera_position: { x: 1, y: 2, z: 3 },
        });
    });

    test('a resumed engine continues the scene time without warming up again', () => {
        const engine = createSceneEngine(RESUME_STATE);

        expect(lastController().fastForward).not.toHaveBeenCalled();
        expect(engine.getElapsedTime()).toBe(9000);
        expect(createCameraController.mock.results.at(-1).value.camera.position.copy).toHaveBeenCalledWith(RESUME_STATE.camera_position);
    });

    test('a resumed engine only reapplies the settings that differ, and skips the saved GUI settings', () => {
        createSceneEngine(RESUME_STATE);

        expect(lastController().applySnapshot).toHaveBeenCalledWith({ timeScale: 4 });
        expect(setupGui).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ restore_saved: false }));
    });

    test('dispose() stops the loop, aborts every listener, closes audio and frees the WebGL context', () => {
        const engine = createSceneEngine();
        const container = makeContainer();
        engine.mount(container);
        const gui_signal = setupGui.mock.calls.at(-1)[1].signal;
        const controller_signal = createSceneController.mock.calls.at(-1)[0].signal;

        engine.dispose();

        expect(pending_frame).toBeNull();
        expect(gui_signal.aborted).toBe(true);
        expect(controller_signal).toBe(gui_signal);
        expect(lastController().closeAudio).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.dispose).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.forceContextLoss).toHaveBeenCalledTimes(1);
        expect(container.querySelector('canvas')).toBeNull();
    });
});

describe('getSceneEngine', () => {
    test('creates the engine once and reuses it', () => {
        expect(getSceneEngine()).toBe(getSceneEngine());
        expect(createSceneController).toHaveBeenCalledTimes(1);
    });

    test('closeSceneEngine() frees the engine, and the next one resumes where it was left', () => {
        const closed_engine = getSceneEngine();
        const closed_renderer = renderer_state.last;
        closeSceneEngine();
        expect(closed_renderer.forceContextLoss).toHaveBeenCalled();

        const resumed_engine = getSceneEngine();
        expect(resumed_engine).not.toBe(closed_engine);
        expect(lastController().fastForward).not.toHaveBeenCalled();
        expect(resumed_engine.getElapsedTime()).toBe(closed_engine.getElapsedTime());
    });

    test('opening another scene closes this one through the scene registry', () => {
        getSceneEngine();
        const renderer = renderer_state.last;

        closeOtherScenes('metaballs-scene');
        expect(renderer.forceContextLoss).toHaveBeenCalled();
    });

    test('the scene itself is not closed when it is the one being opened', () => {
        getSceneEngine();
        const renderer = renderer_state.last;

        closeOtherScenes('main-scene');
        expect(renderer.forceContextLoss).not.toHaveBeenCalled();
    });
});
