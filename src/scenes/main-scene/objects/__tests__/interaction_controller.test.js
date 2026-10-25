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
import { INTERACTION_AUTO_TOUCH_MIN_INTERVAL, INTERACTION_AUTO_TOUCH_MAX_INTERVAL, INTERACTION_AUTO_TOUCH_HOLD_DURATION } from '../../config.js';

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
        const getPositions = vi.fn(() => [{ x: 0, y: 0, z: 0 }]);
        const camera = { position: { x: 0, y: 0, z: 10 } };

        controller.step(5, camera, getPositions);

        expect(raycaster_instances[0].intersectObject).toHaveBeenCalledWith(mesh, false);
        expect(getPositions).toHaveBeenCalledTimes(1);
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
        const squeezeMetaballNear = vi.fn();

        controller.step(5, {}, () => [], squeezeMetaballNear);

        expect(squeezeMetaballNear).toHaveBeenCalledWith(squeeze);
    });

    test('squeezeMetaballNear is not called when registerTouch does not signal a squeeze', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        raycaster_instances[0].intersectObject.mockReturnValueOnce([{ point: { x: 1, y: 2, z: 3 } }]);
        registerTouch.mockReturnValueOnce(null);
        const squeezeMetaballNear = vi.fn();

        controller.step(5, {}, () => [], squeezeMetaballNear);

        expect(squeezeMetaballNear).not.toHaveBeenCalled();
    });

    test('the metaball-position thunk is not evaluated when there is no hit', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;
        renderer.domElement.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 400, clientY: 300 }));

        const getPositions = vi.fn(() => []);
        controller.step(0, {}, getPositions);

        expect(getPositions).not.toHaveBeenCalled();
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

describe('auto touch (autonomous mode)', () => {
    test('does not register a touch before the countdown elapses', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());

        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [{ x: 1, y: 2, z: 3 }], undefined, 1);

        expect(registerTouch).not.toHaveBeenCalled();
    });

    test('registers a touch on one of the active metaballs once the countdown elapses, resetting the touch session first', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        const metaballs = [{ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }];
        const camera = { position: { x: 0, y: 0, z: 10 } };

        controller.step(7, camera, () => metaballs, undefined, INTERACTION_AUTO_TOUCH_MAX_INTERVAL);

        expect(registerTouch).toHaveBeenCalledTimes(1);
        const [call_time, call_target, call_metaballs, call_camera_position] = registerTouch.mock.calls[0];
        expect(call_time).toBe(7);
        expect(metaballs).toContain(call_target);
        expect(call_metaballs).toBe(metaballs);
        expect(call_camera_position).toBe(camera.position);
        expect(resetTouchSession).toHaveBeenCalled();
    });

    test('holds the simulated press across multiple frames for INTERACTION_AUTO_TOUCH_HOLD_DURATION seconds', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        const metaballs = [{ x: 1, y: 2, z: 3 }];
        const camera = { position: { x: 0, y: 0, z: 10 } };
        const frame_delta = INTERACTION_AUTO_TOUCH_HOLD_DURATION / 4;

        let total = 0;
        while (registerTouch.mock.calls.length === 0 && total <= INTERACTION_AUTO_TOUCH_MAX_INTERVAL) {
            controller.step(total, camera, () => metaballs, undefined, frame_delta);
            total += frame_delta;
        }
        expect(registerTouch).toHaveBeenCalledTimes(1); // just started

        controller.step(total, camera, () => metaballs, undefined, frame_delta);
        expect(registerTouch).toHaveBeenCalledTimes(2);
        expect(registerTouch.mock.calls[1][1]).toBe(registerTouch.mock.calls[0][1]); // same target throughout

        controller.step(total, camera, () => metaballs, undefined, frame_delta);
        expect(registerTouch).toHaveBeenCalledTimes(3);

        controller.step(total, camera, () => metaballs, undefined, frame_delta); // crosses the hold duration - fires once more, then ends
        expect(registerTouch).toHaveBeenCalledTimes(4);

        controller.step(total, camera, () => metaballs, undefined, frame_delta); // press has ended
        expect(registerTouch).toHaveBeenCalledTimes(4);
    });

    test('forwards a metaball squeeze from an auto touch, just like a real one', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        const squeeze = { x: 1, y: 2, z: 3, shrink_increment: 0.1 };
        registerTouch.mockReturnValueOnce(squeeze);
        const squeezeMetaballNear = vi.fn();

        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [{ x: 1, y: 2, z: 3 }], squeezeMetaballNear, INTERACTION_AUTO_TOUCH_MAX_INTERVAL);

        expect(squeezeMetaballNear).toHaveBeenCalledWith(squeeze);
    });

    test('does not register a touch when there are no active metaballs, even once the countdown elapses', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());

        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [], undefined, INTERACTION_AUTO_TOUCH_MAX_INTERVAL);

        expect(registerTouch).not.toHaveBeenCalled();
    });

    test('never auto-fires while interaction mode is enabled', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());
        settings.enabled = true;

        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [{ x: 1, y: 2, z: 3 }], undefined, INTERACTION_AUTO_TOUCH_MAX_INTERVAL * 10);

        expect(registerTouch).not.toHaveBeenCalled();
    });

    test('the countdown restarts once returning from interaction mode back to autonomous mode', () => {
        const renderer = makeRenderer();
        const controller = createInteractionController(renderer, makeMesh());

        settings.enabled = true;
        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [{ x: 1, y: 2, z: 3 }], undefined, INTERACTION_AUTO_TOUCH_MAX_INTERVAL);
        settings.enabled = false;

        // the countdown just restarted, so even this much elapsed real time (just under the floor of a fresh interval) should not fire yet
        controller.step(0, { position: { x: 0, y: 0, z: 0 } }, () => [{ x: 1, y: 2, z: 3 }], undefined, INTERACTION_AUTO_TOUCH_MIN_INTERVAL - 1);

        expect(registerTouch).not.toHaveBeenCalled();
    });
});
