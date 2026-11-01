import { describe, test, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController } from '../../metaballs-scene/metaballs_controller.js';
import { computeBalls } from '../../metaballs-scene/metaballs_animation.js';
import { createGroundScenery } from '../ground_scenery.js';
import { DEFAULTS, MAX_BALL_COUNT, GROUND_DEFAULTS, GROUND_PLATE_SIZE, GROUND_PATH_SPEED_SCALE } from '../../metaballs-scene/config.js';

let camera;

beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    camera.position.set(0, 7, 24);
    camera.updateMatrixWorld();
});

describe('createGroundScenery', () => {
    let ground_scene;
    let on_ground;

    function groundMesh() {
        return ground_scene.children.find(child => child.isMesh && child !== on_ground.effect);
    }

    beforeEach(() => {
        ground_scene = new THREE.Scene();
        on_ground = createMetaballsController(ground_scene, { createScenery: createGroundScenery });
    });

    test('moves the balls along their paths more slowly, while the shown speed stays 1', () => {
        on_ground.update(10, camera);
        const expected = computeBalls(10 * GROUND_PATH_SPEED_SCALE, { ...DEFAULTS, count: GROUND_DEFAULTS.count }, { planar: true });
        const center = on_ground.effect.material.uniforms.u_ball_center.value[0];

        expect(on_ground.getSpeed()).toBe(DEFAULTS.speed);
        expect(on_ground.getElapsedTime()).toBe(10);
        expect(center.x).toBeCloseTo(2 * expected[0].x - 1, 9);
        expect(center.z).toBeCloseTo(2 * expected[0].z - 1, 9);
    });

    test('starts with its own, larger number of balls', () => {
        expect(on_ground.getCount()).toBe(GROUND_DEFAULTS.count);
        on_ground.setCount(12);
        on_ground.resetToDefaults();
        expect(on_ground.getCount()).toBe(GROUND_DEFAULTS.count);
    });

    test('adds a small, bounded plate whose top lies at the default height, lit for the standard material', () => {
        expect(groundMesh().geometry.parameters).toMatchObject({
            width: GROUND_PLATE_SIZE.width, height: GROUND_PLATE_SIZE.thickness, depth: GROUND_PLATE_SIZE.depth,
        });
        expect(groundMesh().position.y + GROUND_PLATE_SIZE.thickness / 2).toBeCloseTo(GROUND_DEFAULTS.ground_height, 9);
        expect(on_ground.getGroundHeight()).toBeCloseTo(GROUND_DEFAULTS.ground_height, 9);
        expect(on_ground.getGroundVisible()).toBe(GROUND_DEFAULTS.ground_visible);
        expect(ground_scene.children.some(child => child.isLight)).toBe(true);
    });

    test('moves every ball on one horizontal plane', () => {
        on_ground.setCount(MAX_BALL_COUNT);
        for (const delta_seconds of [0, 3.7, 12]) {
            on_ground.update(delta_seconds, camera);
            const centers = on_ground.effect.material.uniforms.u_ball_center.value.slice(0, MAX_BALL_COUNT);
            expect(new Set(centers.map(center => center.y)).size).toBe(1);
            expect(new Set(centers.map(center => center.x)).size).toBeGreaterThan(1);
        }
    });

    test('height and visibility move and hide the floor, and are part of the snapshot and of the reset', () => {
        on_ground.setGroundHeight(0.5);
        on_ground.setGroundVisible(false);
        expect(groundMesh().position.y).toBeCloseTo(0.5 - GROUND_PLATE_SIZE.thickness / 2, 9);
        expect(groundMesh().visible).toBe(false);
        const snapshot = on_ground.getSnapshot();
        expect(snapshot).toMatchObject({ ground_height: 0.5, ground_visible: false });

        on_ground.resetToDefaults();
        expect(on_ground.getGroundHeight()).toBe(GROUND_DEFAULTS.ground_height);
        expect(on_ground.getGroundVisible()).toBe(true);

        on_ground.applySnapshot(snapshot);
        expect(on_ground.getSnapshot()).toEqual(snapshot);
    });
});

