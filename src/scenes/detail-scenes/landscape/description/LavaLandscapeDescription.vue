<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';

const descriptionText = createDescriptionText('lava_landscape');

const SCENE_CONTROLS = [
    { label_key: 'gui.fog', text_key: 'try_fog' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.rock_colour_1', text_key: 'try_rock_colour_1' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.rock_colour_2', text_key: 'try_rock_colour_2' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.displacement_scale', text_key: 'try_displacement_scale' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.displacement_frequency', text_key: 'try_displacement_frequency' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.proximity_radius', text_key: 'try_proximity_radius' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.ground.height_occlusion', text_key: 'try_height_occlusion' },
    { folder_key: 'gui.folder.cracks', label_key: 'gui.ground.crack_colour_1', text_key: 'try_crack_colour_1' },
    { folder_key: 'gui.folder.cracks', label_key: 'gui.ground.crack_colour_2', text_key: 'try_crack_colour_2' },
    { folder_key: 'gui.folder.cracks', label_key: 'gui.ground.crack_softness', text_key: 'try_crack_softness' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('relief_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('relief_text_1')" /></p>
        <math display="block">
            <mi>y</mi><mo>=</mo><mi>A</mi><mo>⋅</mo><mo>(</mo><mn>2</mn><mo>⋅</mo><mi>w</mi><mo>(</mo><mi>f</mi><mo>⋅</mo><mi>p</mi><mo>)</mo><mo>−</mo><mn>1</mn><mo>)</mo>
        </math>
        <p><SceneLinkedText :text="descriptionText('relief_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('cracks_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('cracks_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('cracks_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('zones_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('zones_text')" /></p>
    </section>

    <TryItYourself detail_key="lava_landscape" :controls="SCENE_CONTROLS" :with_tip="false" />
</template>

<style scoped src="../../shared/description/description.css"></style>
