import { describe, test, expect, vi, beforeEach } from 'vitest';

// ─── Mock Three.js ───────────────────────────────────────────────────────────

vi.mock('three', () => {
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; this.y = y; this.z = z;
        }
        copy(other) {
            this.x = other.x; this.y = other.y; this.z = other.z;
            return this;
        }
        applyMatrix4(_matrix) {
            return this; // identity transform in tests
        }
    }

    class Color {
        constructor(r = 0, g = 0, b = 0) {
            this.r = r; this.g = g; this.b = b;
        }
    }

    class ShaderMaterial {
        constructor(params = {}) {
            this.uniforms       = params.uniforms ?? {};
            this.vertexShader   = params.vertexShader ?? '';
            this.fragmentShader = params.fragmentShader ?? '';
            this.side           = params.side ?? 0;
        }
    }

    return { Vector3, Color, ShaderMaterial, DoubleSide: 2 };
});

vi.mock('three/addons/objects/MarchingCubes.js', () => {
    class MarchingCubes {
        constructor(_resolution, _material, _uvs, _colors, _max) {
            this.isolation = 80;
            this.scale     = { setScalar: vi.fn() };
            this.position  = { y: 0 };
        }
        reset() {}
        addBall() {}
        update() {}
    }
    return { MarchingCubes };
});

// ─── Mock shader files (?raw imports) ───────────────────────────────────────

vi.mock('../shaders/metaball.vert?raw', () => ({ default: '// vertex shader' }));
vi.mock('../shaders/noise.glsl?raw', () => ({ default: '// noise glsl' }));
vi.mock('../shaders/metaball.frag?raw', () => ({ default: '// frag shader' }));

// ─── Imports after mocks ─────────────────────────────────────────────────────

import {
    settings,
    create_metaballs,
    rebuild_field,
    update_metaballs,
    update_light,
} from '../metaballs.js';

// ─── Helper ──────────────────────────────────────────────────────────────────

function make_effect() {
    return {
        reset:   vi.fn(),
        addBall: vi.fn(),
        update:  vi.fn(),
    };
}

// ─── settings (default values) ───────────────────────────────────────────────

describe('settings (default values)', () => {
    test('count is 16', () => expect(settings.count).toBe(16));
    test('spread is 1.0', () => expect(settings.spread).toBe(1.0));
    test('speed_factor is 0.35', () => expect(settings.speed_factor).toBe(0.35));
    test('paused is false', () => expect(settings.paused).toBe(false));
    test('max_count is 30', () => expect(settings.max_count).toBe(30));
});

// ─── rebuild_field ───────────────────────────────────────────────────────────

describe('rebuild_field', () => {
    let effect;
    beforeEach(() => { effect = make_effect(); });

    test('calls reset() first', () => {
        const order = [];
        effect.reset.mockImplementation(() => order.push('reset'));
        effect.addBall.mockImplementation(() => order.push('addBall'));
        effect.update.mockImplementation(() => order.push('update'));

        rebuild_field(effect);

        expect(order[0]).toBe('reset');
    });

    test('calls update() last', () => {
        const order = [];
        effect.reset.mockImplementation(() => order.push('reset'));
        effect.addBall.mockImplementation(() => order.push('addBall'));
        effect.update.mockImplementation(() => order.push('update'));

        rebuild_field(effect);

        expect(order[order.length - 1]).toBe('update');
    });

    test('adds exactly settings.count balls', () => {
        rebuild_field(effect);
        expect(effect.addBall).toHaveBeenCalledTimes(settings.count);
    });

    test('addBall is called with 5 arguments (x, y, z, strength, subtract)', () => {
        rebuild_field(effect);
        effect.addBall.mock.calls.forEach(call => {
            expect(call).toHaveLength(5);
        });
    });

    test('ball strength is positive', () => {
        rebuild_field(effect);
        effect.addBall.mock.calls.forEach(([_x, _y, _z, strength]) => {
            expect(strength).toBeGreaterThan(0);
        });
    });

    test('ball subtract is in range [25, 45]', () => {
        rebuild_field(effect);
        effect.addBall.mock.calls.forEach(([_x, _y, _z, _s, subtract]) => {
            expect(subtract).toBeGreaterThanOrEqual(25);
            expect(subtract).toBeLessThanOrEqual(45);
        });
    });
});

// ─── update_metaballs ────────────────────────────────────────────────────────

