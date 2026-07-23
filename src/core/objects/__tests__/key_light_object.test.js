import { describe, test, expect, vi } from 'vitest';

vi.mock('three', () => {
    class Vector2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
        set(x, y) { this.x = x; this.y = y; return this; }
    }
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
        set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
    }
    class AmbientLight {
        constructor(color, intensity) { this.color = color; this.intensity = intensity; }
    }
    class DirectionalLight {
        constructor(color, intensity) {
            this.color = color;
            this.intensity = intensity;
            this.position = new Vector3();
            this.castShadow = false;
            this.shadow = {
                mapSize: new Vector2(),
                camera: { near: 0, far: 0, left: 0, right: 0, top: 0, bottom: 0 },
                bias: 0,
            };
        }
    }
    return { Vector2, Vector3, AmbientLight, DirectionalLight };
});

import { createKeyLight } from '../key_light_object.js';
import {
    KEY_LIGHT_COLOR, KEY_LIGHT_INTENSITY, VOLCANO_LIGHT_POSITION,
    AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY,
    KEY_LIGHT_SHADOW_MAP_SIZE, KEY_LIGHT_SHADOW_FRUSTUM, KEY_LIGHT_SHADOW_NEAR, KEY_LIGHT_SHADOW_FAR, KEY_LIGHT_SHADOW_BIAS,
} from '../../config.js';

function makeScene() { return { add: vi.fn() }; }

describe('createKeyLight', () => {
    test('adds both the ambient and key light to the scene', () => {
        const scene = makeScene();
        const { ambient_light, key_light } = createKeyLight(scene);
        expect(scene.add).toHaveBeenCalledWith(ambient_light, key_light);
    });

    test('ambient light uses the configured color/intensity', () => {
        const { ambient_light } = createKeyLight(makeScene());
        expect(ambient_light.color).toBe(AMBIENT_LIGHT_COLOR);
        expect(ambient_light.intensity).toBe(AMBIENT_LIGHT_INTENSITY);
    });

    test('key light uses the configured color/intensity and the volcano light position', () => {
        const { key_light } = createKeyLight(makeScene());
        expect(key_light.color).toBe(KEY_LIGHT_COLOR);
        expect(key_light.intensity).toBe(KEY_LIGHT_INTENSITY);
        expect(key_light.position).toEqual({ x: VOLCANO_LIGHT_POSITION.x, y: VOLCANO_LIGHT_POSITION.y, z: VOLCANO_LIGHT_POSITION.z });
    });

    test('key light casts a shadow configured from the shadow constants', () => {
        const { key_light } = createKeyLight(makeScene());
        expect(key_light.castShadow).toBe(true);
        expect(key_light.shadow.mapSize).toEqual({ x: KEY_LIGHT_SHADOW_MAP_SIZE, y: KEY_LIGHT_SHADOW_MAP_SIZE });
        expect(key_light.shadow.camera.near).toBe(KEY_LIGHT_SHADOW_NEAR);
        expect(key_light.shadow.camera.far).toBe(KEY_LIGHT_SHADOW_FAR);
        expect(key_light.shadow.camera.left).toBe(-KEY_LIGHT_SHADOW_FRUSTUM);
        expect(key_light.shadow.camera.right).toBe(KEY_LIGHT_SHADOW_FRUSTUM);
        expect(key_light.shadow.camera.top).toBe(KEY_LIGHT_SHADOW_FRUSTUM);
        expect(key_light.shadow.camera.bottom).toBe(-KEY_LIGHT_SHADOW_FRUSTUM);
        expect(key_light.shadow.bias).toBe(KEY_LIGHT_SHADOW_BIAS);
    });
});
