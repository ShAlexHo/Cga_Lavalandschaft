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

vi.mock('../../main-scene/rendering/god_rays_pass.js', () => ({
    createGodRaysPass: vi.fn(() => ({ dispose: vi.fn() })),
}));

vi.mock('../metaballs_controller.js', () => ({
    createMetaballsController: vi.fn(() => {
        let elapsed_time = 0;
        return {
            update: vi.fn(delta_seconds => { elapsed_time += delta_seconds; }),
            getElapsedTime: () => elapsed_time,
            setElapsedTime: vi.fn(value => { elapsed_time = value; }),
            getSnapshot: vi.fn(() => ({ count: 7, isolation: 50 })),
            applySnapshot: vi.fn(),
        };
    }),
}));

vi.mock('../metaballs_gui.js', () => ({
    setupMetaballsGui: vi.fn(() => {
        const container = document.createElement('div');
        container.className = 'dg ac';
        return { gui: {}, container };
    }),
}));

import { createSceneEngine, getSceneEngine, closeSceneEngine } from '../scene_engine.js';
import { createDetailSceneEngine } from '../detail_scene_engine.js';
import { CAMERA_FOV, CAMERA_INITIAL_POSITION, CAMERA_FAR } from '../config.js';
import { createGodRaysPass } from '../../main-scene/rendering/god_rays_pass.js';
import { closeOtherScenes } from '../../scene_registry.js';
import { createMetaballsController } from '../metaballs_controller.js';
import { setupMetaballsGui } from '../metaballs_gui.js';

let pending_frame = null;

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
    return createMetaballsController.mock.results.at(-1).value;
}

beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    clock_state.deltas = [];
    pending_frame = null;
    vi.stubGlobal('requestAnimationFrame', vi.fn(callback => { pending_frame = callback; return 1; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn(() => { pending_frame = null; }));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('metaballs createSceneEngine', () => {
    test('builds the metaballs on its scene and hands every parameter to the GUI', () => {
        createSceneEngine();
        expect(setupMetaballsGui).toHaveBeenCalledWith(lastController(), { signal: expect.any(AbortSignal) });
    });

    test('starts the turning camera at the demo position, unless a scene brings its own camera setup', () => {
        createSceneEngine();
        expect(renderer_state.camera.fov).toBe(CAMERA_FOV);
        expect(renderer_state.camera.position.set).toHaveBeenCalledWith(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

        expect(renderer_state.controls.autoRotate).toBe(true);
        expect(renderer_state.controls.enableZoom).toBe(false);

        createDetailSceneEngine({
            camera_setup: { fov: 60, position: { x: 1, y: 2, z: 3 }, auto_rotate: false, zoom_distance: { min: 16, max: 36 } },
            setupGui: setupMetaballsGui,
        });
        expect(renderer_state.camera.fov).toBe(60);
        expect(renderer_state.camera.position.set).toHaveBeenLastCalledWith(1, 2, 3);
        expect(renderer_state.controls.autoRotate).toBe(false);
        expect(renderer_state.controls).toMatchObject({ enableZoom: true, minDistance: 16, maxDistance: 36, minPolarAngle: 0, maxPolarAngle: Math.PI });

        createDetailSceneEngine({ camera_setup: { fov: 60, position: { x: 1, y: 2, z: 3 }, polar_angle: { min: 1, max: 1.4 } }, setupGui: setupMetaballsGui });
        expect(renderer_state.controls).toMatchObject({ minPolarAngle: 1, maxPolarAngle: 1.4 });
    });

    test('a scene can bring its own controller, which gets the renderer for its own render passes', () => {
        const controller = { update: vi.fn(), getElapsedTime: () => 0, setElapsedTime: vi.fn(), getSnapshot: () => ({}), applySnapshot: vi.fn() };
        const createController = vi.fn(() => controller);
        createDetailSceneEngine({ createController, setupGui: setupMetaballsGui });

        expect(createController).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ renderer: renderer_state.last }));
        expect(createMetaballsController).not.toHaveBeenCalled();
        expect(setupMetaballsGui).toHaveBeenLastCalledWith(controller, { signal: expect.any(AbortSignal) });
    });

    test('sees as far as a scene’s camera setup asks for', () => {
        createSceneEngine();
        expect(renderer_state.camera.far).toBe(CAMERA_FAR);
        createDetailSceneEngine({ camera_setup: { fov: 60, position: { x: 1, y: 2, z: 3 }, far: 2000 }, setupGui: setupMetaballsGui });
        expect(renderer_state.camera.far).toBe(2000);
    });

    test('only a scene with god rays gets the god rays pass, between the rendered image and the bloom, and hands it to its controller', () => {
        createSceneEngine();
        expect(createGodRaysPass).not.toHaveBeenCalled();
        expect(createMetaballsController).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ god_rays_pass: null }));

        const engine = createDetailSceneEngine({ with_god_rays: true, setupGui: setupMetaballsGui });
        const god_rays_pass = createGodRaysPass.mock.results.at(-1).value;
        expect(createGodRaysPass).toHaveBeenCalledWith({ scene: expect.anything(), camera: renderer_state.camera });
        const passes = renderer_state.composer.addPass.mock.calls.map(([pass]) => pass);
        expect(passes).toHaveLength(3);
        expect(passes[1]).toBe(god_rays_pass);
        expect(createMetaballsController).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ god_rays_pass }));

        engine.dispose();
        expect(god_rays_pass.dispose).toHaveBeenCalled();
    });

    test('hands the scene’s controller options, together with the renderer, to the metaballs controller', () => {
        const createScenery = () => ({});
        createDetailSceneEngine({ controller_options: { noise: true, createScenery }, setupGui: setupMetaballsGui });
        expect(createMetaballsController).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ noise: true, createScenery, renderer: renderer_state.last }));
    });

    test('mount() moves canvas and GUI into the container, sizes them and renders a frame', () => {
        const engine = createSceneEngine();
        const container = makeContainer(1024, 512);
        engine.mount(container);

        expect(container.querySelector('canvas')).not.toBeNull();
        expect(container.querySelector('.dg.ac')).not.toBeNull();
        expect(renderer_state.last.setSize).toHaveBeenLastCalledWith(1024, 512);
        expect(renderer_state.composer.setSize).toHaveBeenLastCalledWith(1024, 512);
        expect(renderer_state.composer.render).toHaveBeenCalled();
    });

    test('feeds each frame’s delta to the metaballs', () => {
        const engine = createSceneEngine();
        clock_state.deltas = [0, 0.5, 0.25];
        engine.mount(makeContainer());
        runFrame();

        expect(engine.getElapsedTime()).toBeCloseTo(0.75);
    });

    test('re-mounting resumes where it was left, ignoring the time spent away', () => {
        const engine = createSceneEngine();
        clock_state.deltas = [0, 1, 1];
        engine.mount(makeContainer());
        runFrame();
        engine.unmount();

        clock_state.deltas = [300, 0.5];
        engine.mount(makeContainer());
        expect(engine.getElapsedTime()).toBe(2.5);
    });

    test('unmount() stops the render loop and window resize handling', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        engine.unmount();
        renderer_state.last.setSize.mockClear();

        expect(pending_frame).toBeNull();
        window.dispatchEvent(new Event('resize'));
        expect(renderer_state.last.setSize).not.toHaveBeenCalled();
    });

    test('prepare() compiles and renders once off-screen without advancing time, and only once', () => {
        const engine = createSceneEngine();
        engine.prepare();
        engine.prepare();

        expect(renderer_state.last.compile).toHaveBeenCalledTimes(1);
        expect(renderer_state.composer.render).toHaveBeenCalledTimes(1);
        expect(lastController().update).toHaveBeenCalledWith(0, expect.anything());
        expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    test('captureScreenshot() renders a fresh frame and returns a JPEG data URL', () => {
        const engine = createSceneEngine();
        engine.mount(makeContainer());
        renderer_state.composer.render.mockClear();

        expect(engine.captureScreenshot()).toMatch(/^data:image\/jpeg/);
        expect(renderer_state.composer.render).toHaveBeenCalledTimes(1);
    });
});