describe('update_metaballs', () => {
    let effect;
    beforeEach(() => { effect = make_effect(); });

    test('calls reset, addBall, and update', () => {
        update_metaballs(effect, 0);
        expect(effect.reset).toHaveBeenCalled();
        expect(effect.addBall).toHaveBeenCalledTimes(settings.count);
        expect(effect.update).toHaveBeenCalled();
    });

    test('ball x position is within expected range', () => {
        // x = 0.5 + (base[0] − 0.5) * spread + sin(…) * amplitude
        // base in [0.32, 0.68], spread = 1.0, amplitude in [0.05, 0.09]
        // max deviation: (0.68 − 0.5) + 0.09 = 0.27  ->  x in [0.23, 0.77]
        update_metaballs(effect, 1.0);
        effect.addBall.mock.calls.forEach(([x]) => {
            expect(x).toBeGreaterThanOrEqual(0.23 - 1e-9);
            expect(x).toBeLessThanOrEqual(0.77 + 1e-9);
        });
    });

    test('ball y position stays close to GROUND_HEIGHT (0.28)', () => {
        // y = 0.28 + sin(…) * (amplitude * 0.4 + 0.02)
        // max vertical offset: 0.09 × 0.4 + 0.02 = 0.056
        update_metaballs(effect, 1.0);
        effect.addBall.mock.calls.forEach(([_x, y]) => {
            expect(y).toBeGreaterThanOrEqual(0.28 - 0.056 - 1e-9);
            expect(y).toBeLessThanOrEqual(0.28 + 0.056 + 1e-9);
        });
    });

    test('ball z position is within expected range', () => {
        update_metaballs(effect, 1.0);
        effect.addBall.mock.calls.forEach(([_x, _y, z]) => {
            expect(z).toBeGreaterThanOrEqual(0.23 - 1e-9);
            expect(z).toBeLessThanOrEqual(0.77 + 1e-9);
        });
    });

    test('positions are deterministic for the same time value', () => {
        const calls_a = [], calls_b = [];
        const eff_a = { reset: vi.fn(), addBall: vi.fn((...a) => calls_a.push(a)), update: vi.fn() };
        const eff_b = { reset: vi.fn(), addBall: vi.fn((...a) => calls_b.push(a)), update: vi.fn() };

        update_metaballs(eff_a, 5.0);
        update_metaballs(eff_b, 5.0);

        expect(calls_a).toEqual(calls_b);
    });

    test('positions change over time (sinusoidal motion)', () => {
        const calls_t0 = [], calls_t1 = [];
        const eff0 = { reset: vi.fn(), addBall: vi.fn((...a) => calls_t0.push(a)), update: vi.fn() };
        const eff1 = { reset: vi.fn(), addBall: vi.fn((...a) => calls_t1.push(a)), update: vi.fn() };

        update_metaballs(eff0, 0);
        update_metaballs(eff1, 100); // far enough for visible change

        const allSame = calls_t0.every((call, i) =>
            call[0] === calls_t1[i][0] &&
            call[1] === calls_t1[i][1] &&
            call[2] === calls_t1[i][2],
        );
        expect(allSame).toBe(false);
    });

    test('spread = 0 keeps balls clustered around x = 0.5 and z = 0.5', () => {
        const original_spread = settings.spread;
        settings.spread = 0;

        update_metaballs(effect, 0);

        // With spread = 0 and time = 0: x = 0.5 + sin(phase) * amplitude
        // amplitude <=  0.09, so x in [0.41, 0.59]
        effect.addBall.mock.calls.forEach(([x, _y, z]) => {
            expect(x).toBeGreaterThanOrEqual(0.5 - 0.09 - 1e-9);
            expect(x).toBeLessThanOrEqual(0.5 + 0.09 + 1e-9);
            expect(z).toBeGreaterThanOrEqual(0.5 - 0.09 - 1e-9);
            expect(z).toBeLessThanOrEqual(0.5 + 0.09 + 1e-9);
        });

        settings.spread = original_spread; // restore
    });
});

// ─── update_light ────────────────────────────────────────────────────────────

describe('update_light', () => {
    function make_material() {
        return {
            uniforms: {
                u_light_position: { value: { copy: vi.fn() } },
                u_time: { value: 0 },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };

    test('sets u_time to the given time value', () => {
        const mat = make_material();
        update_light(mat, mock_camera, 3.14);
        expect(mat.uniforms.u_time.value).toBe(3.14);
    });

    test('u_time is updated correctly across multiple calls', () => {
        const mat = make_material();
        update_light(mat, mock_camera, 0);
        expect(mat.uniforms.u_time.value).toBe(0);

        update_light(mat, mock_camera, 99.5);
        expect(mat.uniforms.u_time.value).toBe(99.5);
    });

    test('calls copy() on u_light_position.value', () => {
        const mat = make_material();
        update_light(mat, mock_camera, 1.0);
        expect(mat.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });
});

// ─── create_metaballs ────────────────────────────────────────────────────────

describe('create_metaballs', () => {
    let mock_scene;
    beforeEach(() => { mock_scene = { add: vi.fn() }; });

    test('returns an object with effect and material', () => {
        const result = create_metaballs(mock_scene);
        expect(result).toHaveProperty('effect');
        expect(result).toHaveProperty('material');
    });

    test('adds the effect to the scene', () => {
        const { effect } = create_metaballs(mock_scene);
        expect(mock_scene.add).toHaveBeenCalledWith(effect);
    });

    test('sets effect.isolation to 50', () => {
        const { effect } = create_metaballs(mock_scene);
        expect(effect.isolation).toBe(50);
    });

    test('calls effect.scale.setScalar(3.0)', () => {
        const { effect } = create_metaballs(mock_scene);
        expect(effect.scale.setScalar).toHaveBeenCalledWith(3.0);
    });

    test('material contains all expected uniforms', () => {
        const { material } = create_metaballs(mock_scene);
        const expected_keys = [
            'u_light_position',
            'u_time',
            'u_glow_enabled',
            'u_glow_color',
            'u_color_hot',
            'u_color_cool',
            'u_noise_enabled',
            'u_noise_color_1',
            'u_noise_color_2',
            'u_bump_enabled',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_time starts at 0', () => {
        const { material } = create_metaballs(mock_scene);
        expect(material.uniforms.u_time.value).toBe(0.0);
    });

    test('u_glow_enabled starts enabled (1.0)', () => {
        const { material } = create_metaballs(mock_scene);
        expect(material.uniforms.u_glow_enabled.value).toBe(1.0);
    });

    test('u_noise_enabled starts enabled (1.0)', () => {
        const { material } = create_metaballs(mock_scene);
        expect(material.uniforms.u_noise_enabled.value).toBe(1.0);
    });

    test('u_bump_enabled starts enabled (1.0)', () => {
        const { material } = create_metaballs(mock_scene);
        expect(material.uniforms.u_bump_enabled.value).toBe(1.0);
    });
});
