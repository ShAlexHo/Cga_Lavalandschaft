import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

const clock_state = vi.hoisted(() => ({ deltas: [] }));
const renderer_state = vi.hoisted(() => ({ last: null, composer: null, camera: null, controls: null }));

vi.mock('three', () => ({
    Scene: class { add() {} },
    Color: class {},
    Vector2: class {},
    Vector3: class {},
    PerspectiveCamera: class {
        constructor(fov, aspect, near, far) {
            this.fov = fov;
            this.far = far;
            this.position = { set: vi.fn(), copy: vi.fn(), clone: vi.fn(() => ({ x: 1, y: 2, z: 3 })) };
            this.updateMatrixWorld = vi.fn();
            this.updateProjectionMatrix = vi.fn();
            renderer_state.camera = this;
        }
    },
    WebGLRenderer: class {
        constructor() {
            this.domElement = document.createElement('canvas');
            this.domElement.toDataURL = vi.fn(() => 'data:image/jpeg;base64,AAAA');
            this.setSize = vi.fn();
            this.setPixelRatio = vi.fn();
            this.compileAsync = vi.fn(async () => {});
            this.dispose = vi.fn();
            this.forceContextLoss = vi.fn();
            renderer_state.last = this;
        }
    },
    Clock: class {
        getDelta() { return clock_state.deltas.shift() ?? 0; }
    },
    ReinhardToneMapping: 'reinhard',
}));

vi.mock('three/addons/controls/OrbitControls.js', () => ({
    OrbitControls: class { constructor() { renderer_state.controls = this; } update() {} dispose() {} },
}));
vi.mock('three/addons/postprocessing/RenderPass.js', () => ({ RenderPass: class {} }));
vi.mock('three/addons/postprocessing/UnrealBloomPass.js', () => ({
    UnrealBloomPass: class { constructor() { this.bloomTintColors = []; } },
}));
vi.mock('three/addons/postprocessing/EffectComposer.js', () => ({
    EffectComposer: class {
        constructor() {
            this.addPass = vi.fn();
            this.render = vi.fn();
            this.setSize = vi.fn();
            this.dispose = vi.fn();
            renderer_state.composer = this;
        }
    },
}));

vi.mock('../../../main-scene/rendering/god_rays_pass.js', () => ({
    createGodRaysPass: vi.fn(() => ({ dispose: vi.fn() })),
}));

import { createDetailSceneEngine, createSceneGroupState } from '../detail_scene_engine.js';
import { DETAIL_CAMERA_SETUP, DETAIL_CAMERA_FAR } from '../config.js';
import { createGodRaysPass } from '../../../main-scene/rendering/god_rays_pass.js';
import { closeOtherScenes } from '../../../scene_registry.js';
import { defineSceneGroup } from '../scene_group.js';

const createMockController = vi.fn(() => {
    let elapsed_time = 0;
    let values = {};
    const controller = {
        update: vi.fn(delta_seconds => { elapsed_time += delta_seconds; }),
        getElapsedTime: () => elapsed_time,
        setElapsedTime: vi.fn(value => { elapsed_time = value; }),
        applyMode: vi.fn(mode => { controller.mode = mode; }),
        resetToDefaults: vi.fn(() => { values = { count: controller.mode.with_noise ? 9 : 7 }; }),
        getSnapshot: vi.fn(() => ({ ...values })),
        applySnapshot: vi.fn(snapshot => { values = { ...values, ...snapshot }; }),
        setCount: value => { values.count = value; },
        getCount: () => values.count,
    };
    return controller;
});

let pending_frame = null;
let visibility_observer = null;

class MockIntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        visibility_observer = this;
    }
}

function setSceneVisible(is_intersecting) {
    visibility_observer.callback([{ isIntersecting: is_intersecting }]);
}

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

function makeSetupGui(class_name) {
    return vi.fn(() => {
        const container = document.createElement('div');
        container.className = `dg ac ${class_name}`;
        return { gui: {}, container };
    });
}

const ZOOMING_CAMERA_SETUP = { fov: 60, position: { x: 1, y: 2, z: 3 }, auto_rotate: true, zoom_distance: { min: 16, max: 36 }, polar_angle: { min: 1, max: 1.4 }, far: 2000 };

let setupPlainGui;
let setupNoisyGui;

