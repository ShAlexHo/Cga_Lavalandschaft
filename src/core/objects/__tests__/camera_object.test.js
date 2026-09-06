import { describe, test, expect, vi, beforeEach } from 'vitest';

// vi.mock() factories hoist above this, so this array needs vi.hoisted() to be visible down here
const { controls_instances } = vi.hoisted(() => ({ controls_instances: [] }));

vi.mock('three', () => {
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; this.y = y; this.z = z;
        }
        set(x, y, z) {
            this.x = x; this.y = y; this.z = z;
            return this;
        }
        copy(other) {
            this.x = other.x; this.y = other.y; this.z = other.z;
            return this;
        }
    }
    class PerspectiveCamera {
        constructor(fov, aspect, near, far) {
            this.fov = fov; this.aspect = aspect; this.near = near; this.far = far;
            this.position = new Vector3();
            this.updateProjectionMatrix = vi.fn();
        }
    }
    return { Vector3, PerspectiveCamera };
});

vi.mock('three/addons/controls/OrbitControls.js', () => {
    class OrbitControls {
        constructor(camera, dom_element) {
            this.camera = camera;
            this.dom_element = dom_element;
            this.target = { x: 0, y: 0, z: 0, copy(other) { this.x = other.x; this.y = other.y; this.z = other.z; return this; } };
            this.update = vi.fn();
            controls_instances.push(this);
        }
    }
    return { OrbitControls };
});

import { createCameraController } from '../camera_object.js';
import {
    CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_INITIAL_POSITION,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE,
} from '../../config.js';

function makeRenderer() { return { domElement: {} }; }

beforeEach(() => {
    vi.clearAllMocks();
    controls_instances.length = 0;
});

describe('createCameraController', () => {
    test('creates a perspective camera with the configured FOV/near/far and initial position', () => {
        const camera_controller = createCameraController(makeRenderer());
        expect(camera_controller.camera.fov).toBe(CAMERA_FOV);
        expect(camera_controller.camera.near).toBe(CAMERA_NEAR);
        expect(camera_controller.camera.far).toBe(CAMERA_FAR);
        expect(camera_controller.camera.position).toEqual({
            x: CAMERA_INITIAL_POSITION.x, y: CAMERA_INITIAL_POSITION.y, z: CAMERA_INITIAL_POSITION.z,
        });
    });

    test('wires OrbitControls to the camera and the renderer\'s DOM element', () => {
        const renderer = makeRenderer();
        const camera_controller = createCameraController(renderer);
        const controls = controls_instances[0];
        expect(controls.camera).toBe(camera_controller.camera);
        expect(controls.dom_element).toBe(renderer.domElement);
    });

    test('configures OrbitControls with damping and the configured distance/polar-angle limits', () => {
        createCameraController(makeRenderer());
        const controls = controls_instances[0];
        expect(controls.enableDamping).toBe(true);
        expect(controls.minDistance).toBe(CAMERA_MIN_DISTANCE);
        expect(controls.maxDistance).toBe(CAMERA_MAX_DISTANCE);
        expect(controls.minPolarAngle).toBe(CAMERA_MIN_POLAR_ANGLE);
        expect(controls.maxPolarAngle).toBe(CAMERA_MAX_POLAR_ANGLE);
    });

    test('update() copies the target position into the controls and calls update()', () => {
        const camera_controller = createCameraController(makeRenderer());
        const controls = controls_instances[0];
        camera_controller.update({ x: 1, y: 2, z: 3 });
        expect(controls.target).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(controls.update).toHaveBeenCalledTimes(1);
    });

    test('setControlsEnabled(false) disables OrbitControls, setControlsEnabled(true) re-enables it', () => {
        const camera_controller = createCameraController(makeRenderer());
        camera_controller.setControlsEnabled(false);
        expect(controls_instances[0].enabled).toBe(false);
        camera_controller.setControlsEnabled(true);
        expect(controls_instances[0].enabled).toBe(true);
    });

    test('resize() updates the camera aspect and recomputes the projection matrix', () => {
        const camera_controller = createCameraController(makeRenderer());
        camera_controller.resize(1600, 800);
        expect(camera_controller.camera.aspect).toBe(2);
        expect(camera_controller.camera.updateProjectionMatrix).toHaveBeenCalledTimes(1);
    });
});
