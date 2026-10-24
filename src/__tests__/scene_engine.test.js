import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock three ──────────────────────────────────────────────────────────────

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
            renderer_state.last = this;
        }
    },
    Clock: class {
        getDelta() { return clock_state.deltas.shift() ?? 0; }
    },
    ReinhardToneMapping: 'reinhard',
    PCFSoftShadowMap: 'pcf-soft',
}));

// ─── Mock scene modules ──────────────────────────────────────────────────────

vi.mock('../core/scene_controller.js', () => ({
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
        fastForward: vi.fn(),
    })),
}));

vi.mock('../core/objects/camera_object.js', () => ({
    createCameraController: vi.fn(() => ({
        camera: {},
        update: vi.fn(),
        resize: vi.fn(),
        setControlsEnabled: vi.fn(),
    })),
}));

vi.mock('../core/objects/key_light_object.js', () => ({ createKeyLight: vi.fn() }));

vi.mock('../core/rendering/post_processing.js', () => ({
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

import { createSceneEngine, getSceneEngine } from '../scene_engine.js';
import { createSceneController } from '../core/scene_controller.js';
import { createCameraController } from '../core/objects/camera_object.js';
import { createPostProcessing } from '../core/rendering/post_processing.js';
import { setupGui } from '../ui/gui.js';
import { SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS } from '../core/config.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('createSceneEngine', () => {
    test('fast-forwards the lava simulation and starts the clock at the warm-up time', () => {
        const engine = createSceneEngine();

        expect(lastController().fastForward).toHaveBeenCalledWith(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS);
        expect(engine.getElapsedTime()).toBe(SCENE_WARM_UP_SECONDS);
    });

    test('sets up the GUI with only the mode toggles', () => {
        createSceneEngine();
        expect(setupGui).toHaveBeenCalledWith(expect.anything(), { mode_controls_only: true });
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

        // 120 s away are swallowed by mount()'s discarding getDelta() call
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

describe('getSceneEngine', () => {
    test('creates the engine once and reuses it', () => {
        expect(getSceneEngine()).toBe(getSceneEngine());
        expect(createSceneController).toHaveBeenCalledTimes(1);
    });
});
