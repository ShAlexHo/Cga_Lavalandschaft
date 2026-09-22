import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
    CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_INITIAL_POSITION,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE,
    CAMERA_AUTOPILOT_IDLE_SECONDS,
} from '../config.js';
import { stepCameraAutopilot } from '../animation/camera_animation.js';
import { clamp, cartesianToSpherical, sphericalToCartesian } from '../animation/math_utils.js';

export function createCameraController(renderer) {
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = CAMERA_MIN_DISTANCE;
    controls.maxDistance = CAMERA_MAX_DISTANCE;
    controls.minPolarAngle = CAMERA_MIN_POLAR_ANGLE;
    controls.maxPolarAngle = CAMERA_MAX_POLAR_ANGLE;

    let seconds_since_interaction = Infinity;
    controls.addEventListener('start', () => { seconds_since_interaction = 0; });
    controls.addEventListener('end', () => { seconds_since_interaction = 0; });

    return {
        camera,
        update(target_position, delta_seconds, time_scale, autonomous_mode, is_paused) {
            controls.target.copy(target_position);

            if (!is_paused) {
                seconds_since_interaction += delta_seconds;
                const { azimuth_speed, polar_speed, zoom_speed } = stepCameraAutopilot(delta_seconds);

                if (autonomous_mode && seconds_since_interaction >= CAMERA_AUTOPILOT_IDLE_SECONDS) {
                    const scaled_delta = delta_seconds * time_scale;
                    const offset = cartesianToSpherical({
                        x: camera.position.x - target_position.x,
                        y: camera.position.y - target_position.y,
                        z: camera.position.z - target_position.z,
                    });
                    offset.theta += azimuth_speed * scaled_delta;
                    offset.phi = clamp(offset.phi + polar_speed * scaled_delta, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE);
                    offset.radius = clamp(offset.radius + zoom_speed * scaled_delta, CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE);
                    const new_offset = sphericalToCartesian(offset);
                    camera.position.set(target_position.x + new_offset.x, target_position.y + new_offset.y, target_position.z + new_offset.z);
                }
            }

            controls.update();
        },
        resize(width, height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        },
        setControlsEnabled: value => { controls.enabled = value; },
    };
}