function createGroupEngine(options = {}) {
    return createDetailSceneEngine({
        createController: createMockController,
        scenes: {
            'plain-scene': { setupGui: setupPlainGui },
            'noisy-scene': { mode: { with_noise: true }, camera_setup: ZOOMING_CAMERA_SETUP, setupGui: setupNoisyGui },
        },
        ...options,
    });
}

function lastController() {
    return createMockController.mock.results.at(-1).value;
}

beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    clock_state.deltas = [];
    pending_frame = null;
    visibility_observer = null;
    setupPlainGui = makeSetupGui('plain');
    setupNoisyGui = makeSetupGui('noisy');
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('requestAnimationFrame', vi.fn(callback => { pending_frame = callback; return 1; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn(() => { pending_frame = null; }));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('createDetailSceneEngine', () => {
    test('builds one controller for the whole group, and a scene’s view switches it into that scene’s mode with that scene’s panel', () => {
        const engine = createGroupEngine({ scenes: {
            'plain-scene': { mode: { with_surface: true }, setupGui: setupPlainGui },
            'noisy-scene': { mode: { with_noise: true }, camera_setup: ZOOMING_CAMERA_SETUP, setupGui: setupNoisyGui },
        } });
        expect(createMockController).toHaveBeenCalledTimes(1);
        expect(createMockController).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ mode: { with_surface: true } }));

        engine.viewFor('noisy-scene').mount(makeContainer());
        expect(lastController().applyMode).toHaveBeenLastCalledWith({ with_noise: true });
        expect(lastController().resetToDefaults).toHaveBeenCalled();
        expect(setupNoisyGui).toHaveBeenCalledWith(lastController(), { signal: expect.any(AbortSignal) });
        expect(setupPlainGui).not.toHaveBeenCalled();
    });

    test('each scene brings its own camera: the still demo camera, or its own framing, turning, zoom, angles and reach', () => {
        const engine = createGroupEngine();
        engine.viewFor('plain-scene').prepare();
        const camera = renderer_state.camera;
        expect(camera.fov).toBe(DETAIL_CAMERA_SETUP.fov);
        expect(camera.far).toBe(DETAIL_CAMERA_FAR);
        expect(camera.position.set).toHaveBeenLastCalledWith(DETAIL_CAMERA_SETUP.position.x, DETAIL_CAMERA_SETUP.position.y, DETAIL_CAMERA_SETUP.position.z);
        expect(renderer_state.controls).toMatchObject({ autoRotate: false, enableZoom: false, minPolarAngle: 0, maxPolarAngle: Math.PI });

        engine.viewFor('noisy-scene').prepare();
        expect(camera.fov).toBe(60);
        expect(camera.far).toBe(2000);
        expect(camera.updateProjectionMatrix).toHaveBeenCalled();
        expect(camera.position.set).toHaveBeenLastCalledWith(1, 2, 3);
        expect(renderer_state.controls).toMatchObject({ autoRotate: true, enableZoom: true, minDistance: 16, maxDistance: 36, minPolarAngle: 1, maxPolarAngle: 1.4 });
    });

    test('switching to another scene of the group swaps the panel without building anything anew', () => {
        const engine = createGroupEngine();
        const container = makeContainer();
        engine.viewFor('plain-scene').mount(container);
        const plain_signal = setupPlainGui.mock.calls[0][1].signal;
        engine.viewFor('plain-scene').unmount();

        engine.viewFor('noisy-scene').mount(container);
        expect(plain_signal.aborted).toBe(true);
        expect(container.querySelector('.noisy')).not.toBeNull();
        expect(createMockController).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.compileAsync).not.toHaveBeenCalled();
    });

    test('every scene keeps its own settings, camera position and scene time while the others are shown', () => {
        const engine = createGroupEngine();
        clock_state.deltas = [0, 0.08];
        const plain = engine.viewFor('plain-scene');
        plain.mount(makeContainer());
        runFrame();
        lastController().setCount(3);
        plain.unmount();

        const noisy = engine.viewFor('noisy-scene');
        noisy.mount(makeContainer());
        expect(lastController().getCount()).toBe(9);
        lastController().setCount(12);
        noisy.unmount();

        plain.mount(makeContainer());
        expect(lastController().getCount()).toBe(3);
        expect(plain.getElapsedTime()).toBe(0.08);
        expect(renderer_state.camera.position.copy).toHaveBeenLastCalledWith({ x: 1, y: 2, z: 3 });
        plain.unmount();

        noisy.mount(makeContainer());
        expect(lastController().getCount()).toBe(12);
    });

    test('a scene opened for the first time starts at the beginning, not at the time of the scene shown before', () => {
        const engine = createGroupEngine();
        clock_state.deltas = [0, 0.04];
        const plain = engine.viewFor('plain-scene');
        plain.mount(makeContainer());
        runFrame();
        plain.unmount();
        expect(plain.getElapsedTime()).toBe(0.04);

        engine.viewFor('noisy-scene').mount(makeContainer());
        expect(lastController().getElapsedTime()).toBe(0);
    });

    test('mount() moves canvas and panel into the container, sizes them and renders a frame', () => {
        const engine = createGroupEngine();
        const container = makeContainer(1024, 512);
        engine.viewFor('plain-scene').mount(container);

        expect(container.querySelector('canvas')).not.toBeNull();
        expect(container.querySelector('.plain')).not.toBeNull();
        expect(renderer_state.last.setSize).toHaveBeenLastCalledWith(1024, 512);
        expect(renderer_state.composer.setSize).toHaveBeenLastCalledWith(1024, 512);
        expect(renderer_state.composer.render).toHaveBeenCalled();
    });

    test('feeds each frame’s delta to the controller', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        clock_state.deltas = [0, 0.05, 0.025];
        view.mount(makeContainer());
        runFrame();

        expect(view.getElapsedTime()).toBeCloseTo(0.075);
    });

    test('a slow frame advances the scene by at most a tenth of a second, so the lava never jumps', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        clock_state.deltas = [0, 0, 1.5];
        view.mount(makeContainer());
        runFrame();

        expect(view.getElapsedTime()).toBeCloseTo(0.1);
    });

    test('re-mounting resumes where it was left, ignoring the time spent away', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        clock_state.deltas = [0, 0.1, 0.1];
        view.mount(makeContainer());
        runFrame();
        view.unmount();

        clock_state.deltas = [300, 0.05];
        view.mount(makeContainer());
        expect(view.getElapsedTime()).toBeCloseTo(0.25);
    });

    test('pauses rendering while the scene is scrolled out of view, and resumes without the time spent away', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        const container = makeContainer();
        clock_state.deltas = [0, 0.1];
        view.mount(container);
        expect(visibility_observer.observe).toHaveBeenCalledWith(container);
        expect(visibility_observer.options).toEqual({ rootMargin: '-1px' });
        runFrame();

        setSceneVisible(false);
        expect(pending_frame).toBeNull();
        renderer_state.composer.render.mockClear();

        clock_state.deltas = [300, 0.05];
        setSceneVisible(true);
        setSceneVisible(true);
        expect(renderer_state.composer.render).toHaveBeenCalledTimes(1);
        expect(view.getElapsedTime()).toBeCloseTo(0.15);
    });

    test('unmount() stops the render loop, the visibility watch and window resize handling', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        view.mount(makeContainer());
        const observer = visibility_observer;
        view.unmount();
        renderer_state.last.setSize.mockClear();

        expect(pending_frame).toBeNull();
        expect(observer.disconnect).toHaveBeenCalled();
        window.dispatchEvent(new Event('resize'));
        expect(renderer_state.last.setSize).not.toHaveBeenCalled();
    });

    test('prepare() compiles and renders each scene once off-screen without advancing time, so its own objects and lava are ready', async () => {
        const engine = createGroupEngine();
        await engine.viewFor('plain-scene').prepare();
        await engine.viewFor('plain-scene').prepare();
        await engine.viewFor('noisy-scene').prepare();

        expect(renderer_state.last.compileAsync).toHaveBeenCalledTimes(2);
        expect(renderer_state.composer.render).toHaveBeenCalledTimes(2);
        expect(lastController().update).toHaveBeenCalledWith(0, expect.anything());
        expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    test('prepare() compiles without blocking and renders its frame only on the next turn, unless the scene has been opened meanwhile', async () => {
        const engine = createGroupEngine();
        let releaseTurn;
        const waitForTurn = vi.fn(() => new Promise(resolve => { releaseTurn = resolve; }));
        const preparing = engine.viewFor('plain-scene').prepare(waitForTurn);
        await vi.waitFor(() => expect(waitForTurn).toHaveBeenCalled());
        expect(renderer_state.last.compileAsync).toHaveBeenCalledTimes(1);
        expect(renderer_state.composer.render).not.toHaveBeenCalled();

        engine.viewFor('plain-scene').mount(makeContainer());
        renderer_state.composer.render.mockClear();
        releaseTurn();
        await preparing;
        expect(renderer_state.composer.render).not.toHaveBeenCalled();
    });

    test('captureScreenshot() renders a fresh frame and returns a JPEG data URL', () => {
        const view = createGroupEngine().viewFor('plain-scene');
        view.mount(makeContainer());
        renderer_state.composer.render.mockClear();

        expect(view.captureScreenshot()).toMatch(/^data:image\/jpeg/);
        expect(renderer_state.composer.render).toHaveBeenCalledTimes(1);
    });

    test('the group’s controller gets the group’s options together with the renderer for its own render passes', () => {
        createGroupEngine({ controller_options: { flavour: 'own' } }).viewFor('plain-scene').prepare();

        expect(createMockController).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ flavour: 'own', renderer: renderer_state.last }));
        expect(setupPlainGui).toHaveBeenLastCalledWith(lastController(), { signal: expect.any(AbortSignal) });
    });

    test('only a group with god rays gets the god rays pass, between the rendered image and the bloom, and hands it to its controller', () => {
        createGroupEngine();
        expect(createGodRaysPass).not.toHaveBeenCalled();
        expect(createMockController).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ god_rays_pass: null }));

        const engine = createGroupEngine({ with_god_rays: true });
        const god_rays_pass = createGodRaysPass.mock.results.at(-1).value;
        expect(createGodRaysPass).toHaveBeenCalledWith({ scene: expect.anything(), camera: renderer_state.camera });
        const passes = renderer_state.composer.addPass.mock.calls.map(([pass]) => pass);
        expect(passes).toHaveLength(3);
        expect(passes[1]).toBe(god_rays_pass);
        expect(createMockController).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ god_rays_pass }));

        engine.dispose();
        expect(god_rays_pass.dispose).toHaveBeenCalled();
    });

    test('dispose() stops the loop, removes the panel, keeps the shown scene’s state and frees the WebGL context', () => {
        const group_state = createSceneGroupState();
        const engine = createGroupEngine({ group_state });
        const container = makeContainer();
        engine.viewFor('plain-scene').mount(container);
        lastController().setCount(4);
        const gui_signal = setupPlainGui.mock.calls.at(-1)[1].signal;

        engine.dispose();

        expect(pending_frame).toBeNull();
        expect(gui_signal.aborted).toBe(true);
        expect(group_state.scene_states.get('plain-scene').snapshot).toEqual({ count: 4 });
        expect(renderer_state.composer.dispose).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.dispose).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.forceContextLoss).toHaveBeenCalledTimes(1);
        expect(container.querySelector('canvas')).toBeNull();
    });
});

