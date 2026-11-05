import { describe, test, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController } from '../../metaballs/metaballs_controller.js';
import { computeFlowBalls } from '../flow_animation.js';
import { createVolcanoScenery } from '../volcano_scenery.js';
import { METABALLS_DEFAULTS } from '../../metaballs/config.js';
import { VOLCANO_GROUND_PLATE_SIZE, VOLCANO_DEFAULTS, LAVA_FLOW_DEFAULTS, LAVA_FLOW_BALL_RADIUS } from '../config.js';
import { METABALL_SECTORS as MAIN_SCENE_SECTOR_COUNT } from '../../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../../main-scene/default_settings.json';
import { VOLCANO_PROFILE, GROUND_SIZE as MAIN_SCENE_GROUND_SIZE } from '../../../main-scene/config.js';

const STRAIGHT_MODE = { scenery: 'volcano' };
const RADIAL_MODE = { scenery: 'volcano', with_radial_flow: true };

let camera;

function createOnVolcano(target_scene, mode) {
    return createMetaballsController(target_scene, { sceneries: { volcano: createVolcanoScenery }, mode });
}

beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    camera.position.set(0, 7, 24);
    camera.updateMatrixWorld();
});

describe('createVolcanoScenery – along a straight line', () => {
    let volcano_scene;
    let on_volcano;

    function sceneMesh(geometry_type) {
        return volcano_scene.children.find(child => child.isMesh && child !== on_volcano.mesh && child.geometry.type === geometry_type);
    }

    beforeEach(() => {
        volcano_scene = new THREE.Scene();
        on_volcano = createOnVolcano(volcano_scene, STRAIGHT_MODE);
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
        expect(on_volcano.getSpeed()).toBeGreaterThan(METABALLS_DEFAULTS.speed);
        expect(on_volcano.getSpawnHeight()).toBe(VOLCANO_DEFAULTS.spawn_height);
        expect(on_volcano.getFlowSlope()).toBe(VOLCANO_DEFAULTS.flow_slope);
        expect(on_volcano.getCount()).toBe(VOLCANO_DEFAULTS.count);
    });

    test('update() moves the balls along the flow from the crater', () => {
        on_volcano.setSpawnHeight(7);
        on_volcano.setFlowSlope(0.8);
        on_volcano.update(1.5, camera);
        const expected = computeFlowBalls(1.5 * VOLCANO_DEFAULTS.speed, { count: VOLCANO_DEFAULTS.count, spawn_height: 7, flow_slope: 0.8 });
        const centers = on_volcano.mesh.material.uniforms.u_ball_center.value;

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

describe('createVolcanoScenery – in all directions', () => {
    let radial_scene;
    let radial;

    function sceneMesh(geometry_type) {
        return radial_scene.children.find(child => child.isMesh && child !== radial.mesh && child.geometry.type === geometry_type);
    }

    beforeEach(() => {
        radial_scene = new THREE.Scene();
        radial = createOnVolcano(radial_scene, RADIAL_MODE);
    });

    test('stands on the same lathe volcano and ground as the straight-line scene, lit the same', () => {
        expect(sceneMesh('LatheGeometry')).toBeDefined();
        expect(sceneMesh('BoxGeometry').position.y).toBeLessThan(0);
        expect(radial_scene.children.filter(child => child.isLight)).toHaveLength(3);
    });

    test('starts with all balls at constant speed, flowing slower and from higher up than in the straight-line scene, on its slope', () => {
        expect(radial.getCount()).toBe(LAVA_FLOW_DEFAULTS.count);
        expect(radial.getSpeed()).toBe(LAVA_FLOW_DEFAULTS.speed);
        expect(LAVA_FLOW_DEFAULTS.speed).toBeLessThan(VOLCANO_DEFAULTS.speed);
        expect(LAVA_FLOW_DEFAULTS.spawn_height).toBeGreaterThan(VOLCANO_DEFAULTS.spawn_height);
        expect(LAVA_FLOW_DEFAULTS.flow_slope).toBe(VOLCANO_DEFAULTS.flow_slope);
        expect(radial.getSlowDown()).toBe(false);
        expect(radial.getGroundVisible()).toBe(true);
        expect(radial.getSnapshot()).not.toHaveProperty('spawn_height');
        expect(radial.getSnapshot()).not.toHaveProperty('flow_slope');
    });

    test('makes the balls somewhat smaller than in the landscape, also after a reset', () => {
        expect(radial.getRadius()).toBe(LAVA_FLOW_BALL_RADIUS);
        expect(LAVA_FLOW_BALL_RADIUS).toBeLessThan(MAIN_SCENE_DEFAULTS.metaballRadius);

        radial.setRadius(2);
        expect(radial.getSnapshot()).toMatchObject({ radius: 2 });
        radial.resetToDefaults();
        expect(radial.getRadius()).toBe(LAVA_FLOW_BALL_RADIUS);
    });

    test('update() lets the balls flow out in all directions, slowing down or not', () => {
        for (const slow_down of [false, true]) {
            radial.setSlowDown(slow_down);
            radial.update(0.75, camera);
            const expected = computeFlowBalls(radial.getElapsedTime(), { ...LAVA_FLOW_DEFAULTS, slow_down }, { radial: true });
            const centers = radial.mesh.material.uniforms.u_ball_center.value;
            expected.forEach((ball, i) => {
                expect(centers[i].x).toBeCloseTo(2 * ball.x - 1, 9);
                expect(centers[i].z).toBeCloseTo(2 * ball.z - 1, 9);
            });
        }
    });

    test('slowing down and the ground’s visibility are part of the snapshot and of the reset', () => {
        radial.setSlowDown(true);
        radial.setGroundVisible(false);
        expect(sceneMesh('BoxGeometry').visible).toBe(false);
        const snapshot = radial.getSnapshot();
        expect(snapshot).toMatchObject({ slow_down: true, ground_visible: false });

        radial.resetToDefaults();
        expect(radial.getSlowDown()).toBe(false);
        expect(radial.getGroundVisible()).toBe(true);

        radial.applySnapshot(snapshot);
        expect(radial.getSnapshot()).toEqual(snapshot);
    });

    test('starts evenly spread over all 360°, with the landscape’s number of sectors ready to switch on', () => {
        expect(radial.getSectorsEnabled()).toBe(false);
        expect(radial.getSectorCount()).toBe(MAIN_SCENE_SECTOR_COUNT);
    });

    test('sectors and their count reach the flow, and are part of the snapshot and of the reset', () => {
        radial.setSectorsEnabled(true);
        radial.setSectorCount(3);
        radial.update(0.5, camera);
        const expected = computeFlowBalls(radial.getElapsedTime(), { ...LAVA_FLOW_DEFAULTS, sectors_enabled: true, sector_count: 3 }, { radial: true });
        const centers = radial.mesh.material.uniforms.u_ball_center.value;
        expected.forEach((ball, i) => expect(centers[i].z).toBeCloseTo(2 * ball.z - 1, 9));

        const snapshot = radial.getSnapshot();
        expect(snapshot).toMatchObject({ sectors_enabled: true, sector_count: 3 });
        radial.resetToDefaults();
        expect(radial.getSectorsEnabled()).toBe(false);
        expect(radial.getSectorCount()).toBe(MAIN_SCENE_SECTOR_COUNT);
        radial.applySnapshot(snapshot);
        expect(radial.getSnapshot()).toEqual(snapshot);
    });

    test('the sector count from the open field is kept a whole number of at least one', () => {
        radial.setSectorCount(4.6);
        expect(radial.getSectorCount()).toBe(5);
        radial.setSectorCount(0);
        expect(radial.getSectorCount()).toBe(1);
        radial.setSectorCount(-3);
        expect(radial.getSectorCount()).toBe(1);
    });
});

describe('createVolcanoScenery – switching between the two flows', () => {
    test('one volcano serves both scenes, and switching back to the straight line drops the settings of the flow in all directions', () => {
        const shared_scene = new THREE.Scene();
        const shared = createOnVolcano(shared_scene, RADIAL_MODE);
        shared.setSlowDown(true);
        shared.setSectorsEnabled(true);

        shared.applyMode(STRAIGHT_MODE);
        shared.resetToDefaults();

        expect(shared_scene.children.filter(child => child.isMesh && child.geometry.type === 'LatheGeometry')).toHaveLength(1);
        expect(shared.getSlowDown()).toBe(false);
        expect(shared.getSectorsEnabled()).toBe(false);
        expect(shared.getRadius()).toBe(MAIN_SCENE_DEFAULTS.metaballRadius);
        expect(shared.getSpawnHeight()).toBe(VOLCANO_DEFAULTS.spawn_height);
        expect(Object.keys(shared.getSnapshot())).toEqual(expect.arrayContaining(['spawn_height', 'flow_slope', 'ground_visible']));
        expect(shared.getSnapshot()).not.toHaveProperty('slow_down');

        shared.update(1, camera);
        const expected = computeFlowBalls(shared.getElapsedTime(), { count: VOLCANO_DEFAULTS.count, spawn_height: VOLCANO_DEFAULTS.spawn_height, flow_slope: VOLCANO_DEFAULTS.flow_slope });
        const centers = shared.mesh.material.uniforms.u_ball_center.value;
        expected.forEach((ball, i) => expect(centers[i].x).toBeCloseTo(2 * ball.x - 1, 9));
    });
});
