<script setup>
import { ref, defineAsyncComponent } from 'vue';
import SceneStage from './SceneStage.vue';
import { findDetailScene } from '../scenes/detail-scenes/detail_scenes.js';
import { localize } from '../ui/language_state.js';
import { detailText, detailTitle } from '../ui/detail_texts.js';

const properties = defineProps({
    engine: { type: Object, required: true },
    scene_name: { type: String, required: true },
});

const detail = findDetailScene(properties.scene_name);
const SceneDescription = detail.loadDescription ? defineAsyncComponent(detail.loadDescription) : null;

const description = ref(null);

function scrollToDescription() {
    description.value.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <main class="described-scene">
        <SceneStage :engine="properties.engine" :scene_name="properties.scene_name">
            <button type="button" class="scroll-hint" @click="scrollToDescription">
                {{ detailText(detail, 'scroll_hint') }}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
        </SceneStage>

        <article ref="description" class="scene-description">
            <h2 class="section-title">{{ detailTitle(detail) }}</h2>
            <SceneDescription v-if="SceneDescription" />
            <p v-else>{{ localize('scene.description_in_work') }}</p>
        </article>
    </main>
</template>

<style scoped>
.scroll-hint {
    position: absolute;
    bottom: 24px;
    left: 50%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 999px;
    background: var(--color-surface);
    backdrop-filter: blur(4px);
    color: var(--color-text);
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    translate: -50% 0;
    transition: border-color 200ms ease, color 200ms ease;
}

.scroll-hint:hover,
.scroll-hint:focus-visible {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.scroll-hint svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.scene-description {
    max-width: 65ch;
    margin: 0 auto;
    padding: 56px 24px 96px;
    font-size: 1.05rem;
    line-height: 1.65;
}

.scene-description .section-title {
    margin-bottom: 16px;
}

@media (max-width: 600px) {
    .scroll-hint {
        bottom: 84px;
    }

    .scene-description {
        padding: 40px 16px 96px;
    }
}
</style>
