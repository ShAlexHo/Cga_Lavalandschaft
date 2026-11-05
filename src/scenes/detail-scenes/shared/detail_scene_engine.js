import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPostProcessing } from '../../main-scene/rendering/post_processing.js';
import {
    DETAIL_BACKGROUND_COLOR, DETAIL_CAMERA_SETUP, DETAIL_CAMERA_NEAR, DETAIL_CAMERA_FAR,
    DETAIL_CAMERA_MIN_DISTANCE, DETAIL_CAMERA_MAX_DISTANCE, DETAIL_CAMERA_AUTO_ROTATE_SPEED, MAX_PIXEL_RATIO,
} from './config.js';
import { captureCanvas } from '../../canvas_capture.js';

const VISIBILITY_ROOT_MARGIN = '-1px';
const MAX_FRAME_DELTA_SECONDS = 0.1;

export function createSceneGroupState() {
    return { scene_states: new Map() };
}

export function createDetailSceneEngine({
    scenes, createController, controller_options = {}, with_god_rays = false, group_state = createSceneGroupState(),
}) {
    const lifetime = new AbortController();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DETAIL_BACKGROUND_COLOR);

    const camera = new THREE.PerspectiveCamera(DETAIL_CAMERA_SETUP.fov, window.innerWidth / window.innerHeight, DETAIL_CAMERA_NEAR, DETAIL_CAMERA_FAR);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotateSpeed = DETAIL_CAMERA_AUTO_ROTATE_SPEED;
    renderer.domElement.style.touchAction = 'pan-y';

    const post_processing = createPostProcessing({ renderer, scene, camera, with_god_rays });
    const { bloom_pass, god_rays_pass } = post_processing;

    const [{ mode: first_mode = {} }] = Object.values(scenes);
    const controller = createController(scene, { ...controller_options, mode: first_mode, bloom_pass, god_rays_pass, renderer });
    const initial_elapsed_time = controller.getElapsedTime();

    const clock = new THREE.Clock();

    let container = null;
    let animation_frame_id = null;
    let visibility_observer = null;
    const prepared_scene_names = new Set();
    let active_scene_name = null;
    let gui_lifetime = null;
    let gui_container = null;

    function applyCameraSetup(camera_setup) {
        camera.fov = camera_setup.fov;
        camera.far = camera_setup.far ?? DETAIL_CAMERA_FAR;
        camera.updateProjectionMatrix();
        controls.enableZoom = Boolean(camera_setup.zoom_distance);
        controls.minDistance = camera_setup.zoom_distance?.min ?? DETAIL_CAMERA_MIN_DISTANCE;
        controls.maxDistance = camera_setup.zoom_distance?.max ?? DETAIL_CAMERA_MAX_DISTANCE;
        controls.minPolarAngle = camera_setup.polar_angle?.min ?? 0;
        controls.maxPolarAngle = camera_setup.polar_angle?.max ?? Math.PI;
        controls.autoRotate = camera_setup.auto_rotate;
        camera.position.set(camera_setup.position.x, camera_setup.position.y, camera_setup.position.z);
    }

    function saveActiveScene() {
        if (!active_scene_name) return;
        group_state.scene_states.set(active_scene_name, {
            snapshot: controller.getSnapshot(),
            camera_position: camera.position.clone(),
            elapsed_time: controller.getElapsedTime(),
        });
    }

    function activate(scene_name) {
        if (active_scene_name === scene_name) return;
        saveActiveScene();
        gui_lifetime?.abort();
        active_scene_name = scene_name;

        const { mode = {}, camera_setup = DETAIL_CAMERA_SETUP, setupGui } = scenes[scene_name];
        controller.applyMode(mode);
        controller.resetToDefaults();
        applyCameraSetup(camera_setup);
        const saved_state = group_state.scene_states.get(scene_name);
        if (saved_state) {
            controller.applySnapshot(saved_state.snapshot);
            camera.position.copy(saved_state.camera_position);
        }
        controller.setElapsedTime(saved_state?.elapsed_time ?? initial_elapsed_time);

        gui_lifetime = new AbortController();
        gui_container = setupGui(controller, { signal: gui_lifetime.signal }).container;
        container?.append(gui_container);
    }

    function renderFrame(delta_seconds) {
        controls.update(delta_seconds);
        camera.updateMatrixWorld();
        controller.update(delta_seconds, camera);
        post_processing.render();
    }

    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        post_processing.resize(width, height);
    }

    function animate() {
        animation_frame_id = requestAnimationFrame(animate);
        renderFrame(Math.min(clock.getDelta(), MAX_FRAME_DELTA_SECONDS));
    }

    function startAnimation() {
        if (animation_frame_id !== null) return;
        clock.getDelta();
        animate();
    }

    function stopAnimation() {
        cancelAnimationFrame(animation_frame_id);
        animation_frame_id = null;
    }

    function unmount() {
        stopAnimation();
        visibility_observer.disconnect();
        visibility_observer = null;
        window.removeEventListener('resize', resize);
        container = null;
    }

    function prepare() {
        if (prepared_scene_names.has(active_scene_name)) return;
        prepared_scene_names.add(active_scene_name);
        renderer.compile(scene, camera);
        renderFrame(0);
    }

    function mount(target_element) {
        prepared_scene_names.add(active_scene_name);
        container = target_element;
        container.append(renderer.domElement, gui_container);
        resize();
        window.addEventListener('resize', resize);
        visibility_observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? startAnimation() : stopAnimation()), { rootMargin: VISIBILITY_ROOT_MARGIN });
        visibility_observer.observe(container);
        startAnimation();
    }

    function dispose() {
        if (container) unmount();
        saveActiveScene();
        gui_lifetime?.abort();
        lifetime.abort();
        controls.dispose();
        post_processing.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
    }

    return {
        viewFor(scene_name) {
            return {
                prepare() {
                    activate(scene_name);
                    prepare();
                },
                mount(target_element) {
                    activate(scene_name);
                    mount(target_element);
                },
                unmount,
                captureScreenshot() {
                    activate(scene_name);
                    renderFrame(0);
                    return captureCanvas(renderer.domElement);
                },
                getElapsedTime: () => controller.getElapsedTime(),
            };
        },

        dispose,
    };
}
