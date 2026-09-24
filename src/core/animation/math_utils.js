import { CAMERA_VISIBLE_ARC_DEGREES, CAMERA_VISIBILITY_FADE_DEGREES } from '../config.js';

const CAMERA_VISIBLE_HALF_ARC = (CAMERA_VISIBLE_ARC_DEGREES * Math.PI / 180) / 2;
const CAMERA_VISIBILITY_FADE = CAMERA_VISIBILITY_FADE_DEGREES * Math.PI / 180;

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function smoothstep(edge0, edge1, x) {
    const normalized = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return normalized * normalized * (3 - 2 * normalized);
}

// Signed difference between two angles (radians), wrapped to (-PI, PI].
export function angleDifference(angle_a, angle_b) {
    const wrapped = (angle_a - angle_b + Math.PI) % (2 * Math.PI);
    return (wrapped < 0 ? wrapped + 2 * Math.PI : wrapped) - Math.PI;
}

// Azimuth (radians) from center toward point, in the X/Z plane.
export function worldAzimuth(center, point) {
    return Math.atan2(point.z - center.z, point.x - center.x);
}

export function distance(point_a, point_b) {
    return Math.hypot(point_a.x - point_b.x, point_a.y - point_b.y, point_a.z - point_b.z);
}

export function horizontalDistance(point_a, point_b) {
    return Math.hypot(point_a.x - point_b.x, point_a.z - point_b.z);
}

// phi is the polar angle from the y (up) axis, theta the azimuthal angle around it - matches THREE.Spherical.
export function cartesianToSpherical(point) {
    const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
    return {
        radius,
        phi: radius === 0 ? 0 : Math.acos(clamp(point.y / radius, -1, 1)),
        theta: Math.atan2(point.x, point.z),
    };
}

export function sphericalToCartesian(spherical) {
    const sin_phi_radius = Math.sin(spherical.phi) * spherical.radius;
    return {
        x: sin_phi_radius * Math.sin(spherical.theta),
        y: Math.cos(spherical.phi) * spherical.radius,
        z: sin_phi_radius * Math.cos(spherical.theta),
    };
}

// 1 within CAMERA_VISIBLE_ARC_DEGREES facing the camera, smoothly fading to 0 past its edge.
export function cameraArcVisibility(object_angle, camera_angle) {
    const angle_from_camera = Math.abs(angleDifference(object_angle, camera_angle));
    return 1 - smoothstep(CAMERA_VISIBLE_HALF_ARC - CAMERA_VISIBILITY_FADE, CAMERA_VISIBLE_HALF_ARC, angle_from_camera);
}
