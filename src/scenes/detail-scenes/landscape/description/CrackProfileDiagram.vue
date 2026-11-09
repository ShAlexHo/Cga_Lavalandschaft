<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { crackCurves, VOLCANO_CRACK_THRESHOLD, DISPLACEMENT_SCALE } from './crack_example.js';

const X_MAX = 8;
const SAMPLES_PER_UNIT = 60;
const WIDTH = 720;
const ROW_HEIGHT = 120;
const LABEL_HEIGHT = 26;
const PLOT_PADDING = 14;
const PLOT_HEIGHT = ROW_HEIGHT - LABEL_HEIGHT - 2 * PLOT_PADDING;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('volcano_irregularities');
const CURVES = crackCurves(X_MAX, SAMPLES_PER_UNIT);
const NOISE_PEAK = Math.max(...CURVES.noise.map(({ y }) => Math.abs(y)));
const MAXIMUM_DEPTH = DISPLACEMENT_SCALE * VOLCANO_CRACK_THRESHOLD;

const ROWS = [
    { label_key: 'curve_noise', points: CURVES.noise, minimum: -NOISE_PEAK, maximum: NOISE_PEAK, baseline: 0 },
    { label_key: 'curve_crack', points: CURVES.crack, minimum: 0, maximum: 1, baseline: 0, threshold: VOLCANO_CRACK_THRESHOLD },
    { label_key: 'curve_depth', points: CURVES.depth, minimum: -MAXIMUM_DEPTH, maximum: 0, baseline: 0, filled: true },
].map((row, i) => {
    const top = i * ROW_HEIGHT + LABEL_HEIGHT + PLOT_PADDING;
    const toY = value => top + (row.maximum - value) / (row.maximum - row.minimum) * PLOT_HEIGHT;
    const toX = x => (x / X_MAX) * WIDTH;
    const path = row.points.map(({ x, y }) => `${toX(x)},${toY(y)}`).join(' ');
    return {
        ...row,
        label_y: i * ROW_HEIGHT + LABEL_HEIGHT - 6,
        baseline_y: toY(row.baseline),
        threshold_y: row.threshold === undefined ? null : toY(row.threshold),
        path,
        area: row.filled ? `0,${toY(0)} ${path} ${WIDTH},${toY(0)}` : null,
    };
});
const HEIGHT = ROWS.length * ROW_HEIGHT;
</script>

<template>
    <svg class="diagram" :viewBox="`-10 0 ${WIDTH + 20} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <g v-for="row in ROWS" :key="row.label_key">
            <text class="label" x="0" :y="row.label_y">{{ descriptionText(row.label_key) }}</text>
            <line class="baseline" x1="0" :y1="row.baseline_y" :x2="WIDTH" :y2="row.baseline_y" />
            <template v-if="row.threshold_y !== null">
                <line class="threshold" x1="0" :y1="row.threshold_y" :x2="WIDTH" :y2="row.threshold_y" />
                <text class="threshold-label" :x="WIDTH" :y="row.threshold_y - 6">{{ descriptionText('curve_threshold') }}</text>
            </template>
            <polygon v-if="row.area" class="area" :points="row.area" />
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

.area {
    fill: rgba(255, 91, 0, 0.15);
}

.curve {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2;
    stroke-linejoin: round;
}
</style>
