<script setup>
import { createDescriptionText, formatNumber } from '../../shared/description/description_text.js';
import SceneLinkedText from '../../shared/description/SceneLinkedText.vue';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import FlowDirectionsDiagram from './FlowDirectionsDiagram.vue';
import FlowSpreadDiagram from './FlowSpreadDiagram.vue';
import { FLOW_SECTOR_SPREAD } from '../config.js';

const descriptionText = createDescriptionText('lava_flow');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.flow_speed', label_key: 'gui.metaballs.slow_down', text_key: 'try_slow_down' },
    { folder_key: 'gui.folder.distribution', label_key: 'gui.metaballs.sectors_enabled', text_key: 'try_sectors_enabled' },
    { folder_key: 'gui.folder.distribution', label_key: 'gui.metaballs.sector_count', text_key: 'try_sector_count' },
    { folder_key: 'gui.folder.ground', label_key: 'gui.visible', text_key: 'try_ground' },
];
</script>

<template>
    <section>
        <h3>{{ descriptionText('intro_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('intro_text')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('directions_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('directions_text')" /></p>
        <figure>
            <FlowSpreadDiagram :description="descriptionText('spread_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('spread_figure_caption')" /></figcaption>
        </figure>
    </section>

    <section>
        <h3>{{ descriptionText('slow_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('slow_text_1')" /></p>
        <p><SceneLinkedText :text="descriptionText('slow_text_2')" /></p>
    </section>

    <section>
        <h3>{{ descriptionText('sectors_heading') }}</h3>
        <p><SceneLinkedText :text="descriptionText('sectors_text_1')" /></p>
        <div class="formula-line">
            <math displaystyle="true">
                <msub><mi>θ</mi><mi>i</mi></msub><mo>=</mo><mi>k</mi><mo>⋅</mo><mi>w</mi><mo>+</mo>
                <mn>{{ formatNumber(FLOW_SECTOR_SPREAD) }}</mn><mo>⋅</mo><mi>w</mi><mo>⋅</mo><msub><mi>z</mi><mi>i</mi></msub><mo>,</mo>
            </math>
            <math displaystyle="true">
                <mi>k</mi><mo>=</mo><mi>i</mi><mspace width="0.4em" /><mi>mod</mi><mspace width="0.4em" /><mi>n</mi><mo>,</mo>
                <mspace width="0.6em" />
                <mi>w</mi><mo>=</mo><mfrac><mrow><mn>360</mn><mo>°</mo></mrow><mi>n</mi></mfrac>
            </math>
        </div>
        <p><SceneLinkedText :text="descriptionText('sectors_text_2')" /></p>
        <figure>
            <FlowDirectionsDiagram :description="descriptionText('directions_figure_alt')" />
            <figcaption><SceneLinkedText :text="descriptionText('directions_figure_caption')" /></figcaption>
        </figure>
    </section>

    <TryItYourself detail_key="lava_flow" :controls="SCENE_CONTROLS" />
</template>

<style scoped src="../../shared/description/description.css"></style>
