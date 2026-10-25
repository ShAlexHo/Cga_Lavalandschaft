<script>
let saved_scroll_top = 0;
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { scene_screenshots } from '../scene_screenshot.js';
import { expandIntoScene, whenReturnFinished } from '../scene_transition.js';
import { current_language, localize } from '../language_state.js';
import { LANGUAGES, setLanguage } from '../ui/language.js';
import main_scene_preview_url from '../assets/scene_preview.jpg';
import metaballs_scene_preview_url from '../assets/metaballs_preview.jpg';
import noise_scene_preview_url from '../assets/noise_preview.jpg';
import GitHubIcon from '../components/GitHubIcon.vue';

const REPOSITORY_URL = 'https://github.com/ShAlexHo/Cga_Lavalandschaft';
const AUTHOR_URL = 'https://github.com/ShAlexHo';
const SEMINAR_URL = 'https://hpicgs.github.io/seminar-3d-rendering-computational-art-2026/';

const router = useRouter();

const DETAILS = [
    { scene_name: 'metaballs-scene', message_key_prefix: 'details.metaballs', bundled_preview_url: metaballs_scene_preview_url },
    { scene_name: 'noise-scene', message_key_prefix: 'details.noise', bundled_preview_url: noise_scene_preview_url },
].map(detail => ({ ...detail, href: router.resolve({ name: detail.scene_name }).href }));

const preview_url = computed(() => scene_screenshots['main-scene'] ?? main_scene_preview_url);

function detailPreviewUrl(detail) {
    return scene_screenshots[detail.scene_name] ?? detail.bundled_preview_url;
}

const preview_ratios = reactive(Object.fromEntries(['main-scene', ...DETAILS.map(detail => detail.scene_name)].map(scene_name => [scene_name, 16 / 9])));

function updatePreviewRatio(event, scene_name) {
    const image = event.target;
    if (image.naturalHeight > 0) preview_ratios[scene_name] = image.naturalWidth / image.naturalHeight;
}

const MAIN_SCENE_HREF = router.resolve({ name: 'main-scene' }).href;
const preview_frame = ref(null);
const preview_image = ref(null);
const detail_preview_elements_by_scene_name = {};
let is_entering = false;

function setDetailPreviewElement(scene_name, kind, element) {
    (detail_preview_elements_by_scene_name[scene_name] ??= {})[kind] = element;
}

function enterDetailScene(event, detail) {
    const { frame, image } = detail_preview_elements_by_scene_name[detail.scene_name];
    return enterScene(event, { scene_name: detail.scene_name, frame, image });
}

async function enterScene(event, { scene_name, frame, image }) {
    const is_modified_click = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (is_modified_click) return;
    event.preventDefault();
    if (is_entering) return;
    is_entering = true;

    await expandIntoScene({ frame, image });
    await router.push({ name: scene_name });
}

const SCENE_ENGINE_LOADERS = [
    () => import('../scenes/main-scene/scene_engine.js'),
    () => import('../scenes/metaballs-scene/scene_engine.js'),
    () => import('../scenes/noise-scene/scene_engine.js'),
];

function runWhenIdle(callback) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 2000 });
    else setTimeout(callback, 300);
}

function prepareScenes(loaders) {
    if (loaders.length === 0) return;
    runWhenIdle(async () => {
        const scene_module = await loaders[0]();
        scene_module.getSceneEngine().prepare();
        prepareScenes(loaders.slice(1));
    });
}

onMounted(async () => {
    window.scrollTo(0, saved_scroll_top);
    await whenReturnFinished();
    prepareScenes(SCENE_ENGINE_LOADERS);
});

onBeforeUnmount(() => {
    saved_scroll_top = window.scrollY;
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
                    :href="MAIN_SCENE_HREF"
                    class="preview"
                    data-scene-preview="main-scene"
                    :style="{ '--preview-ratio': preview_ratios['main-scene'] }"
                    :aria-label="localize('landing.start_scene')"
                    @click="enterScene($event, { scene_name: 'main-scene', frame: preview_frame, image: preview_image })"
                >
                    <img
                        ref="preview_image"
                        :src="preview_url"
                        :alt="localize('landing.preview_alt')"
                        class="preview-image"
                        @load="updatePreviewRatio($event, 'main-scene')"
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

        <section class="details">
            <header class="details-header">
                <h2 class="details-title">{{ localize('landing.details_title') }}</h2>
                <p class="details-intro">{{ localize('landing.details_intro') }}</p>
            </header>

            <div class="details-grid">
                <article v-for="detail in DETAILS" :key="detail.scene_name" class="detail">
                    <div class="detail-column">
                        <h3 class="detail-title">{{ localize(`${detail.message_key_prefix}.title`) }}</h3>
                    </div>
                    <a
                        :ref="element => setDetailPreviewElement(detail.scene_name, 'frame', element)"
                        :href="detail.href"
                        class="preview preview-small"
                        :data-scene-preview="detail.scene_name"
                        :style="{ '--preview-ratio': preview_ratios[detail.scene_name] }"
                        :aria-label="localize(`${detail.message_key_prefix}.start_scene`)"
                        @click="enterDetailScene($event, detail)"
                    >
                        <img
                            :ref="element => setDetailPreviewElement(detail.scene_name, 'image', element)"
                            :src="detailPreviewUrl(detail)"
                            :alt="localize(`${detail.message_key_prefix}.preview_alt`)"
                            class="preview-image"
                            @load="updatePreviewRatio($event, detail.scene_name)"
                        />
                        <span class="play-button play-button-small" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                        </span>
                    </a>
                    <div class="detail-column detail-text">
                        <p>{{ localize(`${detail.message_key_prefix}.text_1`) }}</p>
                    </div>
                </article>
            </div>
        </section>
    </main>
</template>

<style scoped>
.landing {
    --main-preview-width: 80vw;
    --details-width: var(--main-preview-width);
    --detail-gap: 4vw;
    --detail-preview-width: calc((var(--details-width) - var(--detail-gap)) / 2);
}

.hero {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    justify-content: center;
}

.preview {
    position: relative;
    display: block;
    width: var(--main-preview-width);
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

@media (hover: none) {
    .play-button {
        opacity: 1;
        scale: 1;
    }
}

.description {
    width: var(--main-preview-width);
    margin: 0 auto;
    padding: 16px 0 64px;
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

.details {
    padding: 0 24px 96px;
}

.details-header {
    width: var(--details-width);
    margin: 0 auto;
}

.details-header {
    margin-bottom: 40px;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 1.05rem;
    line-height: 1.65;
}

.details-title {
    font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
}

.details-intro {
    max-width: 65ch;
    margin-top: 8px;
    color: var(--color-text-muted);
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(2, var(--detail-preview-width));
    justify-content: center;
    gap: 64px var(--detail-gap);
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.detail-column {
    font-size: 1.05rem;
}

.detail-title {
    font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.2;
}

.preview.preview-small {
    width: 100%;
}

.play-button.play-button-small {
    width: 64px;
    height: 64px;
}

.play-button-small svg {
    width: 30px;
    height: 30px;
    margin-left: 4px;
}

.detail-text {
    line-height: 1.65;
}

@media (orientation: portrait) {
    .details-grid {
        grid-template-columns: var(--details-width);
    }
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
        padding: 8px 0 48px;
    }

    .details {
        padding: 0 16px 72px;
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
