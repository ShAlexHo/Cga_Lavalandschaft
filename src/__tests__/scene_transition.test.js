import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { expandIntoScene, revealScene, coverWithScreenshot, shrinkIntoPreview, whenReturnFinished } from '../scene_transition.js';
import { translate } from '../ui/language.js';

function makeAnimationMock() {
    return vi.fn(function animate(keyframes, options) {
        return { keyframes, options, finished: Promise.resolve() };
    });
}

function makePreview({ left = 100, top = 120, width = 800, height = 450 } = {}) {
    const frame = document.createElement('a');
    frame.getBoundingClientRect = () => ({ left, top, width, height, bottom: top + height });
    const image = document.createElement('img');
    image.src = 'data:image/jpeg;base64,AAAA';
    frame.appendChild(image);
    document.body.appendChild(frame);
    return { frame, image };
}

function makeReturnPreview(scene_name, bounds = {}) {
    const preview = makePreview(bounds);
    preview.frame.dataset.scenePreview = scene_name;
    return preview;
}

const SCREENSHOT_URL = 'data:image/png;base64,BBBB';

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
    await revealScene();
    await shrinkIntoPreview();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

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

    test('blurs the screenshot while it grows, so the upscaled image never looks pixelated', async () => {
        await expandIntoScene(makePreview());

        const [keyframes] = Element.prototype.animate.mock.calls[0];
        expect(keyframes[0].filter).toContain('blur(0px)');
        expect(keyframes[1].filter).toContain('blur(8px)');
    });

    test('enlarges the blurred full-window screenshot just enough to push its soft edges out of the window', async () => {
        await expandIntoScene(makePreview());

        const [keyframes] = Element.prototype.animate.mock.calls[0];
        const scale = Number(keyframes[1].transform.match(/scale\(([\d.]+)\)/)[1]);
        expect(keyframes[0].transform).toBe('scale(1)');
        expect((scale - 1) * Math.min(window.innerWidth, window.innerHeight) / 2).toBeGreaterThanOrEqual(3 * 8);
    });

    test('moves and grows a small, off-centre preview in a single motion', async () => {
        await expandIntoScene(makePreview({ left: 100, top: 600, width: 400, height: 225 }));

        expect(Element.prototype.animate).toHaveBeenCalledTimes(1);
        const [keyframes] = Element.prototype.animate.mock.calls[0];
        expect(keyframes[0]).toMatchObject({ left: '100px', top: '600px', width: '400px', height: '225px' });
        expect(keyframes[1]).toMatchObject({ left: '0px', top: '0px', width: `${window.innerWidth}px` });
    });

    test('hides the original preview while the screenshot is lifted off it, and restores it if the scene never shows', async () => {
        const preview = makePreview();
        await expandIntoScene(preview);
        expect(preview.frame.style.visibility).toBe('hidden');

        await revealScene();
        expect(preview.frame.style.visibility).toBe('');
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

describe('coverWithScreenshot', () => {
    test('covers the whole window with the scene’s screenshot', () => {
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');

        expect(overlay().src).toBe(SCREENSHOT_URL);
        expect(overlay().style).toMatchObject({ left: '0px', top: '0px', width: `${window.innerWidth}px`, height: `${window.innerHeight}px` });
    });

    test('replaces an earlier cover instead of stacking a second one', () => {
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');
        coverWithScreenshot(SCREENSHOT_URL, 'noise-scene');

        expect(document.querySelectorAll('.scene-transition-overlay')).toHaveLength(1);
    });
});

describe('shrinkIntoPreview', () => {
    test('shrinks the screenshot from the whole window onto the scene’s preview, then hands over to it', async () => {
        const preview = makeReturnPreview('main-scene');
        let visibility_during_shrink = 'not checked';
        Element.prototype.animate = vi.fn(function animate(keyframes, options) {
            visibility_during_shrink = preview.frame.style.visibility;
            return { keyframes, options, finished: Promise.resolve() };
        });
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');

        await shrinkIntoPreview();

        const [[keyframes, options]] = Element.prototype.animate.mock.calls;
        expect(keyframes[0]).toMatchObject({ left: '0px', top: '0px', width: `${window.innerWidth}px`, borderRadius: '0px', filter: 'blur(0px)' });
        expect(keyframes[1].filter).toBe('blur(6px)');
        expect(keyframes.at(-1)).toMatchObject({ left: '100px', top: '120px', width: '800px', height: '450px', borderRadius: '12px', filter: 'blur(0px)' });
        expect(options.duration).toBeGreaterThan(0);
        expect(visibility_during_shrink).toBe('hidden');
        expect(preview.frame.style.visibility).toBe('');
        expect(overlay()).toBeNull();
    });

    test('shrinks onto a small, off-centre preview in a single motion', async () => {
        makeReturnPreview('noise-scene', { left: 100, top: 600, width: 400, height: 225 });
        coverWithScreenshot(SCREENSHOT_URL, 'noise-scene');

        await shrinkIntoPreview();

        expect(Element.prototype.animate).toHaveBeenCalledTimes(1);
        expect(Element.prototype.animate.mock.calls[0][0].at(-1)).toMatchObject({ left: '100px', top: '600px', width: '400px', height: '225px' });
    });

    test('only moves the preview of the scene that was left', async () => {
        const other_preview = makeReturnPreview('metaballs-scene');
        makeReturnPreview('noise-scene', { left: 30 });
        coverWithScreenshot(SCREENSHOT_URL, 'noise-scene');

        await shrinkIntoPreview();

        expect(Element.prototype.animate.mock.calls[0][0].at(-1)).toMatchObject({ left: '30px' });
        expect(other_preview.frame.style.visibility).toBe('');
    });

    test('first scrolls a preview that lies outside the window into view, so the screenshot lands where it can be seen', async () => {
        const preview = makeReturnPreview('ground-scene', { top: window.innerHeight + 400 });
        preview.frame.scrollIntoView = vi.fn(() => {
            preview.frame.getBoundingClientRect = () => ({ left: 100, top: 200, width: 800, height: 450, bottom: 650 });
        });
        coverWithScreenshot(SCREENSHOT_URL, 'ground-scene');

        await shrinkIntoPreview();

        expect(preview.frame.scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
        expect(Element.prototype.animate.mock.calls[0][0].at(-1)).toMatchObject({ top: '200px' });
    });

    test('leaves the page where it is when the preview is already visible', async () => {
        const preview = makeReturnPreview('ground-scene');
        preview.frame.scrollIntoView = vi.fn();
        coverWithScreenshot(SCREENSHOT_URL, 'ground-scene');

        await shrinkIntoPreview();

        expect(preview.frame.scrollIntoView).not.toHaveBeenCalled();
    });

    test('fades the screenshot out when the preview cannot be found', async () => {
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');

        await shrinkIntoPreview();

        expect(Element.prototype.animate.mock.calls[0][0].at(-1)).toEqual({ opacity: 0 });
        expect(overlay()).toBeNull();
    });

    test('skips the shrinking when the user prefers reduced motion', async () => {
        reduced_motion = true;
        makeReturnPreview('main-scene');
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');

        await shrinkIntoPreview();

        expect(Element.prototype.animate.mock.calls[0][1].duration).toBe(0);
    });

    test('lets others wait until the screenshot has settled into its preview', async () => {
        makeReturnPreview('main-scene');
        coverWithScreenshot(SCREENSHOT_URL, 'main-scene');
        let is_finished = false;
        whenReturnFinished().then(() => { is_finished = true; });

        await Promise.resolve();
        expect(is_finished).toBe(false);

        await shrinkIntoPreview();
        await Promise.resolve();
        expect(is_finished).toBe(true);
    });

    test('does nothing without a cover', async () => {
        makeReturnPreview('main-scene');
        await shrinkIntoPreview();
        expect(Element.prototype.animate).not.toHaveBeenCalled();
    });
});
