import { describe, test, expect } from 'vitest';
import * as THREE from 'three';
import { createVolcanoLathe, averagedLatheProfile } from '../volcano_lathe.js';
import { VOLCANO_PROFILE } from '../../../main-scene/config.js';

describe('createVolcanoLathe', () => {
    test('turns the main scene’s volcano profile by default, or any given profile', () => {
        const scene = new THREE.Scene();
        const default_lathe = createVolcanoLathe(scene);
        expect(default_lathe.geometry.parameters.points.map(({ x, y }) => ({ x, y }))).toEqual(VOLCANO_PROFILE);

        const profile = [{ x: 3, y: 0 }, { x: 1, y: 2 }];
        expect(createVolcanoLathe(scene, profile).geometry.parameters.points.map(({ x, y }) => ({ x, y }))).toEqual(profile);
        expect(scene.children).toHaveLength(2);
    });
});

describe('averagedLatheProfile', () => {
    test('averages every profile point’s height over all the way round, keeping its radius', () => {
        const geometry = new THREE.LatheGeometry([new THREE.Vector2(4, 0), new THREE.Vector2(2, 3)], 4);
        const positions = geometry.attributes.position;
        const point_count = 2;
        const lowered_heights = [[0, 3], [-1, 2], [0, 1], [-1, 2]];
        lowered_heights.forEach((heights, i) => heights.forEach((height, j) => positions.setY(i * point_count + j, height)));

        expect(averagedLatheProfile(geometry)).toEqual([{ x: 4, y: -0.5 }, { x: 2, y: 2 }]);
    });

    test('gives back the profile itself for an untouched lathe', () => {
        const geometry = new THREE.LatheGeometry(VOLCANO_PROFILE.map(({ x, y }) => new THREE.Vector2(x, y)), 12);
        averagedLatheProfile(geometry).forEach((point, j) => {
            expect(point.x).toBeCloseTo(VOLCANO_PROFILE[j].x, 5);
            expect(point.y).toBeCloseTo(VOLCANO_PROFILE[j].y, 5);
        });
    });
});
