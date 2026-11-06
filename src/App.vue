<script setup>
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { localize } from './ui/language_state.js';
import { revealScene, shrinkIntoPreview } from './scene_transition.js';

watchEffect(() => { document.title = localize('app.title'); });

const route = useRoute();

function finishTransition() {
    if (route.meta.scene) revealScene();
    else shrinkIntoPreview();
}
</script>

<template>
    <RouterView v-slot="{ Component: route_component }">
        <Transition name="fade" mode="out-in" @after-enter="finishTransition">
            <component :is="route_component" />
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
    --color-accent-soft: rgba(255, 91, 0, 0.5);
    --color-on-accent: #fff;
    --font-serif: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
}

a:focus-visible,
button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
}

.section-title {
    font-family: var(--font-serif);
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
}

.text-link {
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-accent-soft);
    text-underline-offset: 3px;
    transition: color 200ms ease, text-decoration-color 200ms ease;
}

.text-link:hover,
.text-link:focus-visible {
    color: var(--color-accent);
    text-decoration-color: var(--color-accent);
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: var(--color-on-accent);
    border-radius: 50%;
    pointer-events: none;
    animation: scene-spinner-rotate 900ms linear infinite;
}

.scene-transition-overlay {
    position: fixed;
    z-index: 100;
    display: block;
    object-fit: cover;
    pointer-events: none;
}

.scene-transition-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
    background: rgba(12, 5, 5, 0.5);
    box-shadow: 0 0 0 10px rgba(12, 5, 5, 0.5), 0 0 40px rgba(12, 5, 5, 0.6);
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

.dg .cr.wide-label .property-name {
    width: 88%;
}

.dg .cr.wide-label .c {
    width: 12%;
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
