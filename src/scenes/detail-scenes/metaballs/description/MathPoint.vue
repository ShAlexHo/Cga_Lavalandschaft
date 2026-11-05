<script setup>
import { createDescriptionText, formatNumber } from '../../shared/description/description_text.js';

const descriptionText = createDescriptionText('metaballs');

const properties = defineProps({
    point: { type: Object, required: true },
});
</script>

<template>
    <mrow>
        <mo>(</mo>
        <mn>{{ formatNumber(properties.point.x) }}</mn>
        <mo separator="true">{{ descriptionText('coordinate_separator') }}</mo>
        <mn>{{ formatNumber(properties.point.y) }}</mn>
        <mo>)</mo>
    </mrow>
</template>
