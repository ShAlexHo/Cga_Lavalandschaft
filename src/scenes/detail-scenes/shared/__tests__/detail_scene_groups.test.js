import { describe, test, expect, vi } from 'vitest';

vi.mock('../scene_group.js', () => ({
    defineSceneGroup: vi.fn((group_name, options) => ({
        sceneEngine: scene_name => ({ getSceneEngine: () => ({ group_name, scene_name }) }),
    })),
}));

import { defineSceneGroup } from '../scene_group.js';
import { DETAIL_SCENES } from '../../detail_scenes.js';
import { DETAIL_CAMERA_SETUP } from '../config.js';
import { VOLCANO_CAMERA_SETUP } from '../../volcano/config.js';
import { LANDSCAPE_CAMERA_SETUP, LAVA_LANDSCAPE_CAMERA_SETUP, SUN_GOD_RAYS_CAMERA_SETUP } from '../../landscape/config.js';
import {
    CAMERA_FOV as MAIN_SCENE_CAMERA_FOV, CAMERA_INITIAL_DISTANCE as MAIN_SCENE_CAMERA_DISTANCE,
    CAMERA_MIN_DISTANCE as MAIN_SCENE_CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE as MAIN_SCENE_CAMERA_MAX_DISTANCE,
    CAMERA_MIN_POLAR_ANGLE as MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, CAMERA_MAX_POLAR_ANGLE as MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE,
    CAMERA_FAR as MAIN_SCENE_CAMERA_FAR, CAMERA_INITIAL_POSITION as MAIN_SCENE_CAMERA_INITIAL_POSITION,
    SUN_ORBIT_START_ANGLE, SUN_ORBIT_SPEED, SCENE_WARM_UP_SECONDS,
} from '../../../main-scene/config.js';

const GROUP_OF_SCENE = {
    'metaballs-scene': 'metaballs-scenes',
    'noise-scene': 'metaballs-scenes',
    'surface-scene': 'metaballs-scenes',
    'ground-scene': 'metaballs-scenes',
    'volcano-scene': 'volcano-scenes',
    'lava-flow-scene': 'volcano-scenes',
    'volcano-irregularities-scene': 'landscape-scenes',
    'smoke-ash-scene': 'landscape-scenes',
    'lava-landscape-scene': 'landscape-scenes',
    'sun-god-rays-scene': 'landscape-scenes',
};

async function groupDefinitions() {
    for (const detail of DETAIL_SCENES) await detail.loadEngine();
    return Object.fromEntries(defineSceneGroup.mock.calls);
}

describe('scene groups', () => {
    test('the ten detail scenes form three groups that each share one engine: metaballs 1–4, volcano 5–6, landscape 7–10', async () => {
        for (const detail of DETAIL_SCENES) {
            const scene_module = await detail.loadEngine();
            expect(scene_module.getSceneEngine()).toEqual({ group_name: GROUP_OF_SCENE[detail.scene_name], scene_name: detail.scene_name });
        }
        expect(defineSceneGroup).toHaveBeenCalledTimes(3);
    });

    test('every group brings its controller, and every scene of it brings its own panel', async () => {
        for (const options of Object.values(await groupDefinitions())) {
            expect(options.createController).toBeTypeOf('function');
            for (const { setupGui } of Object.values(options.scenes)) expect(setupGui).toBeTypeOf('function');
        }
    });

    test('the ground scene keeps the framing of the floating metaballs, but its camera does not turn by itself', async () => {
        const { 'metaballs-scenes': metaballs } = await groupDefinitions();
        const { camera_setup } = metaballs.scenes['ground-scene'];
        expect(camera_setup).toEqual({ ...DETAIL_CAMERA_SETUP, auto_rotate: false });
        expect(metaballs.scenes['metaballs-scene'].camera_setup).toBeUndefined();
    });

    test('every landscape scene keeps a lava of its own, so its lava resumes where it was left', async () => {
        const { 'landscape-scenes': landscape } = await groupDefinitions();
        const lavas = Object.values(landscape.scenes).map(({ mode }) => mode.metaball_animation);
        expect(new Set(lavas).size).toBe(4);
        lavas.forEach(lava => expect(lava.stepMetaballAnimation).toBeTypeOf('function'));
    });
});

describe('volcano camera setup', () => {
    test('the lava landscape keeps the camera above the ground and below the top, like the main scene', () => {
        expect(LAVA_LANDSCAPE_CAMERA_SETUP).toEqual({
            ...LANDSCAPE_CAMERA_SETUP,
            polar_angle: { min: MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE, max: MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE },
        });
        const { y, z } = LAVA_LANDSCAPE_CAMERA_SETUP.position;
        const starting_polar_angle = Math.atan2(z, y);
        expect(starting_polar_angle).toBeGreaterThan(MAIN_SCENE_CAMERA_MIN_POLAR_ANGLE);
        expect(starting_polar_angle).toBeLessThan(MAIN_SCENE_CAMERA_MAX_POLAR_ANGLE);
    });

    test('the sun scene sees as far as the main scene and starts, like the main scene, looking towards the sun', () => {
        const { far, position, ...rest } = SUN_GOD_RAYS_CAMERA_SETUP;
        const { position: landscape_position, ...landscape_rest } = LAVA_LANDSCAPE_CAMERA_SETUP;
        expect(rest).toEqual(landscape_rest);
        expect(far).toBe(MAIN_SCENE_CAMERA_FAR);
        expect(position).toEqual({ x: MAIN_SCENE_CAMERA_INITIAL_POSITION.x, y: landscape_position.y, z: MAIN_SCENE_CAMERA_INITIAL_POSITION.z });
        expect(Math.hypot(position.x, position.y, position.z)).toBeCloseTo(MAIN_SCENE_CAMERA_DISTANCE, 9);

        const sun_angle = SUN_ORBIT_START_ANGLE + SCENE_WARM_UP_SECONDS * SUN_ORBIT_SPEED;
        const looking_towards_sun = -(position.x * Math.cos(sun_angle) + position.z * Math.sin(sun_angle)) / Math.hypot(position.x, position.z);
        expect(looking_towards_sun).toBeGreaterThan(0.9);
    });

    test('frames the volcano exactly like the main scene does', () => {
        const { x, y, z } = VOLCANO_CAMERA_SETUP.position;
        expect(VOLCANO_CAMERA_SETUP.fov).toBe(MAIN_SCENE_CAMERA_FOV);
        expect(Math.hypot(x, y, z)).toBeCloseTo(MAIN_SCENE_CAMERA_DISTANCE, 9);
    });

    test('the landscape volcano keeps the same framing, but its camera does not turn by itself and zooms as far as the main scene’s', () => {
        expect(LANDSCAPE_CAMERA_SETUP).toEqual({
            ...VOLCANO_CAMERA_SETUP,
            auto_rotate: false,
            zoom_distance: { min: MAIN_SCENE_CAMERA_MIN_DISTANCE, max: MAIN_SCENE_CAMERA_MAX_DISTANCE },
        });
        expect(VOLCANO_CAMERA_SETUP.auto_rotate).toBe(true);
        expect(VOLCANO_CAMERA_SETUP.zoom_distance).toBeUndefined();
    });
});
