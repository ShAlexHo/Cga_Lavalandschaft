import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MockVector3 } from '../../test-utils/three_mocks.js';

// vi.mock() factories hoist above this, so this array needs vi.hoisted() to be visible down here
const { controls_instances } = vi.hoisted(() => ({ controls_instances: [] }));

vi.mock('three', () => {
    class PerspectiveCamera {
        constructor(fov, aspect, near, far) {
            this.fov = fov; this.aspect = aspect; this.near = near; this.far = far;
            this.position = new MockVector3();
            this.updateProjectionMatrix = vi.fn();
        }
    }
    return { Vector3: MockVector3, PerspectiveCamera };
});

vi.mock('three/addons/controls/OrbitControls.js', () => {
    class OrbitControls {
        constructor(camera, dom_element) {
            this.camera = camera;
            this.dom_element = dom_element;
            this.target = { x: 0, y: 0, z: 0, copy(other) { this.x = other.x; this.y = other.y; this.z = other.z; return this; } };
            this.update = vi.fn();
            this._listeners = {};
            this.addEventListener = (type, callback) => { (this._listeners[type] ||= []).push(callback); };
            this._dispatch = type => { (this._listeners[type] || []).forEach(callback => callback()); };
            controls_instances.push(this);
        }
    }
    return { OrbitControls };
});

vi.mock('../../animation/camera_animation.js', () => ({
    stepCameraAutopilot: vi.fn(() => ({ azimuth_speed: 0, polar_speed: 0, zoom_speed: 0 })),
}));

import { createCameraController } from '../camera_object.js';
import { stepCameraAutopilot } from '../../animation/camera_animation.js';
import { clamp, cartesianToSpherical, sphericalToCartesian } from '../../animation/math_utils.js';
import {
    CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_INITIAL_POSITION,
    CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE,
    CAMERA_AUTOPILOT_IDLE_SECONDS,
} from '../../config.js';

const ORIGIN = { x: 0, y: 0, z: 0 };

function makeRenderer() { return { domElement: {} }; }