describe('defineSceneGroup', () => {
    let group;

    beforeEach(() => {
        group = defineSceneGroup('test-group', {
            createController: createMockController,
            scenes: { 'plain-scene': { setupGui: setupPlainGui }, 'noisy-scene': { mode: { with_noise: true }, setupGui: setupNoisyGui } },
        });
    });

    afterEach(() => {
        closeOtherScenes('main-scene');
    });

    test('all scenes of the group share one engine, built only once', () => {
        const plain = group.sceneEngine('plain-scene').getSceneEngine();
        const noisy = group.sceneEngine('noisy-scene').getSceneEngine();
        plain.prepare();
        noisy.prepare();
        expect(createMockController).toHaveBeenCalledTimes(1);
    });

    test('opening another scene of the group keeps the engine, opening any other scene closes it', () => {
        group.sceneEngine('plain-scene').getSceneEngine();
        const renderer = renderer_state.last;

        closeOtherScenes('noisy-scene');
        expect(renderer.forceContextLoss).not.toHaveBeenCalled();

        closeOtherScenes('main-scene');
        expect(renderer.forceContextLoss).toHaveBeenCalled();
    });

    test('after closing, the next engine brings back every scene’s own settings', () => {
        const plain = group.sceneEngine('plain-scene').getSceneEngine();
        plain.mount(makeContainer());
        lastController().setCount(5);
        plain.unmount();
        closeOtherScenes('main-scene');

        group.sceneEngine('plain-scene').getSceneEngine().mount(makeContainer());
        expect(createMockController).toHaveBeenCalledTimes(2);
        expect(lastController().getCount()).toBe(5);
    });
});
