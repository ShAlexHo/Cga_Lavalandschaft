import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createSceneController } from './core/scene_controller.js';
import { createCameraController } from './core/objects/camera_object.js';
import { setupGui } from './ui/gui.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x510000);

const ambient_light = new THREE.AmbientLight(0x550000, 0.9);
const key_light = new THREE.DirectionalLight(0xff7733, 1.3);
key_light.position.set(5, 8, 5);
scene.add(ambient_light, key_light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);

const camera_controller = createCameraController(renderer);
const camera = camera_controller.camera;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const BLOOM_STRENGTH = 0.8;
const BLOOM_RADIUS = 0.5;
const BLOOM_THRESHOLD = 0.3;
const bloom_pass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
);
const BLOOM_TINT_COLOR = new THREE.Vector3(1.0, 0.45, 0.05);
bloom_pass.bloomTintColors.fill(BLOOM_TINT_COLOR);
composer.addPass(bloom_pass);

const clock = new THREE.Clock();

const controller = createSceneController({ scene, camera, bloom_pass });

setupGui(controller);

window.addEventListener('resize', () => {
    camera_controller.handleResize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

let elapsed_time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (!controller.isPaused()) elapsed_time += delta;
    camera_controller.update(controller.getVolcanoPosition());
    controller.update(elapsed_time);
    composer.render();
};

animate();
