<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { lifetimeCurves, ASH_COLOR, SMOKE_COLOR } from './smoke_example.js';

const SAMPLE_COUNT = 200;
const WIDTH = 720;
const ROW_HEIGHT = 110;
const LABEL_HEIGHT = 26;
const PLOT_PADDING = 12;
const PLOT_HEIGHT = ROW_HEIGHT - LABEL_HEIGHT - 2 * PLOT_PADDING;
const COLOR_STRIP_HEIGHT = 28;
const AXIS_HEIGHT = 30;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('smoke_ash');
const CURVES = lifetimeCurves(SAMPLE_COUNT);

const ROWS = [
    { label_key: 'curve_opacity', value_key: 'opacity', is_ember: false },
    { label_key: 'curve_glow', value_key: 'glow', is_ember: true },
].map((row, i) => {
    const top = i * ROW_HEIGHT + LABEL_HEIGHT + PLOT_PADDING;
    const baseline = top + PLOT_HEIGHT;
    const points = CURVES.map(sample => `${sample.age_fraction * WIDTH},${baseline - sample[row.value_key] * PLOT_HEIGHT}`).join(' ');
    return { ...row, label_y: i * ROW_HEIGHT + LABEL_HEIGHT - 6, baseline, points, area: `0,${baseline} ${points} ${WIDTH},${baseline}` };
});
const COLOR_ROW_TOP = ROWS.length * ROW_HEIGHT;
const COLOR_STRIP_Y = COLOR_ROW_TOP + LABEL_HEIGHT;
const AXIS_Y = COLOR_STRIP_Y + COLOR_STRIP_HEIGHT + 20;
const HEIGHT = AXIS_Y + AXIS_HEIGHT - 12;
</script>

<template>
    <svg class="diagram" :viewBox="`-10 0 ${WIDTH + 20} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <defs>
            <linearGradient id="smoke-color-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" :stop-color="ASH_COLOR" />
                <stop offset="1" :stop-color="SMOKE_COLOR" />
            </linearGradient>
        </defs>
        <g v-for="row in ROWS" :key="row.label_key">
            <text class="label" x="0" :y="row.label_y">{{ descriptionText(row.label_key) }}</text>
            <line class="baseline" x1="0" :y1="row.baseline" :x2="WIDTH" :y2="row.baseline" />
            <polygon class="area" :class="{ ember: row.is_ember }" :points="row.area" />
            <polyline class="curve" :class="{ ember: row.is_ember }" :points="row.points" />
        </g>
        <text class="label" x="0" :y="COLOR_STRIP_Y - 6">{{ descriptionText('curve_color') }}</text>
        <rect class="color-strip" x="0" :y="COLOR_STRIP_Y" :width="WIDTH" :height="COLOR_STRIP_HEIGHT" fill="url(#smoke-color-gradient)" />
        <text class="label" x="0" :y="AXIS_Y">{{ descriptionText('axis_birth') }}</text>
        <text class="label" :x="WIDTH" :y="AXIS_Y" text-anchor="end">{{ descriptionText('axis_end') }}</text>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.baseline {
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
}

.area {
    fill: rgba(255, 255, 255, 0.08);
}

.area.ember {
    fill: rgba(255, 91, 0, 0.18);
}

.curve {
    fill: none;
    stroke: rgba(255, 255, 255, 0.75);
    stroke-width: 2;
}

.curve.ember {
    stroke: var(--color-accent);
}

.color-strip {
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 1;
}
</style>
