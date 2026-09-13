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
    stepInteractionSmoke: vi.fn(() => []),
    resetTouchSession: vi.fn(),
    isOnLava: vi.fn(() => false),
}));

import { createInteractionController } from '../interaction_controller.js';
import {
    settings, registerTouch, stepInteractionAnimation, stepInteractionSmoke, resetTouchSession, isOnLava,
} from '../../animation/interaction_animation.js';

function makeRenderer() {
    const domElement = document.createElement('div');
    domElement.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 600 });
    return { domElement };
}

function makeMesh() { return {}; }

beforeEach(() => {
    vi.clearAllMocks();
    isOnLava.mockReturnValue(false);
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

    test('a non-primary mouse button is ignored (does not start a drag or reset the touch session)', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 2, clientX: 400, clientY: 300 }));
        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        controller.step(0, {}, () => [{ x: 0, y: 0, z: 0 }]);

        expect(registerTouch).not.toHaveBeenCalled();
        expect(resetTouchSession).not.toHaveBeenCalled();
    });

    test('mousedown with the primary button resets the touch session for a fresh attempt', () => {
        const renderer = makeRenderer();
        createInteractionController(renderer, makeMesh());

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        expect(resetTouchSession).toHaveBeenCalledTimes(1);
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

    test('mouseup on window clears the down-state - raycasting still happens for hover, but no touch is registered', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        controller.step(0, {}, () => [{ x: 0, y: 0, z: 0 }]);

        expect(raycaster_instances[0].setFromCamera).toHaveBeenCalled();
        expect(registerTouch).not.toHaveBeenCalled();
    });

    test('step() only raycasts when interaction mode is enabled, regardless of whether the mouse is pressed', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());

        controller.step(0, {}, () => []); // disabled, never raycasts
        expect(raycaster_instances[0].setFromCamera).not.toHaveBeenCalled();

        settings.enabled = true;
        controller.step(0, {}, () => []); // enabled - raycasts for hover even though never pressed
        expect(raycaster_instances[0].setFromCamera).toHaveBeenCalled();
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

    test('when registerTouch signals a metaball squeeze, squeezeMetaballNear is called with the squeeze signal', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        const squeeze = { x: 1, y: 2, z: 3, shrink_increment: 0.2 };
        registerTouch.mockReturnValueOnce(squeeze);
        const squeeze_metaball_near = vi.fn();

        controller.step(5, {}, () => [], squeeze_metaball_near);

        expect(squeeze_metaball_near).toHaveBeenCalledWith(squeeze);
    });

    test('squeezeMetaballNear is not called when registerTouch does not signal a squeeze', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        registerTouch.mockReturnValueOnce(null);
        const squeeze_metaball_near = vi.fn();

        controller.step(5, {}, () => [], squeeze_metaball_near);

        expect(squeeze_metaball_near).not.toHaveBeenCalled();
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

    test('step() always advances the decay/smoke animation regardless of enabled/down state, returning both', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        const touch_points = [{ x: 1, y: 1, z: 1 }];
        const smoke_bursts = [{ x: 2, y: 2, z: 2, progress: 0.5 }];
        stepInteractionAnimation.mockReturnValueOnce(touch_points);
        stepInteractionSmoke.mockReturnValueOnce(smoke_bursts);

        const result = controller.step(3, {}, () => []);

        expect(stepInteractionAnimation).toHaveBeenCalledWith(3);
        expect(stepInteractionSmoke).toHaveBeenCalledWith(3);
        expect(result).toEqual({ touch_points, smoke_bursts, is_touching_lava: false });
    });

    test('is_touching_lava is true while pressing on a metaball that is genuinely on lava', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        isOnLava.mockReturnValueOnce(true);

        const { is_touching_lava } = controller.step(0, {}, () => [{ x: 1, y: 2, z: 3 }]);

        expect(is_touching_lava).toBe(true);
    });

    test('is_touching_lava is false while pressing off lava, or not pressing at all', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        isOnLava.mockReturnValueOnce(true);
        expect(controller.step(0, {}, () => [{ x: 1, y: 2, z: 3 }]).is_touching_lava).toBe(false);

        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));
        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        isOnLava.mockReturnValueOnce(false);
        expect(controller.step(0, {}, () => [{ x: 1, y: 2, z: 3 }]).is_touching_lava).toBe(false);
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

describe('hover cursor', () => {
    test('shows a pointer cursor when hovering over a metaball, without needing the mouse pressed down', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        isOnLava.mockReturnValueOnce(true);
        controller.step(0, {}, () => [{ x: 1, y: 2, z: 3, radius: 1, subtract: 0, isolation: 1 }]);

        expect(renderer.domElement.style.cursor).toBe('pointer');
    });

    test('resets the cursor when hovering off any metaball', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        isOnLava.mockReturnValueOnce(false);
        controller.step(0, {}, () => [{ x: 50, y: 0, z: 0, radius: 1, subtract: 0, isolation: 1 }]);

        expect(renderer.domElement.style.cursor).toBe('');
    });

    test('resets the cursor when there is no hit at all', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.style.cursor = 'pointer'; // left over from a previous hover

        controller.step(0, {}, () => []); // raycaster mock returns no hit by default

        expect(renderer.domElement.style.cursor).toBe('');
        expect(isOnLava).not.toHaveBeenCalled();
    });

    test('resets the cursor as soon as step() runs while interaction mode is disabled', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        renderer.domElement.style.cursor = 'pointer';

        controller.step(0, {}, () => []);

        expect(renderer.domElement.style.cursor).toBe('');
    });

    test('setEnabled(false) resets the cursor immediately', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        renderer.domElement.style.cursor = 'pointer';

        controller.setEnabled(false);

        expect(renderer.domElement.style.cursor).toBe('');
    });
});
