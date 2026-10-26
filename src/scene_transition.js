import { translate } from './ui/language.js';

const ZOOM_DURATION_MILLISECONDS = 900;
const REVEAL_DURATION_MILLISECONDS = 500;
const SPINNER_FADE_OUT_MILLISECONDS = 200;
const REVEAL_FALLBACK_MILLISECONDS = 5000;
const ZOOM_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
const PREVIEW_BORDER_RADIUS = '12px';
const SHARP = 'blur(0px)';
const LOADING_BLUR_PIXELS = 8;
const BLUR_REACH_FACTOR = 3;
const SHRINK_BLUR = 'blur(6px)';
const SHRINK_BLUR_OFFSET = 0.4;

let overlay = null;
let spinner = null;
let hidden_frame = null;
let reveal_fallback_timer = null;
let returning_overlay = null;
let returning_scene_name = null;
let return_finished = Promise.resolve();
let resolveReturnFinished = null;

function animationDuration(milliseconds) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : milliseconds;
}

export async function expandIntoScene({ frame, image }) {
    const bounds = frame.getBoundingClientRect();
    const start_filter = getComputedStyle(image).filter;

    overlay = document.createElement('img');
    overlay.src = image.currentSrc || image.src;
    overlay.alt = '';
    overlay.className = 'scene-transition-overlay';
    document.body.appendChild(overlay);
    frame.style.visibility = 'hidden';
    hidden_frame = frame;

    const frame_keyframe = {
        ...frameKeyframe(bounds), filter: `${start_filter === 'none' ? 'brightness(1)' : start_filter} ${SHARP}`, transform: 'scale(1)',
    };
    const loading_keyframe = {
        ...fullWindowKeyframe(), filter: `brightness(1) blur(${LOADING_BLUR_PIXELS}px)`, transform: `scale(${edgeHidingScale()})`,
    };

    await overlay.animate([frame_keyframe, loading_keyframe], {
        duration: animationDuration(ZOOM_DURATION_MILLISECONDS), easing: ZOOM_EASING, fill: 'forwards',
    }).finished;

    spinner = document.createElement('div');
    spinner.className = 'scene-transition-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', translate('scene.loading'));
    document.body.appendChild(spinner);

    reveal_fallback_timer = setTimeout(revealScene, REVEAL_FALLBACK_MILLISECONDS);
}

export async function revealScene() {
    if (!overlay && !spinner) return;
    clearTimeout(reveal_fallback_timer);
    const fading_overlay = overlay;
    const fading_spinner = spinner;
    overlay = null;
    spinner = null;
    if (hidden_frame) hidden_frame.style.visibility = '';
    hidden_frame = null;

    await Promise.all([
        fading_overlay && fadeOutAndRemove(fading_overlay, REVEAL_DURATION_MILLISECONDS),
        fading_spinner && fadeOutAndRemove(fading_spinner, SPINNER_FADE_OUT_MILLISECONDS),
    ]);
}

export function coverWithScreenshot(screenshot_url, scene_name) {
    returning_overlay?.remove();
    returning_overlay = document.createElement('img');
    returning_overlay.src = screenshot_url;
    returning_overlay.alt = '';
    returning_overlay.className = 'scene-transition-overlay';
    Object.assign(returning_overlay.style, fullWindowKeyframe());
    document.body.appendChild(returning_overlay);
    returning_scene_name = scene_name;
    resolveReturnFinished?.();
    return_finished = new Promise(resolve => { resolveReturnFinished = resolve; });
}

export function whenReturnFinished() {
    return return_finished;
}

export async function shrinkIntoPreview() {
    if (!returning_overlay) return;
    const shrinking_overlay = returning_overlay;
    const frame = document.querySelector(`[data-scene-preview="${returning_scene_name}"]`);
    const resolveShrinkFinished = resolveReturnFinished;
    returning_overlay = null;
    returning_scene_name = null;
    resolveReturnFinished = null;

    if (frame) await shrinkOntoFrame(shrinking_overlay, frame);
    else await fadeOutAndRemove(shrinking_overlay, REVEAL_DURATION_MILLISECONDS);
    resolveShrinkFinished();
}

async function shrinkOntoFrame(shrinking_overlay, frame) {
    frame.style.visibility = 'hidden';
    await settlePreview(frame);
    await shrinking_overlay.animate([
        { ...fullWindowKeyframe(), filter: SHARP },
        { filter: SHRINK_BLUR, offset: SHRINK_BLUR_OFFSET },
        { ...frameKeyframe(frame.getBoundingClientRect()), filter: SHARP },
    ], {
        duration: animationDuration(ZOOM_DURATION_MILLISECONDS), easing: ZOOM_EASING, fill: 'forwards',
    }).finished;

    frame.style.visibility = '';
    shrinking_overlay.remove();
}

async function settlePreview(frame) {
    await frame.querySelector('img')?.decode?.().catch(() => {});
    await new Promise(resolve => requestAnimationFrame(resolve));
}

function edgeHidingScale() {
    return 1 + (2 * BLUR_REACH_FACTOR * LOADING_BLUR_PIXELS) / Math.min(window.innerWidth, window.innerHeight);
}

function frameKeyframe(bounds) {
    return {
        left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
        borderRadius: PREVIEW_BORDER_RADIUS,
    };
}

function fullWindowKeyframe() {
    return { left: '0px', top: '0px', width: `${window.innerWidth}px`, height: `${window.innerHeight}px`, borderRadius: '0px' };
}

async function fadeOutAndRemove(element, milliseconds) {
    await element.animate(
        [{ opacity: getComputedStyle(element).opacity }, { opacity: 0 }],
        { duration: animationDuration(milliseconds), easing: 'ease', fill: 'forwards' },
    ).finished;
    element.remove();
}
