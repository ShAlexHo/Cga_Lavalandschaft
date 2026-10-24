<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { scene_screenshot_url } from '../scene_screenshot.js';
import { expandIntoScene } from '../scene_transition.js';
import { current_language, localize } from '../language_state.js';
import { LANGUAGES, setLanguage } from '../ui/language.js';
import scene_preview_url from '../assets/scene_preview.jpg';
import GitHubIcon from '../components/GitHubIcon.vue';

const REPOSITORY_URL = 'https://github.com/ShAlexHo/Cga_Lavalandschaft';
const AUTHOR_URL = 'https://github.com/ShAlexHo';
const SEMINAR_URL = 'https://hpicgs.github.io/seminar-3d-rendering-computational-art-2026/';

const preview_url = computed(() => scene_screenshot_url.value ?? scene_preview_url);

// the frame takes the screenshot's own aspect ratio, i.e. the browser window's when it was taken
const preview_ratio = ref(16 / 9);

function updatePreviewRatio(event) {
    const image = event.target;
    if (image.naturalHeight > 0) preview_ratio.value = image.naturalWidth / image.naturalHeight;
}

const router = useRouter();
const SCENE_HREF = router.resolve({ name: 'scene' }).href;
const preview_frame = ref(null);
const preview_image = ref(null);
let is_entering = false;

async function enterScene(event) {
    // modified clicks keep their default, e.g. opening the scene in a new tab
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (is_entering) return;
    is_entering = true;

    await expandIntoScene({ frame: preview_frame.value, image: preview_image.value });
    await router.push({ name: 'scene' });
}

// Safari has no requestIdleCallback
function runWhenIdle(callback) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 2000 });
    else setTimeout(callback, 300);
}

// bakes the scene while idle, so pressing play starts without a stall
onMounted(() => {
    runWhenIdle(async () => {
        const { getSceneEngine } = await import('../scene_engine.js');
        getSceneEngine().prepare();
    });
});
</script>

<template>
    <main class="landing">
        <section class="hero">
            <header class="hero-header">
                <div class="heading">
                    <h1 class="title">{{ localize('app.title') }}</h1>
                    <p class="subtitle">
                        {{ localize('landing.subtitle_course_prefix') }}
                        <a
                            :href="SEMINAR_URL"
                            class="seminar-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            :title="localize('landing.seminar_link')"
                        >3D-Rendering &amp; Computational Art</a>
                        {{ localize('landing.by') }} Shyue-Shyang Alexander Ho
                    </p>
                </div>

                <div class="language-switch" role="group" :aria-label="localize('landing.language')">
                    <button
                        v-for="language in LANGUAGES"
                        :key="language"
                        type="button"
                        class="language-option"
                        :lang="language"
                        :aria-pressed="language === current_language"
                        @click="setLanguage(language)"
                    >
                        {{ language.toUpperCase() }}
                    </button>
                </div>
            </header>

            <div class="preview-area">
                <a
                    ref="preview_frame"
                    :href="SCENE_HREF"
                    class="preview"
                    :style="{ '--preview-ratio': preview_ratio }"
                    :aria-label="localize('landing.start_scene')"
                    @click="enterScene"
                >
                    <img
                        ref="preview_image"
                        :src="preview_url"
                        :alt="localize('landing.preview_alt')"
                        class="preview-image"
                        @load="updatePreviewRatio"
                    />
                    <span class="play-button" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                    </span>
                </a>
            </div>
        </section>

        <section class="description">
            <h2 class="description-title">
                <a
                    :href="REPOSITORY_URL"
                    class="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="localize('landing.repository_link')"
                >
                    <span class="link-text">{{ localize('landing.description_title') }}</span>
                    <span class="github-badge"><GitHubIcon />GitHub</span>
                </a>
            </h2>
            <p class="description-author">
                {{ localize('landing.by') }}
                <a
                    :href="AUTHOR_URL"
                    class="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="localize('landing.author_link')"
                >
                    <GitHubIcon />
                    <span class="link-text">Shyue-Shyang Alexander Ho</span>
                </a>
            </p>
            <p>{{ localize('landing.description') }}</p>
            <p class="description-modes">{{ localize('landing.description_modes') }}</p>
        </section>
    </main>
</template>

<style scoped>
.hero {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100vh;
    height: 100svh;
    padding: 24px;
}

