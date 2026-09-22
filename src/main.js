import * as THREE from 'three';
import { createSceneController } from './core/scene_controller.js';
import { createCameraController } from './core/objects/camera_object.js';
import { createKeyLight } from './core/objects/key_light_object.js';
import { createPostProcessing } from './core/rendering/post_processing.js';
import { setupGui } from './ui/gui.js';
import DEFAULT_SETTINGS from './core/default_settings.json';

const scene = new THREE.Scene();
scene.background = new THREE.Color(DEFAULT_SETTINGS.skyColor);

createKeyLight(scene);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

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

setupGui(controller);

// unlocks Web Audio, which browsers block until a user gesture
window.addEventListener('pointerdown', controller.startAudio, { once: true });
window.addEventListener('keydown', controller.startAudio, { once: true });

window.addEventListener('resize', () => {
    camera_controller.resize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    post_processing.resize(window.innerWidth, window.innerHeight);
});

let elapsed_time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time_scale = controller.getTimeScale();
    if (!controller.isPaused()) elapsed_time += delta * time_scale;
    camera_controller.update(controller.getVolcanoPosition(), delta, time_scale, !controller.getInteractionMode(), controller.isPaused());
    controller.update(elapsed_time, delta);
    post_processing.render();
};

animate();
