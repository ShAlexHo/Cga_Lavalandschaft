<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import SurfaceMappingDiagram from './SurfaceMappingDiagram.vue';

const descriptionText = createDescriptionText('surface');

const SCENE_CONTROLS = [
    { label_key: 'gui.surface.noise', text_key: 'try_noise' },
    { folder_key: 'gui.folder.surface', label_key: 'gui.surface.bump_mapping', text_key: 'try_bump' },
    { folder_key: 'gui.folder.surface', label_key: 'gui.surface.displacement_mapping', text_key: 'try_displacement' },
    { folder_key: 'gui.folder.surface', label_key: 'gui.surface.displacement_strength', text_key: 'try_strength' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('why_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('why_text')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('bump_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('bump_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('bump_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('displacement_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('displacement_text')" /></p>
        <figure>
            <SurfaceMappingDiagram :description="descriptionText('mapping_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('mapping_figure_caption')" /></figcaption>
        </figure>
    </section>

    <TryItYourself detail_key="surface" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
