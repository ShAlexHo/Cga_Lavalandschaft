import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { expandIntoScene, revealScene } from '../scene_transition.js';
import { translate } from '../ui/language.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeAnimationMock() {
    return vi.fn(function animate(keyframes, options) {
        return { keyframes, options, finished: Promise.resolve() };
    });
}

function makePreview({ left = 100, top = 120, width = 800, height = 450 } = {}) {
    const frame = document.createElement('a');
    frame.getBoundingClientRect = () => ({ left, top, width, height });
    const image = document.createElement('img');
    image.src = 'data:image/jpeg;base64,AAAA';
    frame.appendChild(image);
    document.body.appendChild(frame);
    return { frame, image };
}

function overlay() {
    return document.querySelector('.scene-transition-overlay');
}

function spinner() {
    return document.querySelector('.scene-transition-spinner');
}

let reduced_motion = false;

beforeEach(() => {
    document.body.innerHTML = '';
    reduced_motion = false;
    Element.prototype.animate = makeAnimationMock();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduced_motion })));
});

afterEach(async () => {
    await revealScene(); // clears any overlay left over from the test
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('expandIntoScene', () => {
    test('puts the screenshot on top, growing from its frame to the whole window', async () => {
        const preview = makePreview();
        await expandIntoScene(preview);

        expect(overlay().src).toBe(preview.image.src);
        const [keyframes, options] = Element.prototype.animate.mock.calls[0];
        expect(keyframes[0]).toMatchObject({ left: '100px', top: '120px', width: '800px', height: '450px', borderRadius: '12px' });
        expect(keyframes[1]).toMatchObject({ left: '0px', top: '0px', width: `${window.innerWidth}px`, height: `${window.innerHeight}px`, borderRadius: '0px' });
        expect(options.fill).toBe('forwards');
        expect(options.duration).toBeGreaterThan(0);
    });

    test('shows a loading spinner once the screenshot is full size, labelled in the current language', async () => {
        let spinner_during_zoom = 'not checked';
        Element.prototype.animate = vi.fn(function animate() {
            spinner_during_zoom = spinner();
            return { finished: Promise.resolve() };
        });

        await expandIntoScene(makePreview());

        expect(spinner_during_zoom).toBeNull();
        expect(spinner().getAttribute('role')).toBe('status');
        expect(spinner().getAttribute('aria-label')).toBe(translate('scene.loading'));
    });

    test('skips the zoom when the user prefers reduced motion', async () => {
        reduced_motion = true;
        await expandIntoScene(makePreview());

        expect(Element.prototype.animate.mock.calls[0][1].duration).toBe(0);
    });

    test('reveals the scene on its own if nothing calls revealScene', async () => {
        vi.useFakeTimers();
        await expandIntoScene(makePreview());
        expect(overlay()).not.toBeNull();

        await vi.runAllTimersAsync();
        expect(overlay()).toBeNull();
        expect(spinner()).toBeNull();
    });
});

describe('revealScene', () => {
    test('fades the screenshot and the spinner out and removes them', async () => {
        await expandIntoScene(makePreview());
        const covering_overlay = overlay();
        const covering_spinner = spinner();
        Element.prototype.animate.mockClear();

        await revealScene();

        const faded_elements = Element.prototype.animate.mock.contexts;
        expect(faded_elements).toEqual([covering_overlay, covering_spinner]);
        for (const [keyframes] of Element.prototype.animate.mock.calls) expect(keyframes.at(-1)).toEqual({ opacity: 0 });
        expect(overlay()).toBeNull();
        expect(spinner()).toBeNull();
    });

    test('does nothing when no screenshot is covering the scene', async () => {
        await revealScene();
        expect(Element.prototype.animate).not.toHaveBeenCalled();
    });
});
