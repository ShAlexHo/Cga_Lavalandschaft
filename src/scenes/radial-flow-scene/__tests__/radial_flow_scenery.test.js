import { describe, test, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { createMetaballsController } from '../../metaballs-scene/metaballs_controller.js';
import { computeFlowBalls } from '../../metaballs-scene/metaballs_animation.js';
import { createRadialFlowScenery } from '../radial_flow_scenery.js';
import { RADIAL_FLOW_DEFAULTS, RADIAL_FLOW_BALL_RADIUS, VOLCANO_DEFAULTS } from '../../metaballs-scene/config.js';
import { METABALL_SECTORS as MAIN_SCENE_SECTOR_COUNT } from '../../main-scene/config.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';

let camera;
let radial_scene;
let radial;

function sceneMesh(geometry_type) {
    return radial_scene.children.find(child => child.isMesh && child !== radial.effect && child.geometry.type === geometry_type);
}

beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    camera.position.set(0, 7, 24);
    camera.updateMatrixWorld();
    radial_scene = new THREE.Scene();
    radial = createMetaballsController(radial_scene, { createScenery: createRadialFlowScenery });
});

describe('createRadialFlowScenery', () => {
    test('stands on the same lathe volcano and ground as the straight-line scene, lit the same', () => {
        expect(sceneMesh('LatheGeometry')).toBeDefined();
        expect(sceneMesh('BoxGeometry').position.y).toBeLessThan(0);
        expect(radial_scene.children.filter(child => child.isLight)).toHaveLength(3);
    });

    test('starts with all balls at constant speed, flowing slower and from higher up than in the straight-line scene, on its slope', () => {
        expect(radial.getCount()).toBe(RADIAL_FLOW_DEFAULTS.count);
        expect(radial.getSpeed()).toBe(RADIAL_FLOW_DEFAULTS.speed);
        expect(RADIAL_FLOW_DEFAULTS.speed).toBeLessThan(VOLCANO_DEFAULTS.speed);
        expect(RADIAL_FLOW_DEFAULTS.spawn_height).toBeGreaterThan(VOLCANO_DEFAULTS.spawn_height);
        expect(RADIAL_FLOW_DEFAULTS.flow_slope).toBe(VOLCANO_DEFAULTS.flow_slope);
        expect(radial.getSlowDown()).toBe(false);
        expect(radial.getGroundVisible()).toBe(true);
        expect(radial.setSpawnHeight).toBeUndefined();
        expect(radial.setFlowSlope).toBeUndefined();
    });

    test('makes the balls somewhat smaller than in the landscape, also after a reset', () => {
        expect(radial.getRadius()).toBe(RADIAL_FLOW_BALL_RADIUS);
        expect(RADIAL_FLOW_BALL_RADIUS).toBeLessThan(MAIN_SCENE_DEFAULTS.metaballRadius);

        radial.setRadius(2);
        expect(radial.getSnapshot()).toMatchObject({ radius: 2 });
        radial.resetToDefaults();
        expect(radial.getRadius()).toBe(RADIAL_FLOW_BALL_RADIUS);
    });

    test('update() lets the balls flow out in all directions, slowing down or not', () => {
        for (const slow_down of [false, true]) {
            radial.setSlowDown(slow_down);
            radial.update(0.75, camera);
            const expected = computeFlowBalls(radial.getElapsedTime(), { ...RADIAL_FLOW_DEFAULTS, slow_down }, { radial: true });
            const centers = radial.effect.material.uniforms.u_ball_center.value;
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
        const expected = computeFlowBalls(radial.getElapsedTime(), { ...RADIAL_FLOW_DEFAULTS, sectors_enabled: true, sector_count: 3 }, { radial: true });
        const centers = radial.effect.material.uniforms.u_ball_center.value;
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
