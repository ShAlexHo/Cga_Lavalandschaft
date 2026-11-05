<script setup>
import { createDescriptionText, formatNumber } from '../../shared/description/description_text.js';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import NoiseCurvesDiagram from './NoiseCurvesDiagram.vue';
import { OCTAVE_COUNT, LACUNARITY, GAIN } from './noise_example.js';

const descriptionText = createDescriptionText('noise');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.noise', label_key: 'gui.enabled', text_key: 'try_enabled' },
    { folder_key: 'gui.folder.noise', label_key: 'gui.noise.colour_1', text_key: 'try_colour_1' },
    { folder_key: 'gui.folder.noise', label_key: 'gui.noise.colour_2', text_key: 'try_colour_2' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('why_heading') }}</h3>
        <p>{{ descriptionText('why_text_1') }}</p>
        <p>{{ descriptionText('why_text_2') }}</p>
    </section>

    <section>
        <h3>{{ descriptionText('layers_heading') }}</h3>
        <p>{{ descriptionText('octave_text_1') }}</p>
        <math display="block">
            <msub><mi>o</mi><mi>k</mi></msub><mo>(</mo><mi>p</mi><mo>)</mo>
            <mo>=</mo>
            <msup><mn>{{ formatNumber(GAIN) }}</mn><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></msup>
            <mo>⋅</mo>
            <mi>n</mi><mo>(</mo><msup><mn>{{ formatNumber(LACUNARITY) }}</mn><mi>k</mi></msup><mo>⋅</mo><mi>p</mi><mo>)</mo>
        </math>
        <p>{{ descriptionText('octave_text_2') }}</p>
        <p>{{ descriptionText('octave_text_3') }}</p>
        <math display="block">
            <mi>N</mi><mo>(</mo><mi>p</mi><mo>)</mo>
            <mo>=</mo>
            <munderover><mo>∑</mo><mrow><mi>k</mi><mo>=</mo><mn>0</mn></mrow><mn>{{ OCTAVE_COUNT - 1 }}</mn></munderover>
            <msub><mi>o</mi><mi>k</mi></msub><mo>(</mo><mi>p</mi><mo>)</mo>
        </math>
        <p>{{ descriptionText('octave_text_4') }}</p>
        <figure>
            <NoiseCurvesDiagram :description="descriptionText('curves_figure_alt')" />
            <figcaption>{{ descriptionText('curves_figure_caption') }}</figcaption>
        </figure>
    </section>

    <section>
        <h3>{{ descriptionText('flow_heading') }}</h3>
        <p>{{ descriptionText('flow_text') }}</p>
    </section>

    <section>
        <h3>{{ descriptionText('colour_heading') }}</h3>
        <p>{{ descriptionText('colour_text_1') }}</p>
        <p>{{ descriptionText('colour_text_2') }}</p>
    </section>

    <TryItYourself detail_key="noise" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p>{{ descriptionText('usage_text') }}</p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>
