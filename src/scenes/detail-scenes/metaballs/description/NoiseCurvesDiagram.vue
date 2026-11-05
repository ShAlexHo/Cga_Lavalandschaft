<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { noiseCurves } from './noise_example.js';

const X_MAX = 8;
const SAMPLES_PER_UNIT = 40;
const WIDTH = 720;
const ROW_HEIGHT = 96;
const ROW_PADDING = 12;
const LABEL_HEIGHT = 26;
const AMPLITUDE_PIXELS = (ROW_HEIGHT - LABEL_HEIGHT - 2 * ROW_PADDING) / 2 + ROW_PADDING / 2;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('noise');
const CURVES = noiseCurves(X_MAX, SAMPLES_PER_UNIT);
const peakOf = points => Math.max(...points.map(point => Math.abs(point.y)));
const NOISE_PEAK = peakOf(CURVES.fractal);
const ROWS = [
    { label: descriptionText('curve_white'), points: CURVES.white, peak: peakOf(CURVES.white) },
    ...CURVES.octaves.map((points, octave) => ({ label: `${descriptionText('curve_octave')} ${octave}`, points, peak: NOISE_PEAK })),
    { label: descriptionText('curve_fractal'), points: CURVES.fractal, peak: NOISE_PEAK, is_sum: true },
].map((row, i) => {
    const baseline = i * ROW_HEIGHT + LABEL_HEIGHT + (ROW_HEIGHT - LABEL_HEIGHT) / 2;
    const path = row.points.map(point => `${(point.x / X_MAX) * WIDTH},${baseline - (point.y / row.peak) * AMPLITUDE_PIXELS}`).join(' ');
    return { ...row, baseline, label_y: i * ROW_HEIGHT + LABEL_HEIGHT - 6, path };
});
const HEIGHT = ROWS.length * ROW_HEIGHT;
</script>

<template>
    <svg class="noise-curves-diagram" :viewBox="`-10 0 ${WIDTH + 20} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <g v-for="row in ROWS" :key="row.label">
            <text class="label" :class="{ sum: row.is_sum }" x="0" :y="row.label_y">{{ row.label }}</text>
            <line class="baseline" x1="0" :y1="row.baseline" :x2="WIDTH" :y2="row.baseline" />
            <polyline class="curve" :class="{ sum: row.is_sum }" :points="row.path" />
        </g>
    </svg>
</template>

<style scoped>
.noise-curves-diagram {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    font-family: inherit;
}

.label {
    fill: var(--color-text-muted);
    font-size: 15px;
}

.baseline {
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
}

.label.sum {
    fill: var(--color-text);
}

.curve {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2;
    stroke-linejoin: round;
}

.curve.sum {
    stroke-width: 2.5;
}
</style>
