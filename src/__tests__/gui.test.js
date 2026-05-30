import { describe, test, expect, vi, beforeEach } from 'vitest';

// ─── Mock dat.gui ────────────────────────────────────────────────────────────

vi.mock('dat.gui', () => {
    return { GUI: vi.fn() };
});

import { GUI } from 'dat.gui';
import { setup_gui } from '../gui.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Creates a mock controller that supports method chaining (.name().onChange())
 * and captures the onChange callback for inspection.
 */
function make_controller() {
    const ctrl = {
        _onChange_cb: null,
        name: vi.fn().mockReturnThis(),
        onChange: vi.fn(function (cb) {
            ctrl._onChange_cb = cb;
            return ctrl;
        }),
    };
    return ctrl;
}

function make_folder() {
    return {
        add: vi.fn(() => make_controller()),
        addColor: vi.fn(() => make_controller()),
        open: vi.fn(),
    };
}

function make_mock_gui() {
    const gui = {
        add: vi.fn(() => make_controller()),
        addColor: vi.fn(() => make_controller()),
        addFolder: vi.fn(() => make_folder()),
    };
    GUI.mockImplementation(() => gui);
    return gui;
}

/** Creates a realistic material mock with all shader uniforms. */
function make_material() {
    const color = (hex) => ({
        getHexString: vi.fn().mockReturnValue(hex),
        set: vi.fn(),
    });
    return {
        uniforms: {
            u_color_hot: { value: color('e32117') },
            u_color_cool: { value: color('330808') },
            u_glow_color: { value: color('ff0d00') },
            u_noise_color_1: { value: color('7c3027') },
            u_noise_color_2: { value: color('d12405') },
            u_glow_enabled: { value: 1.0 },
            u_noise_enabled: { value: 1.0 },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.002 },
        },
    };
}

function make_ground() {
    return {
        visible: true,
        position: { y: -1.141 },
        material: {
            color: {
                getHexString: vi.fn().mockReturnValue('220500'),
                set: vi.fn(),
            },
            emissive: {
                set: vi.fn().mockReturnThis(),
                multiplyScalar: vi.fn().mockReturnThis(),
            },
        },
    };
}

// ─── setup_gui – structure ───────────────────────────────────────────────────

describe('setup_gui – structure', () => {
    let gui, material, effect, settings, rebuild;

    beforeEach(() => {
        gui = make_mock_gui();
        material = make_material();
        effect = { isolation: 50 };
        settings = { count: 16, spread: 1.0, speed_factor: 0.35, paused: false, max_count: 30 };
        rebuild = vi.fn();
    });

    test('creates a GUI instance', () => {
        setup_gui(effect, material, settings, rebuild);
        expect(GUI).toHaveBeenCalledOnce();
    });

    test('returns the GUI instance', () => {
        const result = setup_gui(effect, material, settings, rebuild);
        expect(result).toBe(gui);
    });

    test('creates the Metaballs folder', () => {
        setup_gui(effect, material, settings, rebuild);
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).toContain('Metaballs');
    });

    test('creates the Lavafarbe folder', () => {
        setup_gui(effect, material, settings, rebuild);
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).toContain('Lavafarbe');
    });

    test('creates the Noise folder', () => {
        setup_gui(effect, material, settings, rebuild);
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).toContain('Noise');
    });

    test('creates the Boden folder when ground is provided', () => {
        setup_gui(effect, material, settings, rebuild, make_ground());
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).toContain('Boden');
    });

    test('does not create the Boden folder without a ground argument', () => {
        setup_gui(effect, material, settings, rebuild);
        const folders = gui.addFolder.mock.calls.map(c => c[0]);
        expect(folders).not.toContain('Boden');
    });

    test('adds the paused toggle to the root GUI', () => {
        setup_gui(effect, material, settings, rebuild);
        const root_keys = gui.add.mock.calls.map(c => c[1]);
        expect(root_keys).toContain('paused');
    });
});

// ─── Metaballs folder ────────────────────────────────────────────────────────

describe('setup_gui – Metaballs folder', () => {
    let material, effect, settings, rebuild, metaballs_folder;

    beforeEach(() => {
        material = make_material();
        effect = { isolation: 50 };
        settings = { count: 16, spread: 1.0, speed_factor: 0.35, paused: false, max_count: 30 };
        rebuild = vi.fn();
        metaballs_folder = make_folder();
        const other = make_folder();

        const gui = {
            add: vi.fn(() => make_controller()),
            addFolder: vi.fn((name) => name === 'Metaballs' ? metaballs_folder : other),
        };
        GUI.mockImplementation(() => gui);
    });

    test('adds count control', () => {
        setup_gui(effect, material, settings, rebuild);
        const keys = metaballs_folder.add.mock.calls.map(c => c[1]);
        expect(keys).toContain('count');
    });

    test('adds isolation control on the effect object', () => {
        setup_gui(effect, material, settings, rebuild);
        const objects = metaballs_folder.add.mock.calls.map(c => c[0]);
        expect(objects).toContain(effect);
    });

    test('adds spread control', () => {
        setup_gui(effect, material, settings, rebuild);
        const keys = metaballs_folder.add.mock.calls.map(c => c[1]);
        expect(keys).toContain('spread');
    });

    test('adds speed_factor control', () => {
        setup_gui(effect, material, settings, rebuild);
        const keys = metaballs_folder.add.mock.calls.map(c => c[1]);
        expect(keys).toContain('speed_factor');
    });

    test('count onChange calls rebuild with effect', () => {
        let captured_cb = null;
        const count_ctrl = {
            name: vi.fn().mockReturnThis(),
            onChange: vi.fn(cb => { captured_cb = cb; return count_ctrl; }),
        };
        metaballs_folder.add = vi.fn((obj, key) =>
            key === 'count' ? count_ctrl : make_controller(),
        );

        setup_gui(effect, material, settings, rebuild);

        expect(captured_cb).toBeTypeOf('function');
        captured_cb();
        expect(rebuild).toHaveBeenCalledWith(effect);
    });
});

