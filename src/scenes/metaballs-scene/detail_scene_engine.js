import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BLOOM_TINT_COLOR } from '../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../main-scene/default_settings.json';
import { createMetaballsController } from './metaballs_controller.js';
import {
    BACKGROUND_COLOR, CAMERA_SETUP, CAMERA_NEAR, CAMERA_FAR,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_AUTO_ROTATE_SPEED, MAX_PIXEL_RATIO,
} from './config.js';
import { captureCanvas } from '../../scene_screenshot.js';

export function createDetailSceneEngine({
    resume_state = null, createController = createMetaballsController, controller_options = {}, camera_setup = CAMERA_SETUP, setupGui,
}) {
    const lifetime = new AbortController();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    const camera = new THREE.PerspectiveCamera(camera_setup.fov, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(camera_setup.position.x, camera_setup.position.y, camera_setup.position.z);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = Boolean(camera_setup.zoom_distance);
    controls.minDistance = camera_setup.zoom_distance?.min ?? CAMERA_MIN_DISTANCE;
    controls.maxDistance = camera_setup.zoom_distance?.max ?? CAMERA_MAX_DISTANCE;
    controls.minPolarAngle = camera_setup.polar_angle?.min ?? 0;
    controls.maxPolarAngle = camera_setup.polar_angle?.max ?? Math.PI;
    controls.autoRotate = camera_setup.auto_rotate;
    controls.autoRotateSpeed = CAMERA_AUTO_ROTATE_SPEED;
    renderer.domElement.style.touchAction = 'pan-y';

    const bloom_pass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        MAIN_SCENE_DEFAULTS.bloomStrength,
        MAIN_SCENE_DEFAULTS.bloomRadius,
        MAIN_SCENE_DEFAULTS.bloomThreshold,
    );
    bloom_pass.bloomTintColors.fill(new THREE.Vector3(BLOOM_TINT_COLOR.x, BLOOM_TINT_COLOR.y, BLOOM_TINT_COLOR.z));
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloom_pass);

    const controller = createController(scene, { ...controller_options, bloom_pass, renderer });
    if (resume_state) {
        controller.applySnapshot(resume_state.snapshot);
        controller.setElapsedTime(resume_state.elapsed_time);
        camera.position.copy(resume_state.camera_position);
    }
    const { container: gui_container } = setupGui(controller, { signal: lifetime.signal });

    const clock = new THREE.Clock();

    let container = null;
    let animation_frame_id = null;
    let is_prepared = false;

    function renderFrame(delta_seconds) {
        controls.update(delta_seconds);
        camera.updateMatrixWorld();
        controller.update(delta_seconds, camera);
        composer.render();
    }

    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    }

    function animate() {
        animation_frame_id = requestAnimationFrame(animate);
        renderFrame(clock.getDelta());
    }

    function unmount() {
        cancelAnimationFrame(animation_frame_id);
        animation_frame_id = null;
        window.removeEventListener('resize', resize);
        container = null;
    }

    return {
        prepare() {
            if (is_prepared) return;
            is_prepared = true;
            renderer.compile(scene, camera);
            renderFrame(0);
        },

        mount(target_element) {
            is_prepared = true;
            container = target_element;
            container.append(renderer.domElement, gui_container);
            resize();
            window.addEventListener('resize', resize);
            clock.getDelta();
            animate();
        },

        unmount,

        captureScreenshot() {
            renderFrame(0);
            return captureCanvas(renderer.domElement);
        },

        getElapsedTime: () => controller.getElapsedTime(),

        getResumeState: () => ({
            elapsed_time: controller.getElapsedTime(),
            snapshot: controller.getSnapshot(),
            camera_position: camera.position.clone(),
        }),

        dispose() {
            if (container) unmount();
            lifetime.abort();
            controls.dispose();
            composer.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        },
    };
}
