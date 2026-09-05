import { describe, test, expect, vi, beforeEach } from 'vitest';

const { raycaster_instances } = vi.hoisted(() => ({ raycaster_instances: [] }));

vi.mock('three', () => {
    class Vector2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    }
    class Raycaster {
        constructor() {
            this.setFromCamera = vi.fn();
            this.intersectObject = vi.fn(() => []);
            raycaster_instances.push(this);
        }
    }
    return { Vector2, Raycaster };
});

vi.mock('../../animation/interaction_animation.js', () => ({
    settings: { enabled: false },
    registerTouch: vi.fn(),
    stepInteractionAnimation: vi.fn(() => []),
    resetDwellTracking: vi.fn(),
}));

import { createInteractionController } from '../interaction_controller.js';
import { settings, registerTouch, stepInteractionAnimation, resetDwellTracking } from '../../animation/interaction_animation.js';

function makeRenderer() {
    const domElement = document.createElement('div');
    domElement.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 600 });
    return { domElement };
}

function makeMesh() { return {}; }

beforeEach(() => {
    vi.clearAllMocks();
    raycaster_instances.length = 0;
    settings.enabled = false;
});

describe('createInteractionController', () => {
    test('mousedown with the primary button sets the down-state and records pointer coordinates', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));
        controller.step(0, {}, () => []);

        expect(raycaster_instances[0].setFromCamera).toHaveBeenCalledWith(expect.objectContaining({ x: 0, y: 0 }), {});
    });

    test('a non-primary mouse button is ignored', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 2, clientX: 400, clientY: 300 }));
        controller.step(0, {}, () => []);

        expect(raycaster_instances[0].setFromCamera).not.toHaveBeenCalled();
        expect(resetDwellTracking).not.toHaveBeenCalled();
    });

    test('mousedown with the primary button resets dwell tracking for a fresh attempt', () => {
        const renderer = makeRenderer();
        createInteractionController(renderer, makeMesh());

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        expect(resetDwellTracking).toHaveBeenCalledTimes(1);
    });

    test('mousemove updates the tracked pointer position regardless of down-state', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: 0 }));
        renderer.domElement.dispatchEvent(new MouseEvent('mousemove', { clientX: 800, clientY: 0 }));
        controller.step(0, {}, () => []);

        expect(raycaster_instances[0].setFromCamera).toHaveBeenCalledWith(expect.objectContaining({ x: 1, y: 1 }), {});
    });

    test('mouseup on window clears the down-state', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        controller.step(0, {}, () => []);

        expect(raycaster_instances[0].setFromCamera).not.toHaveBeenCalled();
    });

    test('step() only raycasts when interaction mode is enabled and the mouse is down', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());

        controller.step(0, {}, () => []); // disabled, never pressed down
        expect(raycaster_instances[0].setFromCamera).not.toHaveBeenCalled();

        settings.enabled = true;
        controller.step(0, {}, () => []); // enabled, but still never pressed down
        expect(raycaster_instances[0].setFromCamera).not.toHaveBeenCalled();
    });

    test('on a hit, registerTouch is called with the hit point, the lazily-evaluated metaball positions and the camera position', () => {
        const renderer = makeRenderer();
        const mesh = makeMesh();
        const controller = createInteractionController(renderer, mesh);
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        const hit_point = { x: 1, y: 2, z: 3 };
        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: hit_point }]);
        const get_positions = vi.fn(() => [{ x: 0, y: 0, z: 0 }]);
        const camera = { position: { x: 0, y: 0, z: 10 } };

        controller.step(5, camera, get_positions);

        expect(raycaster_instances[0].intersectObject).toHaveBeenCalledWith(mesh, false);
        expect(get_positions).toHaveBeenCalledTimes(1);
        expect(registerTouch).toHaveBeenCalledWith(5, hit_point, [{ x: 0, y: 0, z: 0 }], camera.position);
    });

    test('when registerTouch signals a metaball to remove, removeMetaballNear is called with its position', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        const remove_position = { x: 1, y: 2, z: 3 };
        registerTouch.mockReturnValueOnce(remove_position);
        const remove_metaball_near = vi.fn();

        controller.step(5, {}, () => [], remove_metaball_near);

        expect(remove_metaball_near).toHaveBeenCalledWith(remove_position);
    });

    test('removeMetaballNear is not called when registerTouch does not signal a removal', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        registerTouch.mockReturnValueOnce(null);
        const remove_metaball_near = vi.fn();

        controller.step(5, {}, () => [], remove_metaball_near);

        expect(remove_metaball_near).not.toHaveBeenCalled();
    });

    test('the metaball-position thunk is not evaluated when there is no hit', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        const get_positions = vi.fn(() => []);
        controller.step(0, {}, get_positions);

        expect(get_positions).not.toHaveBeenCalled();
        expect(registerTouch).not.toHaveBeenCalled();
    });

    test('step() always advances the decay animation regardless of enabled/down state', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        controller.step(3, {}, () => []);
        expect(stepInteractionAnimation).toHaveBeenCalledWith(3);
    });

    test('getEnabled/setEnabled forward to the animation module settings', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        expect(controller.getEnabled()).toBe(false);
        controller.setEnabled(true);
        expect(controller.getEnabled()).toBe(true);
        expect(settings.enabled).toBe(true);
    });
});
