import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { create_metaballs, rebuild_field, update_metaballs, update_light, settings } from './metaballs.js';
import { setup_gui } from './gui.js';
import { create_volcano } from './volcano.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0505);

const ambientLight = new THREE.AmbientLight(0x550000, 0.9);
const keyLight = new THREE.DirectionalLight(0xff7733, 1.3);
keyLight.position.set(5, 8, 5);
scene.add(ambientLight, keyLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const { effect, material } = create_metaballs(scene);
effect.position.y = 0.36;

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        color: 0x220500,
        emissive: 0x2b0800,
        roughness: 0.88,
        metalness: 0.05,
    })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -6;
scene.add(ground);

const volcano = create_volcano(scene);
volcano.position.y = ground.position.y;

setup_gui(effect, material, settings, rebuild_field, ground, volcano);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let elapsed_time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (!settings.paused) elapsed_time += delta;
    controls.update();
    update_metaballs(effect, elapsed_time);
    update_light(material, camera, elapsed_time);
    renderer.render(scene, camera);
};

animate();
