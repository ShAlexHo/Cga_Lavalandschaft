<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import SmokeLifetimeDiagram from './SmokeLifetimeDiagram.vue';

const descriptionText = createDescriptionText('smoke_ash');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.smoke', label_key: 'gui.smoke.count', text_key: 'try_count' },
    { folder_key: 'gui.folder.smoke', label_key: 'gui.smoke.rise_speed', text_key: 'try_rise_speed' },
    { folder_key: 'gui.folder.smoke', label_key: 'gui.smoke.ember_cooling_time', text_key: 'try_cooling_time' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('particles_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('particles_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('particles_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('motion_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('motion_text')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('appearance_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('appearance_text_1')" /></p>
        <figure>
            <SmokeLifetimeDiagram :description="descriptionText('lifetime_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('lifetime_figure_caption')" /></figcaption>
        </figure>
        <p><SceneLinkedText :text="descriptionText('appearance_text_2')" /></p>
    </section>

    <TryItYourself detail_key="smoke_ash" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
