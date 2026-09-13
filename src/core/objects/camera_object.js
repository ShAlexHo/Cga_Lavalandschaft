import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
    CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_INITIAL_POSITION,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE,
} from '../config.js';

export function createCameraController(renderer) {
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = CAMERA_MIN_DISTANCE;
    controls.maxDistance = CAMERA_MAX_DISTANCE;
    controls.minPolarAngle = CAMERA_MIN_POLAR_ANGLE;
    controls.maxPolarAngle = CAMERA_MAX_POLAR_ANGLE;

    return {
        camera,
        update(target_position) {
            controls.target.copy(target_position);
            controls.update();
        },
        resize(width, height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        },
        setControlsEnabled: value => { controls.enabled = value; },
    };
}
