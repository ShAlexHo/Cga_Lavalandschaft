<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { scene_screenshots } from '../scene_screenshot.js';
import { localize } from '../language_state.js';
import { closeOtherScenes } from '../scenes/scene_registry.js';
import { coverWithScreenshot } from '../scene_transition.js';

const properties = defineProps({
    engine: { type: Object, required: true },
    scene_name: { type: String, required: true },
});

const stage = ref(null);

let is_mounted = false;

onMounted(() => {
    window.scrollTo(0, 0);
    closeOtherScenes(properties.scene_name);
    properties.engine.mount(stage.value);
    is_mounted = true;
});

function leaveScene() {
    if (!is_mounted) return;
    is_mounted = false;
    scene_screenshots[properties.scene_name] = properties.engine.captureScreenshot();
    properties.engine.unmount();
}

onBeforeRouteLeave(to => {
    leaveScene();
    if (to.name === 'landing') coverWithScreenshot(scene_screenshots[properties.scene_name], properties.scene_name);
});

onBeforeUnmount(leaveScene);
</script>

<template>
    <div ref="stage" class="scene-stage">
        <RouterLink :to="{ name: 'landing' }" class="home-button" :aria-label="localize('scene.home')" :title="localize('scene.home')">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" /></svg>
        </RouterLink>
        <slot />
    </div>
</template>

<style scoped>
.scene-stage {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    background: #000;
}

.scene-stage :deep(canvas) {
    display: block;
}

.home-button {
    position: fixed;
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
