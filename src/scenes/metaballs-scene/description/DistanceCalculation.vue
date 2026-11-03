<script setup>
import { computed } from 'vue';
import { formatNumber } from './description_format.js';
import MathPoint from './MathPoint.vue';

const properties = defineProps({
    point: { type: Object, required: true },
    center: { type: Object, required: true },
    center_index: { type: Number, required: true },
});

const offsets = computed(() => [properties.point.x - properties.center.x, properties.point.y - properties.center.y]);
const distance = computed(() => Math.hypot(...offsets.value));
</script>

<template>
    <math displaystyle="true">
        <msub><mi>r</mi><mn>{{ properties.center_index }}</mn></msub>
        <mo>=</mo>
        <mo>‖</mo><mi>P</mi><mo>−</mo><msub><mi>c</mi><mn>{{ properties.center_index }}</mn></msub><mo>‖</mo>
        <mo>=</mo>
        <mo>‖</mo><MathPoint :point="properties.point" /><mo>−</mo><MathPoint :point="properties.center" /><mo>‖</mo>
    </math>
    <math displaystyle="true">
        <mo>=</mo>
        <msqrt>
            <template v-for="(offset, i) in offsets" :key="i">
                <mo v-if="i > 0">+</mo>
                <msup>
                    <mrow v-if="offset < 0"><mo>(</mo><mo form="prefix">−</mo><mn>{{ formatNumber(-offset) }}</mn><mo>)</mo></mrow>
                    <mn v-else>{{ formatNumber(offset) }}</mn>
                    <mn>2</mn>
                </msup>
            </template>
        </msqrt>
        <mo>=</mo>
        <mn>{{ formatNumber(distance) }}</mn>
    </math>
</template>
