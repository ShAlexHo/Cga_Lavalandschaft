<script setup>
import { ref } from 'vue';
import SceneStage from './SceneStage.vue';
import { findDetailScene, numberedTitle } from '../scenes/detail_scenes.js';

const properties = defineProps({
    engine: { type: Object, required: true },
    scene_name: { type: String, required: true },
    title: { type: String, required: true },
    scroll_hint: { type: String, required: true },
});

const detail = findDetailScene(properties.scene_name);

const description = ref(null);

function scrollToDescription() {
    description.value.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <main class="described-scene">
        <SceneStage :engine="properties.engine" :scene_name="properties.scene_name">
            <button type="button" class="scroll-hint" @click="scrollToDescription">
                {{ properties.scroll_hint }}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
        </SceneStage>

        <article ref="description" class="scene-description">
            <h2 class="scene-description-title">{{ numberedTitle(detail, properties.title) }}</h2>
            <slot />
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

.scroll-hint:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
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

.scene-description-title {
    margin-bottom: 16px;
    font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
}

.scene-description :slotted(p) {
    margin-top: 1em;
}

.scene-description :slotted(p:first-of-type) {
    margin-top: 0;
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
