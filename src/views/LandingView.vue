<script>
let saved_scroll_top = 0;
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { scene_screenshots } from '../scene_screenshot.js';
import { expandIntoScene, whenReturnFinished } from '../scene_transition.js';
import { current_language, localize } from '../ui/language_state.js';
import { LANGUAGES, setLanguage } from '../ui/language.js';
import { detailText, detailTitle } from '../ui/detail_texts.js';
import main_scene_preview_url from '../assets/main_scene_preview.jpg';
import GitHubIcon from '../components/GitHubIcon.vue';
import ScenePreview from '../components/ScenePreview.vue';
import { DETAIL_SCENES } from '../scenes/detail-scenes/detail_scenes.js';
import { MAIN_SCENE_NAME } from '../scenes/main-scene/scene_name.js';
import { createScenePreparation } from '../scene_preparation.js';

const REPOSITORY_URL = 'https://github.com/ShAlexHo/Cga_Lavalandschaft';
const AUTHOR_URL = 'https://github.com/ShAlexHo';
const SEMINAR_URL = 'https://hpicgs.github.io/seminar-3d-rendering-computational-art-2026/';

const router = useRouter();

const MAIN_SCENE_HREF = router.resolve({ name: MAIN_SCENE_NAME }).href;
const DETAILS = DETAIL_SCENES.map(detail => ({ ...detail, href: router.resolve({ name: detail.scene_name }).href }));

const main_scene_image_url = computed(() => scene_screenshots[MAIN_SCENE_NAME] ?? main_scene_preview_url);

function detailImageUrl(detail) {
    return scene_screenshots[detail.scene_name] ?? detail.preview_url;
}

let is_entering = false;

async function enterScene(event, { scene_name, frame, image }) {
    const is_modified_click = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (is_modified_click) return;
    event.preventDefault();
    if (is_entering) return;
    is_entering = true;

    await expandIntoScene({ frame, image });
    await router.push({ name: scene_name });
}

const SCENE_ENGINE_LOADERS = {
    [MAIN_SCENE_NAME]: () => import('../scenes/main-scene/scene_engine.js'),
    ...Object.fromEntries(DETAILS.map(detail => [detail.scene_name, detail.loadEngine])),
};
let scene_preparation = null;
let is_unmounted = false;

function requestPreparation(scene_name) {
    scene_preparation?.request(scene_name, SCENE_ENGINE_LOADERS[scene_name]);
}

onMounted(async () => {
    window.scrollTo(0, saved_scroll_top);
    await whenReturnFinished();
    if (is_unmounted) return;
    scene_preparation = createScenePreparation();
});

onBeforeUnmount(() => {
    is_unmounted = true;
    saved_scroll_top = window.scrollY;
    scene_preparation?.dispose();
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
                            class="text-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            :title="localize('landing.seminar_link')"
                        >{{ localize('landing.seminar_name') }}</a>
                        {{ localize('landing.by') }} {{ localize('landing.author_name') }}
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
                <ScenePreview
                    :scene_name="MAIN_SCENE_NAME"
                    :href="MAIN_SCENE_HREF"
                    :image_url="main_scene_image_url"
                    :alt="localize('landing.preview_alt')"
                    :label="localize('landing.start_scene')"
                    @enter="enterScene"
                    @prepare="requestPreparation"
                />
            </div>
        </section>

        <section class="description">
            <h2 class="section-title">
                <a
                    :href="REPOSITORY_URL"
                    class="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="localize('landing.repository_link')"
                >
                    <span class="link-text">{{ localize('landing.description_title') }}</span>
                    <span class="github-badge"><GitHubIcon />{{ localize('landing.github') }}</span>
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
                    <span class="link-text">{{ localize('landing.author_name') }}</span>
                </a>
            </p>
            <p>{{ localize('landing.description') }}</p>
            <p class="description-modes">{{ localize('landing.description_modes') }}</p>
        </section>

        <section class="details">
            <header class="details-header">
                <h2 class="section-title">{{ localize('landing.details_title') }}</h2>
                <p class="details-intro">{{ localize('landing.details_intro') }}</p>
            </header>

            <div class="details-grid">
                <article v-for="detail in DETAILS" :key="detail.scene_name" class="detail">
                    <h3 class="detail-title">{{ detailTitle(detail) }}</h3>
                    <ScenePreview
                        :scene_name="detail.scene_name"
                        :href="detail.href"
                        :image_url="detailImageUrl(detail)"
                        :alt="detailText(detail, 'preview_alt')"
                        :label="detailText(detail, 'start_scene')"
                        small
                        @enter="enterScene"
                        @prepare="requestPreparation"
                    />
                    <p class="detail-text">{{ detailText(detail, 'text_1') }}</p>
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
    color: var(--color-on-accent);
}

.title {
    font-family: var(--font-serif);
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

.text-link,
.github-link .link-text {
    text-decoration: underline;
    text-decoration-color: var(--color-accent-soft);
    text-underline-offset: 3px;
    transition: color 200ms ease, text-decoration-color 200ms ease;
}

.text-link {
    color: var(--color-text);
}

.text-link:hover,
.text-link:focus-visible,
.github-link:hover .link-text,
.github-link:focus-visible .link-text {
    color: var(--color-accent);
    text-decoration-color: var(--color-accent);
}

.preview-area {
    display: flex;
    justify-content: center;
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

.github-link:hover,
.github-link:focus-visible {
    color: var(--color-accent);
}

.github-link:focus-visible {
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
    font-family: var(--font-sans);
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
    margin: 0 auto 40px;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 1.05rem;
    line-height: 1.65;
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

.detail:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    justify-self: center;
    width: var(--detail-preview-width);
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.detail-title {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.2;
}

.detail-text {
    font-size: 1.05rem;
    line-height: 1.65;
}

@media (orientation: portrait) {
    .details-grid {
        grid-template-columns: var(--details-width);
    }

    .detail:last-child:nth-child(odd) {
        width: 100%;
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
}
</style>
