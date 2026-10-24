<script setup>
import { computed, onMounted } from 'vue';
import { scene_screenshot_url } from '../scene_screenshot.js';
import scene_preview_url from '../assets/scene_preview.jpg';

const preview_url = computed(() => scene_screenshot_url.value ?? scene_preview_url);

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
                <h1 class="title">Unstill Life: Lavalandschaft</h1>
                <p class="subtitle">
                    Seminararbeit im Kurs 3D-Rendering &amp; Computational Art · Shyue-Shyang Alexander Ho
                </p>
            </header>

            <RouterLink :to="{ name: 'scene' }" class="preview" aria-label="Szene starten">
                <img :src="preview_url" alt="Screenshot der Lavalandschaft" class="preview-image" />
                <span class="play-button" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                </span>
            </RouterLink>
        </section>

        <section class="description">
            <p>
                Eine computergrafische Simulation einer vulkanischen Lavalandschaft als interaktives
                Stillleben, das sich langsam und subtil verändert. Ein Vulkan speit in Wellen Lava über
                prozedurales Terrain, eine rote Sonne zieht ihre Bahn, und aus dem Krater steigt Rauch auf.
            </p>
            <p>
                Die Szene läuft von selbst, lässt sich aber mit der Maus erkunden und im Interaktionsmodus
                auch berühren. Über das Panel oben rechts lassen sich Farben, Licht, Rauch und Klang anpassen.
            </p>
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
    flex: none;
    text-align: center;
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

.preview {
    position: relative;
    display: block;
    flex: 1;
    min-height: 0;
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

.description p + p {
    margin-top: 1em;
    color: var(--color-text-muted);
}

@media (max-width: 600px) {
    .hero {
        padding: 16px;
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
