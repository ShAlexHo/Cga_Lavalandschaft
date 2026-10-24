import * as THREE from 'three';
import { createSceneController } from './core/scene_controller.js';
import { createCameraController } from './core/objects/camera_object.js';
import { createKeyLight } from './core/objects/key_light_object.js';
import { createPostProcessing } from './core/rendering/post_processing.js';
import { setupGui } from './ui/gui.js';
import { SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS } from './core/config.js';
import DEFAULT_SETTINGS from './core/default_settings.json';

const SCREENSHOT_TYPE = 'image/jpeg';
const SCREENSHOT_QUALITY = 0.9;

// created once and reused across route changes, so settings and elapsed time persist
export function createSceneEngine() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DEFAULT_SETTINGS.skyColor);

    createKeyLight(scene);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera_controller = createCameraController(renderer);
    const camera = camera_controller.camera;

    const post_processing = createPostProcessing({ renderer, scene, camera });

    const clock = new THREE.Clock();

    const controller = createSceneController({
        scene, camera, renderer,
        bloom_pass: post_processing.bloom_pass,
        god_rays_pass: post_processing.god_rays_pass,
        setControlsEnabled: camera_controller.setControlsEnabled,
    });

    post_processing.setOccluders({
        sun_mesh: controller.getSunMesh(),
        occluder_meshes: [controller.getGroundMesh(), controller.getVolcanoMesh()],
    });

    // dat.GUI's auto-place wrapper moves with the canvas, so the panel only shows inside the scene
    const gui = setupGui(controller, { mode_controls_only: true });
    const gui_container = gui.domElement.parentElement;
    gui_container.remove();

    controller.fastForward(SCENE_WARM_UP_SECONDS, SCENE_WARM_UP_STEP_SECONDS);

    let container = null;
    let animation_frame_id = null;
    let elapsed_time = SCENE_WARM_UP_SECONDS;
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
        const delta = clock.getDelta();
        const time_scale = controller.getTimeScale();
        if (!controller.isPaused()) elapsed_time += delta * time_scale;
        camera_controller.update(controller.getVolcanoPosition(), delta, time_scale, !controller.getInteractionMode(), controller.isPaused());
        controller.update(elapsed_time, delta);
        post_processing.render();
    }

    return {
        // warms up all shaders, including post-processing, without advancing scene time
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

            // on a direct page load, browsers block audio until a user gesture
            controller.startAudio();
            window.addEventListener('pointerdown', controller.startAudio, { once: true });
            window.addEventListener('keydown', controller.startAudio, { once: true });

            clock.getDelta(); // skips the time spent away
            animate();
        },

        unmount() {
            cancelAnimationFrame(animation_frame_id);
            animation_frame_id = null;
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointerdown', controller.startAudio);
            window.removeEventListener('keydown', controller.startAudio);
            controller.stopAudio();
            container = null;
        },

        // without preserveDrawingBuffer, the canvas is only readable in the task that drew it
        captureScreenshot() {
            post_processing.render();
            return renderer.domElement.toDataURL(SCREENSHOT_TYPE, SCREENSHOT_QUALITY);
        },

        getElapsedTime: () => elapsed_time,
    };
}

let engine = null;

// a hot-swapped engine would restart its clock on stale simulation state (metaballs fly up), so reload
if (import.meta.hot) {
    import.meta.hot.accept(() => window.location.reload());
}

export function getSceneEngine() {
    engine ??= createSceneEngine();
    return engine;
}
