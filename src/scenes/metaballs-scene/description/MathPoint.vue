<script setup>
import { descriptionText, formatNumber } from './description_format.js';

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
