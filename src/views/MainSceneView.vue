<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { getSceneEngine } from '../scenes/main-scene/scene_engine.js';
import { scene_screenshot_url } from '../scene_screenshot.js';
import { localize } from '../language_state.js';

const scene_container = ref(null);
const engine = getSceneEngine();

onMounted(() => engine.mount(scene_container.value));

onBeforeUnmount(() => {
    scene_screenshot_url.value = engine.captureScreenshot();
    engine.unmount();
});
</script>

<template>
    <div ref="scene_container" class="scene">
        <RouterLink :to="{ name: 'landing' }" class="home-button" :aria-label="localize('scene.home')" :title="localize('scene.home')">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" /></svg>
        </RouterLink>
    </div>
</template>

<style scoped>
.scene {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #000;
}

.scene :deep(canvas) {
    display: block;
}

.home-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 50%;
    background: var(--color-surface);
    backdrop-filter: blur(4px);
    color: #fff;
    transition: background 200ms ease, border-color 200ms ease;
}

.home-button:hover {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 91, 0, 0.7);
}

.home-button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
}

.home-button svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
}
</style>
