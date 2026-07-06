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
        constructor(parameters = {}) {
            this.uniforms       = parameters.uniforms ?? {};
            this.vertexShader   = parameters.vertexShader ?? '';
            this.fragmentShader = parameters.fragmentShader ?? '';
            this.side           = parameters.side ?? 0;
        }
    }

    return { Vector3, Color, ShaderMaterial, DoubleSide: 2 };
});

vi.mock('three/addons/objects/MarchingCubes.js', () => {
    class MarchingCubes {
        constructor(_resolution, _material, _uvs, _colors, _max) {
            this.isolation = 80;
            this.scale     = { set: vi.fn(), setScalar: vi.fn() };
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

// ─── Fresh module instance per test ──────────────────────────────────────────
//
// metaballs.js keeps its wave/pool state (pool_head, current_wave_count, pausing, ...)
// in module-level variables, so tests must not share one import across cases -
// otherwise call order between tests would leak into the results. Re-importing
// after vi.resetModules() also clears rand.js's cache, so the seeded RNG
// restarts from the same seed every time - ball parameters stay deterministic.

let metaballs_module;
beforeEach(async () => {
    vi.resetModules();
    metaballs_module = await import('../metaballs.js');
});

function makeEffect() {
    return {
        reset:   vi.fn(),
        addBall: vi.fn(),
        update:  vi.fn(),
    };
}

// ─── settings (default values) ───────────────────────────────────────────────

describe('settings (default values)', () => {
    test('count is 100', () => expect(metaballs_module.settings.count).toBe(100));
    test('spread is 1.0', () => expect(metaballs_module.settings.spread).toBe(1.0));
    test('speed_factor is 0.003', () => expect(metaballs_module.settings.speed_factor).toBe(0.003));
    test('paused is false', () => expect(metaballs_module.settings.paused).toBe(false));
    test('max_count is 500', () => expect(metaballs_module.settings.max_count).toBe(500));
    test('flow_z_radius is 11', () => expect(metaballs_module.settings.flow_z_radius).toBe(11));
});

// ─── rebuildField ────────────────────────────────────────────────────────────

describe('rebuildField', () => {
    let effect;
    beforeEach(() => { effect = makeEffect(); });

    test('calls reset() first and update() last', () => {
        const order = [];
        effect.reset.mockImplementation(() => order.push('reset'));
        effect.addBall.mockImplementation(() => order.push('addBall'));
        effect.update.mockImplementation(() => order.push('update'));

        metaballs_module.rebuildField(effect);

        expect(order[0]).toBe('reset');
        expect(order[order.length - 1]).toBe('update');
    });

    test('adds no balls when the pool has no active balls yet', () => {
        metaballs_module.rebuildField(effect);
        expect(effect.addBall).not.toHaveBeenCalled();
    });
});

// ─── updateMetaballs ─────────────────────────────────────────────────────────

describe('updateMetaballs', () => {
    let effect;
    beforeEach(() => { effect = makeEffect(); });

    test('does nothing while paused', () => {
        metaballs_module.settings.paused = true;
        metaballs_module.updateMetaballs(effect, 0);
        expect(effect.reset).not.toHaveBeenCalled();
        expect(effect.addBall).not.toHaveBeenCalled();
        expect(effect.update).not.toHaveBeenCalled();
    });

    test('spawns exactly one ball on the very first call, at the crater', () => {
        metaballs_module.updateMetaballs(effect, 0);
        expect(effect.addBall).toHaveBeenCalledTimes(1);

        const [x, y, z, strength, subtract] = effect.addBall.mock.calls[0];
        expect(x).toBeCloseTo(0.5, 9);
        expect(y).toBeCloseTo(0.45, 9);
        expect(z).toBeCloseTo(0.5, 9);
        expect(strength).toBeGreaterThan(0);
        expect(subtract).toBeGreaterThanOrEqual(25);
        expect(subtract).toBeLessThanOrEqual(45);
    });

    test('does not spawn a second ball less than a second after the first', () => {
        metaballs_module.updateMetaballs(effect, 0);
        effect.addBall.mockClear();

        metaballs_module.updateMetaballs(effect, 0.5);
        expect(effect.addBall).toHaveBeenCalledTimes(1); // still just the 1 active ball, repositioned
    });

    test('spawns the next ball once a full second has elapsed', () => {
        metaballs_module.updateMetaballs(effect, 0);
        effect.addBall.mockClear();

        metaballs_module.updateMetaballs(effect, 1.0);
        expect(effect.addBall).toHaveBeenCalledTimes(2); // both active balls redrawn
    });

    test('a ball flows from the crater towards the ground over its lifetime', () => {
        metaballs_module.updateMetaballs(effect, 0); // ball #0 spawns at the crater
        effect.addBall.mockClear();

        metaballs_module.updateMetaballs(effect, 2000); // far past BALL_LIFETIME -> ball #0 fully descended, ball #1 spawns fresh
        const calls = effect.addBall.mock.calls;
        expect(calls).toHaveLength(2);

        const [x0, y0] = calls[0]; // ball #0: landed (life_fraction clamped to 1.0 regardless of its random speed_mult)
        expect(y0).toBeCloseTo(0.45 + (0.288 - 0.45) * 0.95, 9);
        const radius = (11 / 30) * 0.95;
        expect(x0).toBeGreaterThanOrEqual(0.5 - radius - 1e-9);
        expect(x0).toBeLessThanOrEqual(0.5 + radius + 1e-9);

        const [x1, y1, z1] = calls[1]; // ball #1: freshly spawned this same call
        expect(x1).toBeCloseTo(0.5, 9);
        expect(y1).toBeCloseTo(0.45, 9);
        expect(z1).toBeCloseTo(0.5, 9);
    });

    test('positions are deterministic for the same call sequence', async () => {
        metaballs_module.updateMetaballs(effect, 0);
        metaballs_module.updateMetaballs(effect, 2000);
        const calls_first_run = effect.addBall.mock.calls.map(call => call.slice());

        vi.resetModules();
        const second_metaballs_module = await import('../metaballs.js');
        const second_effect = makeEffect();
        second_metaballs_module.updateMetaballs(second_effect, 0);
        second_metaballs_module.updateMetaballs(second_effect, 2000);
        const calls_second_run = second_effect.addBall.mock.calls.map(call => call.slice());

        expect(calls_first_run).toEqual(calls_second_run);
    });
});

// ─── updateLight ─────────────────────────────────────────────────────────────

describe('updateLight', () => {
    function makeMaterial() {
        return {
            uniforms: {
                u_light_position: { value: { copy: vi.fn() } },
                u_time: { value: 0 },
            },
        };
    }

    const mock_camera = { matrixWorldInverse: {} };

    test('sets u_time to the given time value', () => {
        const material = makeMaterial();
        metaballs_module.updateLight(material, mock_camera, 3.14);
        expect(material.uniforms.u_time.value).toBe(3.14);
    });

    test('u_time is updated correctly across multiple calls', () => {
        const material = makeMaterial();
        metaballs_module.updateLight(material, mock_camera, 0);
        expect(material.uniforms.u_time.value).toBe(0);

        metaballs_module.updateLight(material, mock_camera, 99.5);
        expect(material.uniforms.u_time.value).toBe(99.5);
    });

    test('calls copy() on u_light_position.value', () => {
        const material = makeMaterial();
        metaballs_module.updateLight(material, mock_camera, 1.0);
        expect(material.uniforms.u_light_position.value.copy).toHaveBeenCalled();
    });
});

// ─── createMetaballs ─────────────────────────────────────────────────────────

describe('createMetaballs', () => {
    let mock_scene;
    beforeEach(() => { mock_scene = { add: vi.fn() }; });

    test('returns an object with effect and material', () => {
        const result = metaballs_module.createMetaballs(mock_scene);
        expect(result).toHaveProperty('effect');
        expect(result).toHaveProperty('material');
    });

    test('adds the effect to the scene', () => {
        const { effect } = metaballs_module.createMetaballs(mock_scene);
        expect(mock_scene.add).toHaveBeenCalledWith(effect);
    });

    test('sets effect.isolation to 50', () => {
        const { effect } = metaballs_module.createMetaballs(mock_scene);
        expect(effect.isolation).toBe(50);
    });

    test('calls effect.scale.set(30, 30, 30)', () => {
        const { effect } = metaballs_module.createMetaballs(mock_scene);
        expect(effect.scale.set).toHaveBeenCalledWith(30, 30, 30);
    });

    test('material contains all expected uniforms', () => {
        const { material } = metaballs_module.createMetaballs(mock_scene);
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
            'u_displacement',
        ];
        expected_keys.forEach(key => {
            expect(material.uniforms).toHaveProperty(key);
        });
    });

    test('u_time starts at 0', () => {
        const { material } = metaballs_module.createMetaballs(mock_scene);
        expect(material.uniforms.u_time.value).toBe(0.0);
    });

    test('u_glow_enabled starts enabled (1.0)', () => {
        const { material } = metaballs_module.createMetaballs(mock_scene);
        expect(material.uniforms.u_glow_enabled.value).toBe(1.0);
    });

    test('u_noise_enabled starts enabled (1.0)', () => {
        const { material } = metaballs_module.createMetaballs(mock_scene);
        expect(material.uniforms.u_noise_enabled.value).toBe(1.0);
    });

    test('u_bump_enabled starts enabled (1.0)', () => {
        const { material } = metaballs_module.createMetaballs(mock_scene);
        expect(material.uniforms.u_bump_enabled.value).toBe(1.0);
    });
});
