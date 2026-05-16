import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { create_metaballs, rebuild_field, update_light, METABALLS } from './metaballs.js';
import { setup_gui } from './gui.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0505);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const { effect, material } = create_metaballs(scene);
setup_gui(effect, material, METABALLS, rebuild_field);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    update_light(material, camera);
    renderer.render(scene, camera);
};

animate();
