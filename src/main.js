import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createSceneController } from './core/scene_controller.js';
import { setupGui } from './ui/gui.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0505);

const ambient_light = new THREE.AmbientLight(0x550000, 0.9);
const key_light = new THREE.DirectionalLight(0xff7733, 1.3);
key_light.position.set(5, 8, 5);
scene.add(ambient_light, key_light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const strength = 0.8;
const radius = 0.5;
const threshold = 0.3;
const bloom_pass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    strength,
    radius,
    threshold
);
const orange = new THREE.Vector3(1.0, 0.45, 0.05);
bloom_pass.bloomTintColors.fill(orange);
composer.addPass(bloom_pass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const controller = createSceneController({ scene, camera, bloomPass: bloom_pass });

setupGui(controller);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

let elapsed_time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (!controller.isPaused()) elapsed_time += delta;
    controls.update();
    controller.update(elapsed_time);
    composer.render();
};

animate();
