import { describe, test, expect, beforeEach } from 'vitest';
import {
    CAMERA_AUTOPILOT_MIN_AZIMUTH_SPEED, CAMERA_AUTOPILOT_MAX_AZIMUTH_SPEED,
    CAMERA_AUTOPILOT_MIN_POLAR_SPEED, CAMERA_AUTOPILOT_MAX_POLAR_SPEED,
    CAMERA_AUTOPILOT_MIN_ZOOM_SPEED, CAMERA_AUTOPILOT_MAX_ZOOM_SPEED,
    CAMERA_AUTOPILOT_RETARGET_MAX_INTERVAL,
    CAMERA_AUTOPILOT_DIRECTION_INTERVAL,
    CAMERA_AUTOPILOT_TRANSITION_DURATION,
} from '../../config.js';
import { importFreshModule } from '../../test-utils/import_fresh_module.js';

let animation_module;
beforeEach(async () => {
    animation_module = await importFreshModule(() => import('../camera_animation.js'));
});

describe('stepCameraAutopilot', () => {
    test('a settled speed stays within [MIN, MAX] magnitude for all three axes', () => {
        const settled = animation_module.stepCameraAutopilot(CAMERA_AUTOPILOT_TRANSITION_DURATION);
        expect(Math.abs(settled.azimuth_speed)).toBeGreaterThanOrEqual(CAMERA_AUTOPILOT_MIN_AZIMUTH_SPEED);
        expect(Math.abs(settled.azimuth_speed)).toBeLessThanOrEqual(CAMERA_AUTOPILOT_MAX_AZIMUTH_SPEED);
        expect(Math.abs(settled.polar_speed)).toBeGreaterThanOrEqual(CAMERA_AUTOPILOT_MIN_POLAR_SPEED);
        expect(Math.abs(settled.polar_speed)).toBeLessThanOrEqual(CAMERA_AUTOPILOT_MAX_POLAR_SPEED);
        expect(Math.abs(settled.zoom_speed)).toBeGreaterThanOrEqual(CAMERA_AUTOPILOT_MIN_ZOOM_SPEED);
        expect(Math.abs(settled.zoom_speed)).toBeLessThanOrEqual(CAMERA_AUTOPILOT_MAX_ZOOM_SPEED);
    });

    test('eases in smoothly from rest instead of jumping straight to the freshly picked target', () => {
        const { azimuth_speed, polar_speed, zoom_speed } = animation_module.stepCameraAutopilot(0.01);
        expect(Math.abs(azimuth_speed)).toBeLessThan(CAMERA_AUTOPILOT_MAX_AZIMUTH_SPEED * 0.01);
        expect(Math.abs(polar_speed)).toBeLessThan(CAMERA_AUTOPILOT_MAX_POLAR_SPEED * 0.01);
        expect(Math.abs(zoom_speed)).toBeLessThan(CAMERA_AUTOPILOT_MAX_ZOOM_SPEED * 0.01);
    });

    test('holds steady once a transition has fully eased in, as long as no retarget is due yet', () => {
        animation_module.stepCameraAutopilot(CAMERA_AUTOPILOT_TRANSITION_DURATION);
        const settled = animation_module.stepCameraAutopilot(0.001);
        const still_settled = animation_module.stepCameraAutopilot(0.001);
        expect(still_settled.azimuth_speed).toBeCloseTo(settled.azimuth_speed, 9);
        expect(still_settled.polar_speed).toBeCloseTo(settled.polar_speed, 9);
        expect(still_settled.zoom_speed).toBeCloseTo(settled.zoom_speed, 9);
    });

    test('azimuth keeps a single committed direction across many magnitude retargets, well under CAMERA_AUTOPILOT_DIRECTION_INTERVAL', () => {
        const first = animation_module.stepCameraAutopilot(CAMERA_AUTOPILOT_TRANSITION_DURATION);
        const committed_sign = Math.sign(first.azimuth_speed);
        expect(committed_sign).not.toBe(0);

        let elapsed = CAMERA_AUTOPILOT_TRANSITION_DURATION;
        while (elapsed < CAMERA_AUTOPILOT_DIRECTION_INTERVAL * 0.9) {
            const result = animation_module.stepCameraAutopilot(CAMERA_AUTOPILOT_RETARGET_MAX_INTERVAL);
            elapsed += CAMERA_AUTOPILOT_RETARGET_MAX_INTERVAL;
            expect(Math.sign(result.azimuth_speed)).toBe(committed_sign);
        }
    });
});
