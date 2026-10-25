import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BLOOM_TINT_COLOR } from '../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../main-scene/default_settings.json';
import { createMetaballsController } from './metaballs_controller.js';
import {
    BACKGROUND_COLOR, CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_INITIAL_POSITION,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_AUTO_ROTATE_SPEED, MAX_PIXEL_RATIO,
} from './config.js';

const SCREENSHOT_TYPE = 'image/jpeg';
const SCREENSHOT_QUALITY = 0.9;

export function createMetaballsEngine({ resume_state = null, noise = false, setupGui }) {
    const lifetime = new AbortController();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = CAMERA_MIN_DISTANCE;
    controls.maxDistance = CAMERA_MAX_DISTANCE;
    controls.autoRotate = true;
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

    const controller = createMetaballsController(scene, { noise });
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
            return renderer.domElement.toDataURL(SCREENSHOT_TYPE, SCREENSHOT_QUALITY);
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
