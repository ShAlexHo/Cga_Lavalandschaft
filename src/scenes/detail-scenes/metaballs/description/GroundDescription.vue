<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import BloomDiagram from './BloomDiagram.vue';

const descriptionText = createDescriptionText('ground');

const SCENE_CONTROLS = [
    { label_key: 'gui.bloom', text_key: 'try_bloom' },
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.count', text_key: 'try_count' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.visible', text_key: 'try_visible' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.height', text_key: 'try_height' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('why_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('why_text')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('bloom_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('bloom_text_1')" /></p>
        <figure>
            <BloomDiagram :description="descriptionText('bloom_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('bloom_figure_caption')" /></figcaption>
        </figure>
        <p><SceneLinkedText :text="descriptionText('bloom_text_2')" /></p>
    </section>

    <TryItYourself detail_key="ground" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
