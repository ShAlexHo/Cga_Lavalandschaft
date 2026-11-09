<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import CrackProfileDiagram from './CrackProfileDiagram.vue';

const descriptionText = createDescriptionText('volcano_irregularities');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.volcano', label_key: 'gui.volcano.surface_irregularities', text_key: 'try_irregularities' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('intro_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('intro_text')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('crack_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('crack_text')" /></p>
        <figure>
            <CrackProfileDiagram :description="descriptionText('crack_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('crack_figure_caption')" /></figcaption>
        </figure>
    </section>

    <section>
        <h3>{{ descriptionText('lava_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('lava_text')" /></p>
    </section>

    <TryItYourself detail_key="volcano_irregularities" :controls="SCENE_CONTROLS" :with_tip="false" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
