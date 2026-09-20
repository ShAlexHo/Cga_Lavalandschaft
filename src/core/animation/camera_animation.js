import { random } from '../rand.js';
import { smoothstep } from './math_utils.js';
import {
    CAMERA_AUTOPILOT_MIN_AZIMUTH_SPEED,
    CAMERA_AUTOPILOT_MAX_AZIMUTH_SPEED,
    CAMERA_AUTOPILOT_MIN_POLAR_SPEED,
    CAMERA_AUTOPILOT_MAX_POLAR_SPEED,
    CAMERA_AUTOPILOT_MIN_ZOOM_SPEED,
    CAMERA_AUTOPILOT_MAX_ZOOM_SPEED,
    CAMERA_AUTOPILOT_RETARGET_MIN_INTERVAL,
    CAMERA_AUTOPILOT_RETARGET_MAX_INTERVAL,
    CAMERA_AUTOPILOT_DIRECTION_INTERVAL,
    CAMERA_AUTOPILOT_TRANSITION_DURATION,
} from '../config.js';

function createSmoothedRandomWalk(pickTarget, min_retarget_interval, max_retarget_interval) {
    let previous_value = 0;
    let target_value = 0;
    let current_value = 0;
    let transition_elapsed = 0;
    let time_until_retarget = 0;

    return function step(delta_seconds) {
        time_until_retarget -= delta_seconds;
        if (time_until_retarget <= 0) {
            previous_value = current_value;
            target_value = pickTarget();
            transition_elapsed = 0;
            time_until_retarget = random(min_retarget_interval, max_retarget_interval);
        }
        transition_elapsed += delta_seconds;
        const blend = smoothstep(0, CAMERA_AUTOPILOT_TRANSITION_DURATION, transition_elapsed);
        current_value = previous_value + (target_value - previous_value) * blend;
        return current_value;
    };
}

function randomSign() {
    return random(-1, 1) < 0 ? -1 : 1;
}

function randomSignedSpeed(min_speed, max_speed) {
    return randomSign() * random(min_speed, max_speed);
}

function createStandardWalk(pickTarget) {
    return createSmoothedRandomWalk(pickTarget, CAMERA_AUTOPILOT_RETARGET_MIN_INTERVAL, CAMERA_AUTOPILOT_RETARGET_MAX_INTERVAL);
}

const stepAzimuthDirection = createSmoothedRandomWalk(randomSign, CAMERA_AUTOPILOT_DIRECTION_INTERVAL, CAMERA_AUTOPILOT_DIRECTION_INTERVAL);
const stepAzimuthMagnitude = createStandardWalk(() => random(CAMERA_AUTOPILOT_MIN_AZIMUTH_SPEED, CAMERA_AUTOPILOT_MAX_AZIMUTH_SPEED));
const stepPolarSpeed = createStandardWalk(() => randomSignedSpeed(CAMERA_AUTOPILOT_MIN_POLAR_SPEED, CAMERA_AUTOPILOT_MAX_POLAR_SPEED));
const stepZoomSpeed = createStandardWalk(() => randomSignedSpeed(CAMERA_AUTOPILOT_MIN_ZOOM_SPEED, CAMERA_AUTOPILOT_MAX_ZOOM_SPEED));

export function stepCameraAutopilot(delta_seconds) {
    return {
        azimuth_speed: stepAzimuthDirection(delta_seconds) * stepAzimuthMagnitude(delta_seconds),
        polar_speed: stepPolarSpeed(delta_seconds),
        zoom_speed: stepZoomSpeed(delta_seconds),
    };
}
