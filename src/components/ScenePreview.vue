<script setup>
import { ref } from 'vue';
import { localize } from '../ui/language_state.js';

const DEFAULT_PREVIEW_RATIO = 16 / 9;
const PLAY_ICON_PATH = 'M8 5.5v13l10.5-6.5z';

const properties = defineProps({
    scene_name: { type: String, required: true },
    href: { type: String, required: true },
    image_url: { type: String, required: true },
    alt: { type: String, required: true },
    label: { type: String, required: true },
    small: { type: Boolean, default: false },
});

const emit = defineEmits(['enter', 'prepare']);

const frame = ref(null);
const image = ref(null);
const preview_ratio = ref(DEFAULT_PREVIEW_RATIO);
const is_loaded = ref(false);

function finishLoading() {
    if (image.value.naturalHeight > 0) preview_ratio.value = image.value.naturalWidth / image.value.naturalHeight;
    is_loaded.value = true;
}

function enter(event) {
    emit('enter', event, { scene_name: properties.scene_name, frame: frame.value, image: image.value });
}
</script>

<template>
    <a
        ref="frame"
        :href="properties.href"
        class="preview"
        :class="{ 'preview-small': properties.small }"
        :data-scene-preview="properties.scene_name"
        :style="{ '--preview-ratio': preview_ratio }"
        :aria-label="properties.label"
        @click="enter"
        @pointerenter="emit('prepare', properties.scene_name)"
        @focus="emit('prepare', properties.scene_name)"
    >
        <img
            ref="image"
            :src="properties.image_url"
            :alt="properties.alt"
            class="preview-image"
            :class="{ loaded: is_loaded }"
            decoding="async"
            @load="finishLoading"
            @error="finishLoading"
        />
        <span v-if="!is_loaded" class="spinner preview-spinner" role="status" :aria-label="localize('landing.preview_loading')"></span>
        <span class="play-button" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path :d="PLAY_ICON_PATH" /></svg>
        </span>
    </a>
</template>

<style scoped>
.preview {
    position: relative;
    display: block;
    width: var(--main-preview-width);
    aspect-ratio: var(--preview-ratio);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    background: var(--color-surface);
    box-shadow: 0 20px 60px rgba(255, 60, 0, 0.12);
}

.preview.preview-small {
    width: 100%;
}

.preview:focus-visible {
    outline-offset: 4px;
}

.preview-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 48px;
    height: 48px;
    margin: -24px 0 0 -24px;
}

.preview-small .preview-spinner {
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
    border-width: 3px;
}

.preview-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: transform 400ms ease, filter 300ms ease, opacity 300ms ease;
}

.preview-image.loaded {
    opacity: 1;
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
    fill: var(--color-on-accent);
}

.preview-small .play-button {
    width: 64px;
    height: 64px;
}

.preview-small .play-button svg {
    width: 30px;
    height: 30px;
    margin-left: 4px;
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

@media (max-width: 600px) {
    .preview:not(.preview-small) .play-button {
        width: 72px;
        height: 72px;
    }

    .preview:not(.preview-small) .play-button svg {
        width: 32px;
        height: 32px;
    }
}
</style>
