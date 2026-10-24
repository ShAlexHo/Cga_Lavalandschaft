<script setup>
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { localize } from './language_state.js';
import { revealScene } from './scene_transition.js';

watchEffect(() => { document.title = localize('app.title'); });

const route = useRoute();

// once the scene has faded in completely, the zoomed screenshot covering it fades out
function onRouteEntered() {
    if (route.name === 'scene') revealScene();
}
</script>

<template>
    <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in" @after-enter="onRouteEntered">
            <component :is="Component" />
        </Transition>
    </RouterView>
</template>

<style>
:root {
    color-scheme: dark;
    --color-background: #0c0505;
    --color-surface: rgba(18, 7, 5, 0.6);
    --color-text: #f2e6dc;
    --color-text-muted: #b59d90;
    --color-accent: #ff5b00;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--color-background);
    color: var(--color-text);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
}

.scene-transition-overlay {
    position: fixed;
    z-index: 100;
    display: block;
    object-fit: cover;
    pointer-events: none;
}

/* a CSS transform animation keeps spinning even while building the scene blocks the main thread */
.scene-transition-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    border-radius: 50%;
    background: rgba(12, 5, 5, 0.5);
    box-shadow: 0 0 0 10px rgba(12, 5, 5, 0.5), 0 0 40px rgba(12, 5, 5, 0.6);
    pointer-events: none;
    animation:
        scene-spinner-rotate 900ms linear infinite,
        scene-spinner-fade-in 200ms ease 150ms both;
}

@keyframes scene-spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes scene-spinner-fade-in {
    from {
        opacity: 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
