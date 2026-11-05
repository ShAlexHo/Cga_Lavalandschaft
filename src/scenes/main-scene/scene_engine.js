import * as THREE from 'three';
import { buildSceneController } from './scene_controller.js';
import { createCameraController } from './objects/camera_object.js';
import { createPostProcessing } from './rendering/post_processing.js';
import { setupGui } from './ui/gui.js';
import { registerOpenScene } from '../scene_registry.js';
import { SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS } from './config.js';
import DEFAULT_SETTINGS from './default_settings.json';
import { captureCanvas } from '../canvas_capture.js';
import { MAIN_SCENE_NAME } from './scene_name.js';
import { finishBuild } from '../stepwise_build.js';

const WARM_UP_SLICES = 8;

export function createSceneEngine(resume_state = null) {
    return finishBuild(buildSceneEngine(resume_state));
}

function* buildSceneEngine(resume_state = null) {
    const lifetime = new AbortController();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DEFAULT_SETTINGS.skyColor);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    yield;

    const camera_controller = createCameraController(renderer);
    const camera = camera_controller.camera;

    const post_processing = createPostProcessing({ renderer, scene, camera });

    const clock = new THREE.Clock();

    const controller = yield* buildSceneController({
        scene, camera, renderer,
        bloom_pass: post_processing.bloom_pass,
        god_rays_pass: post_processing.god_rays_pass,
        setControlsEnabled: camera_controller.setControlsEnabled,
        signal: lifetime.signal,
    });

    post_processing.setOccluders({
        sun_mesh: controller.getSunMesh(),
        occluder_meshes: [controller.getGroundMesh(), controller.getVolcanoMesh()],
    });

    let elapsed_time;
    if (resume_state) {
        const current_snapshot = controller.getSnapshot();
        const changed_settings = Object.fromEntries(
            Object.entries(resume_state.snapshot).filter(([key, value]) => current_snapshot[key] !== value),
        );
        controller.applySnapshot(changed_settings);
        camera.position.copy(resume_state.camera_position);
        elapsed_time = resume_state.elapsed_time;
    } else {
        for (let slice = 1; slice <= WARM_UP_SLICES; slice++) {
            const slice_duration = SCENE_WARM_UP_SECONDS / WARM_UP_SLICES;
            controller.fastForward(slice * slice_duration, SCENE_WARM_UP_STEP_SECONDS, (slice - 1) * slice_duration);
            yield;
        }
        elapsed_time = SCENE_WARM_UP_SECONDS;
    }

    const gui = setupGui(controller, { mode_controls_only: true, restore_saved: !resume_state, signal: lifetime.signal });
    const gui_container = gui.domElement.parentElement;
    gui_container.remove();

    let container = null;
    let animation_frame_id = null;
    let is_prepared = false;

    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera_controller.resize(width, height);
        renderer.setSize(width, height);
        post_processing.resize(width, height);
    }

    function animate() {
        animation_frame_id = requestAnimationFrame(animate);
        const delta_seconds = clock.getDelta();
        const time_scale = controller.getTimeScale();
        if (!controller.isPaused()) elapsed_time += delta_seconds * time_scale;
        camera_controller.update(controller.getVolcanoPosition(), delta_seconds, time_scale, !controller.getInteractionMode(), controller.isPaused());
        controller.update(elapsed_time, delta_seconds);
        post_processing.render();
    }

    function unmount() {
        cancelAnimationFrame(animation_frame_id);
        animation_frame_id = null;
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointerdown', controller.startAudio);
        window.removeEventListener('keydown', controller.startAudio);
        controller.stopAudio();
        container = null;
    }

    return {
        prepare() {
            if (is_prepared) return;
            is_prepared = true;
            renderer.compile(scene, camera);
            post_processing.render();
        },

        mount(target_element) {
            is_prepared = true;
            container = target_element;
            container.append(renderer.domElement, gui_container);
            resize();
            window.addEventListener('resize', resize);

            controller.startAudio();
            window.addEventListener('pointerdown', controller.startAudio, { once: true });
            window.addEventListener('keydown', controller.startAudio, { once: true });

            clock.getDelta();
            animate();
        },

        unmount,

        captureScreenshot() {
            post_processing.render();
            return captureCanvas(renderer.domElement);
        },

        getElapsedTime: () => elapsed_time,

        getResumeState: () => ({
            elapsed_time,
            snapshot: controller.getSnapshot(),
            camera_position: camera.position.clone(),
        }),

        dispose() {
            if (container) unmount();
            lifetime.abort();
            controller.closeAudio();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        },
    };
}

let engine = null;
let pending_build = null;
let last_resume_state = null;

if (import.meta.hot) {
    import.meta.hot.accept(() => window.location.reload());
}

function openEngine(built_engine) {
    engine = built_engine;
    pending_build = null;
    registerOpenScene(MAIN_SCENE_NAME, closeSceneEngine);
}

export function getSceneEngine() {
    if (!engine) openEngine(finishBuild(pending_build ?? buildSceneEngine(last_resume_state)));
    return engine;
}

export async function prepareSceneEngineGradually(waitForTurn) {
    if (!engine) {
        pending_build ??= buildSceneEngine(last_resume_state);
        const build = pending_build;
        let step = build.next();
        while (!step.done) {
            await waitForTurn();
            if (engine) return;
            step = build.next();
        }
        openEngine(step.value);
    }
    await waitForTurn();
    engine.prepare();
}

export function closeSceneEngine() {
    if (!engine) return;
    last_resume_state = engine.getResumeState();
    engine.dispose();
    engine = null;
}
