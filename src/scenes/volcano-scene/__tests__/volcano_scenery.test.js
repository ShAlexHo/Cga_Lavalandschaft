import { describe, test, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController } from '../../metaballs-scene/metaballs_controller.js';
import { computeFlowBalls } from '../../metaballs-scene/flow_animation.js';
import { createVolcanoScenery } from '../volcano_scenery.js';
import { DEFAULTS, VOLCANO_GROUND_PLATE_SIZE } from '../../metaballs-scene/config.js';
import { VOLCANO_DEFAULTS } from '../config.js';
import { VOLCANO_PROFILE, GROUND_SIZE as MAIN_SCENE_GROUND_SIZE } from '../../main-scene/config.js';

let camera;

beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    camera.position.set(0, 7, 24);
    camera.updateMatrixWorld();
});

describe('createVolcanoScenery', () => {
    let volcano_scene;
    let on_volcano;

    function sceneMesh(geometry_type) {
        return volcano_scene.children.find(child => child.isMesh && child !== on_volcano.effect && child.geometry.type === geometry_type);
    }

    beforeEach(() => {
        volcano_scene = new THREE.Scene();
        on_volcano = createMetaballsController(volcano_scene, { createScenery: createVolcanoScenery });
    });

    test('adds a smooth lathe turned from the main scene’s volcano profile, its foot at the origin, lit for the standard material', () => {
        const mesh = sceneMesh('LatheGeometry');
        expect(mesh.geometry.parameters.points.map(point => ({ x: point.x, y: point.y }))).toEqual(VOLCANO_PROFILE);
        expect(mesh.material.isMeshStandardMaterial).toBe(true);
        expect(mesh.position.y).toBe(0);
        expect(volcano_scene.children.filter(child => child.isLight)).toHaveLength(3);
    });

    test('adds a ground as large as the main scene’s, its top at the volcano’s foot, visible by default', () => {
        const ground_mesh = sceneMesh('BoxGeometry');
        expect(ground_mesh.geometry.parameters).toMatchObject({ width: MAIN_SCENE_GROUND_SIZE, depth: MAIN_SCENE_GROUND_SIZE });
        expect(ground_mesh.position.y + VOLCANO_GROUND_PLATE_SIZE.thickness / 2).toBeCloseTo(0, 9);
        expect(on_volcano.getGroundVisible()).toBe(true);
        expect(on_volcano.setGroundHeight).toBeUndefined();
    });

    test('the ground can be hidden, which is part of the snapshot and of the reset', () => {
        on_volcano.setGroundVisible(false);
        expect(sceneMesh('BoxGeometry').visible).toBe(false);
        const snapshot = on_volcano.getSnapshot();
        expect(snapshot).toMatchObject({ ground_visible: false });
        expect(snapshot).not.toHaveProperty('ground_height');

        on_volcano.resetToDefaults();
        expect(on_volcano.getGroundVisible()).toBe(true);
        expect(sceneMesh('BoxGeometry').position.y + VOLCANO_GROUND_PLATE_SIZE.thickness / 2).toBeCloseTo(0, 9);

        on_volcano.applySnapshot(snapshot);
        expect(on_volcano.getSnapshot()).toEqual(snapshot);
    });

    test('starts faster than the other scenes, with its own spawn height, flow slope and ball count', () => {
        expect(on_volcano.getSpeed()).toBe(VOLCANO_DEFAULTS.speed);
        expect(on_volcano.getSpeed()).toBeGreaterThan(DEFAULTS.speed);
        expect(on_volcano.getSpawnHeight()).toBe(VOLCANO_DEFAULTS.spawn_height);
        expect(on_volcano.getFlowSlope()).toBe(VOLCANO_DEFAULTS.flow_slope);
        expect(on_volcano.getCount()).toBe(VOLCANO_DEFAULTS.count);
    });

    test('update() moves the balls along the flow from the crater', () => {
        on_volcano.setSpawnHeight(7);
        on_volcano.setFlowSlope(0.8);
        on_volcano.update(1.5, camera);
        const expected = computeFlowBalls(1.5 * VOLCANO_DEFAULTS.speed, { count: VOLCANO_DEFAULTS.count, spawn_height: 7, flow_slope: 0.8 });
        const centers = on_volcano.effect.material.uniforms.u_ball_center.value;

        expected.forEach((ball, i) => {
            expect(centers[i].x).toBeCloseTo(2 * ball.x - 1, 9);
            expect(centers[i].y).toBeCloseTo(2 * ball.y - 1, 9);
            expect(centers[i].z).toBeCloseTo(2 * ball.z - 1, 9);
        });
    });

    test('spawn height and flow slope are part of the snapshot and of the reset', () => {
        on_volcano.setSpawnHeight(8);
        on_volcano.setFlowSlope(1.1);
        on_volcano.setSpeed(0.5);
        const snapshot = on_volcano.getSnapshot();
        expect(snapshot).toMatchObject({ spawn_height: 8, flow_slope: 1.1, speed: 0.5 });

        on_volcano.resetToDefaults();
        expect(on_volcano.getSpawnHeight()).toBe(VOLCANO_DEFAULTS.spawn_height);
        expect(on_volcano.getFlowSlope()).toBe(VOLCANO_DEFAULTS.flow_slope);
        expect(on_volcano.getSpeed()).toBe(VOLCANO_DEFAULTS.speed);

        on_volcano.applySnapshot(snapshot);
        expect(on_volcano.getSnapshot()).toEqual(snapshot);
    });
});
