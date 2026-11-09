<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import GodRaysDiagram from './GodRaysDiagram.vue';

const descriptionText = createDescriptionText('sun_god_rays');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.visible', text_key: 'try_metaballs' },
    { folder_key: 'gui.folder.god_rays', label_key: 'gui.strength', text_key: 'try_weight' },
    { folder_key: 'gui.folder.god_rays', label_key: 'gui.god_rays.decay', text_key: 'try_decay' },
    { folder_key: 'gui.folder.god_rays', label_key: 'gui.god_rays.density', text_key: 'try_density' },
    { folder_key: 'gui.folder.god_rays', label_key: 'gui.colour', text_key: 'try_tint' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('sun_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('sun_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('sun_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('rays_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('rays_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('rays_text_2')" /></p>
        <figure>
            <GodRaysDiagram :description="descriptionText('rays_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('rays_figure_caption')" /></figcaption>
        </figure>
        <p><SceneLinkedText :text="descriptionText('rays_text_4')" /></p>
    </section>

    <TryItYourself detail_key="sun_god_rays" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('usage_text')" /></p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