describe('metaballs createSceneEngine – closing and resuming', () => {
    test('getResumeState() captures scene time, settings and camera position', () => {
        const engine = createSceneEngine();
        expect(engine.getResumeState()).toEqual({ elapsed_time: 0, snapshot: { count: 7, isolation: 50 }, camera_position: { x: 1, y: 2, z: 3 } });
    });

    test('a resumed engine reapplies the settings, scene time and camera position', () => {
        const resume_state = { elapsed_time: 42, snapshot: { count: 3 }, camera_position: { x: 9, y: 8, z: 7 } };
        const engine = createSceneEngine(resume_state);

        expect(lastController().applySnapshot).toHaveBeenCalledWith({ count: 3 });
        expect(engine.getElapsedTime()).toBe(42);
    });

    test('dispose() stops the loop, removes the GUI and frees the WebGL context', () => {
        const engine = createSceneEngine();
        const container = makeContainer();
        engine.mount(container);
        const gui_signal = setupMetaballsGui.mock.calls.at(-1)[1].signal;

        engine.dispose();

        expect(pending_frame).toBeNull();
        expect(gui_signal.aborted).toBe(true);
        expect(renderer_state.composer.dispose).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.dispose).toHaveBeenCalledTimes(1);
        expect(renderer_state.last.forceContextLoss).toHaveBeenCalledTimes(1);
        expect(container.querySelector('canvas')).toBeNull();
    });
});

describe('metaballs getSceneEngine', () => {
    test('creates the engine once and reuses it', () => {
        expect(getSceneEngine()).toBe(getSceneEngine());
    });

    test('closeSceneEngine() frees the engine, and the next one resumes where it was left', () => {
        getSceneEngine();
        const closed_renderer = renderer_state.last;
        closeSceneEngine();
        expect(closed_renderer.forceContextLoss).toHaveBeenCalled();

        getSceneEngine();
        expect(lastController().applySnapshot).toHaveBeenCalledWith({ count: 7, isolation: 50 });
    });

    test('opening the main scene closes this one through the scene registry', () => {
        getSceneEngine();
        const renderer = renderer_state.last;

        closeOtherScenes('main-scene');
        expect(renderer.forceContextLoss).toHaveBeenCalled();
    });
});
