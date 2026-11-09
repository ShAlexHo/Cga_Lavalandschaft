<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import LatheProfileDiagram from './LatheProfileDiagram.vue';
import FlowLineDiagram from './FlowLineDiagram.vue';

const descriptionText = createDescriptionText('volcano');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.spawn_height', text_key: 'try_spawn_height' },
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.flow_slope', text_key: 'try_flow_slope' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.visible', text_key: 'try_ground' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('lathe_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('lathe_text_1')" /></p>
        <figure>
            <LatheProfileDiagram :description="descriptionText('lathe_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('lathe_figure_caption')" /></figcaption>
        </figure>
    </section>

    <section>
        <h3>{{ descriptionText('flow_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('flow_text_1')" /></p>
        <math display="block">
            <mi>y</mi><mo>=</mo><mi>m</mi><mo>⋅</mo><mi>x</mi><mo>+</mo><mi>b</mi>
        </math>
        <p><SceneLinkedText :text="descriptionText('flow_text_2')" /></p>
        <figure>
            <FlowLineDiagram :description="descriptionText('flow_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('flow_figure_caption')" /></figcaption>
        </figure>
        <p><SceneLinkedText :text="descriptionText('flow_text_3')" /></p>
    </section>

    <TryItYourself detail_key="volcano" :controls="SCENE_CONTROLS" :with_tip="false" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