function positionOf(camera_controller) {
    const { x, y, z } = camera_controller.camera.position;
    return { x, y, z };
}

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
        camera_controller.update({ x: 1, y: 2, z: 3 }, 0.016, 1, false);
        expect(controls.target).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(controls.update).toHaveBeenCalledTimes(1);
    });

    test('update() feeds the plain (unscaled) delta_seconds into stepCameraAutopilot, so retargeting keeps a steady real-time pace regardless of time_scale', () => {
        const camera_controller = createCameraController(makeRenderer());
        camera_controller.update(ORIGIN, 2, 3, false);
        expect(stepCameraAutopilot).toHaveBeenCalledWith(2);
    });

    test('drifts the camera position by azimuth_speed/polar_speed/zoom_speed, scaled by delta_seconds * time_scale, once autonomous and idle', () => {
        const camera_controller = createCameraController(makeRenderer());
        const initial_offset = cartesianToSpherical(positionOf(camera_controller));

        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 0.05, polar_speed: 0.01, zoom_speed: 0.2 });
        camera_controller.update(ORIGIN, 2, 3, true); // scaled delta = 6

        const expected_offset = sphericalToCartesian({
            radius: clamp(initial_offset.radius + 0.2 * 6, CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE),
            theta: initial_offset.theta + 0.05 * 6,
            phi: clamp(initial_offset.phi + 0.01 * 6, CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE),
        });
        expect(positionOf(camera_controller).x).toBeCloseTo(expected_offset.x, 9);
        expect(positionOf(camera_controller).y).toBeCloseTo(expected_offset.y, 9);
        expect(positionOf(camera_controller).z).toBeCloseTo(expected_offset.z, 9);
    });

    test('clamps the polar drift to CAMERA_MIN_POLAR_ANGLE/CAMERA_MAX_POLAR_ANGLE', () => {
        const camera_controller = createCameraController(makeRenderer());
        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 0, polar_speed: 100, zoom_speed: 0 });
        camera_controller.update(ORIGIN, 1, 1, true);
        const resulting_offset = cartesianToSpherical(positionOf(camera_controller));
        expect(resulting_offset.phi).toBeCloseTo(CAMERA_MAX_POLAR_ANGLE, 9);
    });

    test('clamps the zoom drift to CAMERA_MIN_DISTANCE/CAMERA_MAX_DISTANCE', () => {
        const camera_controller = createCameraController(makeRenderer());
        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 0, polar_speed: 0, zoom_speed: -100 });
        camera_controller.update(ORIGIN, 1, 1, true);
        const resulting_offset = cartesianToSpherical(positionOf(camera_controller));
        expect(resulting_offset.radius).toBeCloseTo(CAMERA_MIN_DISTANCE, 9);
    });

    test('leaves the camera position untouched when not in autonomous mode, no matter how idle', () => {
        const camera_controller = createCameraController(makeRenderer());
        const before = positionOf(camera_controller);
        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 1, polar_speed: 1, zoom_speed: 1 });
        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, false);
        expect(positionOf(camera_controller)).toEqual(before);
    });

    test('leaves the camera position untouched during the idle grace period after an interaction', () => {
        const camera_controller = createCameraController(makeRenderer());
        const controls = controls_instances[0];
        controls._dispatch('start');
        const before = positionOf(camera_controller);
        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 1, polar_speed: 1, zoom_speed: 1 });
        camera_controller.update(ORIGIN, 1, 1, true); // only 1s idle, well under CAMERA_AUTOPILOT_IDLE_SECONDS
        expect(positionOf(camera_controller)).toEqual(before);
    });

    test('a user drag ("start") pauses drift until idle for CAMERA_AUTOPILOT_IDLE_SECONDS again', () => {
        const camera_controller = createCameraController(makeRenderer());
        const controls = controls_instances[0];
        stepCameraAutopilot.mockReturnValue({ azimuth_speed: 1, polar_speed: 0, zoom_speed: 0 });

        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true);
        const drifted = positionOf(camera_controller);

        controls._dispatch('start');
        camera_controller.update(ORIGIN, 0.016, 1, true);
        expect(positionOf(camera_controller)).toEqual(drifted);

        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true);
        expect(positionOf(camera_controller)).not.toEqual(drifted);
    });

    test('a user drag ending ("end") also resets the idle timer', () => {
        const camera_controller = createCameraController(makeRenderer());
        const controls = controls_instances[0];
        stepCameraAutopilot.mockReturnValue({ azimuth_speed: 1, polar_speed: 0, zoom_speed: 0 });
        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true);
        const drifted = positionOf(camera_controller);

        controls._dispatch('end');
        camera_controller.update(ORIGIN, 0.016, 1, true);
        expect(positionOf(camera_controller)).toEqual(drifted);
    });

    test('is_paused=true freezes the autonomous drift, even when idle and autonomous', () => {
        const camera_controller = createCameraController(makeRenderer());
        const before = positionOf(camera_controller);
        stepCameraAutopilot.mockReturnValueOnce({ azimuth_speed: 1, polar_speed: 1, zoom_speed: 1 });
        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true, true);
        expect(positionOf(camera_controller)).toEqual(before);
        expect(stepCameraAutopilot).not.toHaveBeenCalled();
    });

    test('is_paused=true also freezes the idle timer, so a paused period does not count toward becoming idle', () => {
        const camera_controller = createCameraController(makeRenderer());
        const controls = controls_instances[0];
        stepCameraAutopilot.mockReturnValue({ azimuth_speed: 1, polar_speed: 0, zoom_speed: 0 });

        controls._dispatch('start'); // resets the idle timer to 0
        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true, true); // paused: must not advance the idle timer
        const before = positionOf(camera_controller);

        camera_controller.update(ORIGIN, 0.016, 1, true, false); // resumed, but still not idle long enough
        expect(positionOf(camera_controller)).toEqual(before);

        camera_controller.update(ORIGIN, CAMERA_AUTOPILOT_IDLE_SECONDS, 1, true, false); // now genuinely idle
        expect(positionOf(camera_controller)).not.toEqual(before);
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
