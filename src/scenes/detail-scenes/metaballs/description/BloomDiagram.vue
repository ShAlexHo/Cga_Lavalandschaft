<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { bloomCurves, BLOOM_THRESHOLD } from './bloom_example.js';

const X_MAX = 8;
const SAMPLES_PER_UNIT = 40;
const WIDTH = 720;
const ROW_HEIGHT = 120;
const LABEL_HEIGHT = 26;
const BOTTOM_PADDING = 12;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('ground');
const CURVES = bloomCurves(X_MAX, SAMPLES_PER_UNIT);
const PEAK = Math.max(...CURVES.result.map(({ y }) => y));
const PLOT_HEIGHT = ROW_HEIGHT - LABEL_HEIGHT - BOTTOM_PADDING - 8;

function toPath(points, baseline) {
    return points.map(({ x, y }) => `${(x / X_MAX) * WIDTH},${baseline - (y / PEAK) * PLOT_HEIGHT}`).join(' ');
}

const ROWS = [
    { label_key: 'bloom_original', points: CURVES.original, show_threshold: true },
    { label_key: 'bloom_glow', points: CURVES.glow },
    { label_key: 'bloom_result', points: CURVES.result, reference: CURVES.original },
].map((row, i) => {
    const baseline = (i + 1) * ROW_HEIGHT - BOTTOM_PADDING;
    return {
        ...row,
        baseline,
        label_y: i * ROW_HEIGHT + LABEL_HEIGHT - 6,
        path: toPath(row.points, baseline),
        reference_path: row.reference && toPath(row.reference, baseline),
        threshold_y: baseline - (BLOOM_THRESHOLD / PEAK) * PLOT_HEIGHT,
    };
});
const HEIGHT = ROWS.length * ROW_HEIGHT;
</script>

<template>
    <svg class="diagram" :viewBox="`-10 0 ${WIDTH + 20} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <g v-for="row in ROWS" :key="row.label_key">
            <text class="label" x="0" :y="row.label_y">{{ descriptionText(row.label_key) }}</text>
            <line class="baseline" x1="0" :y1="row.baseline" :x2="WIDTH" :y2="row.baseline" />
            <template v-if="row.show_threshold">
                <line class="threshold" x1="0" :y1="row.threshold_y" :x2="WIDTH" :y2="row.threshold_y" />
                <text class="threshold-label" :x="WIDTH" :y="row.threshold_y - 6">{{ descriptionText('bloom_threshold') }}</text>
            </template>
            <polyline v-if="row.reference_path" class="reference" :points="row.reference_path" />
            <polyline class="curve" :points="row.path" />
        </g>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.threshold-label {
    fill: var(--color-text-muted);
    font-size: 13px;
    text-anchor: end;
}

.baseline {
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
}

.threshold {
    stroke: rgba(255, 255, 255, 0.45);
    stroke-width: 1;
    stroke-dasharray: 5 5;
}

.reference {
    fill: none;
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
}

.curve {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2;
    stroke-linejoin: round;
}
</style>