// ─── "Lavafarbe" folder – callbacks ────────────────────────────────────────────

describe('setup_gui – Lavafarbe folder callbacks', () => {
    let material, effect, settings, rebuild, colors_folder;

    beforeEach(() => {
        material = make_material();
        effect = { isolation: 50 };
        settings = { count: 16, spread: 1.0, speed_factor: 0.35, paused: false, max_count: 30 };
        rebuild = vi.fn();
        colors_folder = make_folder();
        const other = make_folder();

        const gui = {
            add: vi.fn(() => make_controller()),
            addFolder: vi.fn((name) => name === 'Lavafarbe' ? colors_folder : other),
        };
        GUI.mockImplementation(() => gui);
    });

    test('glow toggle sets u_glow_enabled to 0 when disabled', () => {
        let glow_cb = null;
        colors_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'gluehen') ctrl.onChange = vi.fn(cb => { glow_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);

        expect(glow_cb).toBeTypeOf('function');
        glow_cb(false);
        expect(material.uniforms.u_glow_enabled.value).toBe(0.0);
    });

    test('glow toggle sets u_glow_enabled to 1 when enabled', () => {
        let glow_cb = null;
        material.uniforms.u_glow_enabled.value = 0.0;

        colors_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'gluehen') ctrl.onChange = vi.fn(cb => { glow_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);
        glow_cb(true);
        expect(material.uniforms.u_glow_enabled.value).toBe(1.0);
    });

    test('bright color picker calls u_color_hot.value.set', () => {
        let hot_cb = null;
        colors_folder.addColor = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'farbe_hell') ctrl.onChange = vi.fn(cb => { hot_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);

        expect(hot_cb).toBeTypeOf('function');
        hot_cb('#ff0000');
        expect(material.uniforms.u_color_hot.value.set).toHaveBeenCalledWith('#ff0000');
    });

    test('dark color picker calls u_color_cool.value.set', () => {
        let cool_cb = null;
        colors_folder.addColor = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'farbe_dunkel') ctrl.onChange = vi.fn(cb => { cool_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);

        expect(cool_cb).toBeTypeOf('function');
        cool_cb('#220000');
        expect(material.uniforms.u_color_cool.value.set).toHaveBeenCalledWith('#220000');
    });
});

// ─── Noise folder – callbacks ────────────────────────────────────────────────

describe('setup_gui – Noise folder callbacks', () => {
    let material, effect, settings, rebuild, noise_folder;

    beforeEach(() => {
        material = make_material();
        effect = { isolation: 50 };
        settings = { count: 16, spread: 1.0, speed_factor: 0.35, paused: false, max_count: 30 };
        rebuild = vi.fn();
        noise_folder = make_folder();
        const other = make_folder();

        const gui = {
            add: vi.fn(() => make_controller()),
            addFolder: vi.fn((name) => name === 'Noise' ? noise_folder : other),
        };
        GUI.mockImplementation(() => gui);
    });

    test('noise toggle sets u_noise_enabled to 0 when disabled', () => {
        let noise_cb = null;
        noise_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'noise') ctrl.onChange = vi.fn(cb => { noise_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);
        noise_cb(false);
        expect(material.uniforms.u_noise_enabled.value).toBe(0.0);
    });

    test('bump toggle sets u_bump_enabled to 0 when disabled', () => {
        let bump_cb = null;
        noise_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'bumping') ctrl.onChange = vi.fn(cb => { bump_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild);
        bump_cb(false);
        expect(material.uniforms.u_bump_enabled.value).toBe(0.0);
    });
});

// ─── "Boden" folder – callbacks ────────────────────────────────────────────────

describe('setup_gui – Boden folder callbacks', () => {
    let material, effect, settings, rebuild, ground, ground_folder;

    beforeEach(() => {
        material = make_material();
        effect = { isolation: 50 };
        settings = { count: 16, spread: 1.0, speed_factor: 0.35, paused: false, max_count: 30 };
        rebuild = vi.fn();
        ground = make_ground();
        ground_folder = make_folder();
        const other = make_folder();

        const gui = {
            add: vi.fn(() => make_controller()),
            addFolder: vi.fn((name) => name === 'Boden' ? ground_folder : other),
        };
        GUI.mockImplementation(() => gui);
    });

    test('visibility toggle sets ground.visible', () => {
        let visible_cb = null;
        ground_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'sichtbar') ctrl.onChange = vi.fn(cb => { visible_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild, ground);

        expect(visible_cb).toBeTypeOf('function');
        visible_cb(false);
        expect(ground.visible).toBe(false);
    });

    test('height slider updates ground.position.y', () => {
        let height_cb = null;
        ground_folder.add = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'hoehe') ctrl.onChange = vi.fn(cb => { height_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild, ground);

        expect(height_cb).toBeTypeOf('function');
        height_cb(-1.5);
        expect(ground.position.y).toBe(-1.5);
    });

    test('color picker sets ground.material.color and emissive', () => {
        let color_cb = null;
        ground_folder.addColor = vi.fn((obj, key) => {
            const ctrl = make_controller();
            if (key === 'farbe') ctrl.onChange = vi.fn(cb => { color_cb = cb; return ctrl; });
            return ctrl;
        });

        setup_gui(effect, material, settings, rebuild, ground);

        expect(color_cb).toBeTypeOf('function');
        color_cb('#550000');
        expect(ground.material.color.set).toHaveBeenCalledWith('#550000');
        expect(ground.material.emissive.set).toHaveBeenCalledWith('#550000');
    });
});