.hero-header {
    display: grid;
    flex: none;
    grid-template-columns: 1fr auto 1fr;
    align-items: start;
    gap: 16px;
}

.heading {
    grid-column: 2;
    text-align: center;
}

.language-switch {
    grid-column: 3;
    justify-self: end;
    display: flex;
    padding: 3px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background: var(--color-surface);
}

.language-option {
    min-width: 40px;
    padding: 6px 10px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--color-text-muted);
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: background 200ms ease, color 200ms ease;
}

.language-option:hover {
    color: var(--color-text);
}

.language-option[aria-pressed='true'] {
    background: var(--color-accent);
    color: #fff;
}

.language-option:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

.title {
    font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 3rem);
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.15;
}

.subtitle {
    margin-top: 8px;
    color: var(--color-text-muted);
    font-size: clamp(0.85rem, 1.4vw, 1rem);
}

.seminar-link {
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: rgba(255, 91, 0, 0.5);
    text-underline-offset: 3px;
    transition: color 200ms ease, text-decoration-color 200ms ease;
}

.seminar-link:hover,
.seminar-link:focus-visible {
    color: var(--color-accent);
    text-decoration-color: var(--color-accent);
}

.seminar-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 2px;
}

.preview-area {
    display: flex;
    flex: 1;
    min-height: 0;
    align-items: center;
    justify-content: center;
    container-type: size;
}

/* the largest box with the screenshot's aspect ratio that fits the area */
.preview {
    position: relative;
    display: block;
    width: min(100cqw, 100cqh * var(--preview-ratio));
    aspect-ratio: var(--preview-ratio);
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(255, 60, 0, 0.12);
}

.preview:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
}

.preview-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease, filter 300ms ease;
}

.play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border: 2px solid rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    background: var(--color-surface);
    backdrop-filter: blur(4px);
    opacity: 0;
    translate: -50% -50%;
    scale: 0.9;
    transition: opacity 200ms ease, scale 200ms ease;
}

.play-button svg {
    width: 44px;
    height: 44px;
    margin-left: 6px;
    fill: #fff;
}

.preview:hover .preview-image,
.preview:focus-visible .preview-image {
    filter: brightness(0.75);
    transform: scale(1.015);
}

.preview:hover .play-button,
.preview:focus-visible .play-button {
    opacity: 1;
    scale: 1;
}

/* in portrait, a viewport-high hero would leave empty bands around the landscape-shaped screenshot */
@media (orientation: portrait) {
    .hero {
        height: auto;
    }

    .preview-area {
        flex: none;
        container-type: normal;
    }

    .preview {
        width: 100%;
    }
}

/* no hover on touch screens */
@media (hover: none) {
    .play-button {
        opacity: 1;
        scale: 1;
    }
}

.description {
    max-width: 65ch;
    margin: 0 auto;
    padding: 16px 24px 64px;
    font-size: 1.05rem;
    line-height: 1.65;
}

.github-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    color: inherit;
    text-decoration: none;
    transition: color 200ms ease;
}

.github-link .link-text {
    text-decoration: underline;
    text-decoration-color: rgba(255, 91, 0, 0.5);
    text-underline-offset: 3px;
    transition: text-decoration-color 200ms ease;
}

.github-link:hover,
.github-link:focus-visible {
    color: var(--color-accent);
}

.github-link:hover .link-text,
.github-link:focus-visible .link-text {
    text-decoration-color: var(--color-accent);
}

.github-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 4px;
}

.github-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: 4px;
    padding: 4px 10px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    background: var(--color-surface);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    transition: border-color 200ms ease;
}

.github-link:hover .github-badge,
.github-link:focus-visible .github-badge {
    border-color: var(--color-accent);
}

.description-modes {
    margin-top: 1em;
    color: var(--color-text-muted);
}

.description-title {
    font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
}

.description-author {
    margin: 4px 0 16px;
    color: var(--color-text-muted);
    font-size: 0.95rem;
}

@media (max-width: 600px) {
    .hero {
        padding: 16px;
    }

    .hero-header {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .heading,
    .language-switch {
        grid-column: 1;
    }

    .language-switch {
        grid-row: 1;
    }

    .description {
        padding: 8px 16px 48px;
    }

    .play-button {
        width: 72px;
        height: 72px;
    }

    .play-button svg {
        width: 32px;
        height: 32px;
    }
}
</style>
