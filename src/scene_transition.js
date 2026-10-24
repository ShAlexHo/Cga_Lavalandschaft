import { translate } from './ui/language.js';

const EXPAND_DURATION_MILLISECONDS = 900;
const REVEAL_DURATION_MILLISECONDS = 500;
const SPINNER_FADE_OUT_MILLISECONDS = 200;
const REVEAL_FALLBACK_MILLISECONDS = 5000;
const EXPAND_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

let overlay = null;
let spinner = null;
let fallback_timer = null;

function animationDuration(milliseconds) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : milliseconds;
}

// Grows the screenshot from its frame to the whole window. It then stays on top, hiding the scene
// while it mounts and renders its first frames, until revealScene() fades it out.
export async function expandIntoScene({ frame, image }) {
    const rect = frame.getBoundingClientRect();
    const start_filter = getComputedStyle(image).filter;

    overlay = document.createElement('img');
    overlay.src = image.currentSrc || image.src;
    overlay.alt = '';
    overlay.className = 'scene-transition-overlay';
    document.body.appendChild(overlay);

    await overlay.animate([
        {
            left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
            borderRadius: '12px', filter: start_filter === 'none' ? 'brightness(1)' : start_filter,
        },
        {
            left: '0px', top: '0px', width: `${window.innerWidth}px`, height: `${window.innerHeight}px`,
            borderRadius: '0px', filter: 'brightness(1)',
        },
    ], { duration: animationDuration(EXPAND_DURATION_MILLISECONDS), easing: EXPAND_EASING, fill: 'forwards' }).finished;

    spinner = document.createElement('div');
    spinner.className = 'scene-transition-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', translate('scene.loading'));
    document.body.appendChild(spinner);

    // never leave the screenshot stuck on top if the scene doesn't report back
    fallback_timer = setTimeout(revealScene, REVEAL_FALLBACK_MILLISECONDS);
}

export async function revealScene() {
    if (!overlay && !spinner) return;
    clearTimeout(fallback_timer);
    const fading_overlay = overlay;
    const fading_spinner = spinner;
    overlay = null;
    spinner = null;

    await Promise.all([
        fading_overlay && fadeOutAndRemove(fading_overlay, REVEAL_DURATION_MILLISECONDS),
        fading_spinner && fadeOutAndRemove(fading_spinner, SPINNER_FADE_OUT_MILLISECONDS),
    ]);
}

async function fadeOutAndRemove(element, milliseconds) {
    await element.animate(
        [{ opacity: getComputedStyle(element).opacity }, { opacity: 0 }],
        { duration: animationDuration(milliseconds), easing: 'ease', fill: 'forwards' },
    ).finished;
    element.remove();
}
