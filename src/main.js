import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createSceneController } from './core/scene_controller.js';
import { createCameraController } from './core/objects/camera_object.js';
import { createKeyLight } from './core/objects/key_light_object.js';
import { setupGui } from './ui/gui.js';
import { BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD, BLOOM_TINT_COLOR } from './core/config.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x510000);

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

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom_pass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
);
bloom_pass.bloomTintColors.fill(new THREE.Vector3(BLOOM_TINT_COLOR.x, BLOOM_TINT_COLOR.y, BLOOM_TINT_COLOR.z));
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
