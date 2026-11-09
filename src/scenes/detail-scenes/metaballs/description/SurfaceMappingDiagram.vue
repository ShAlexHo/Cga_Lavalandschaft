<script setup>
import { localize } from '../../../../ui/language_state.js';
import { surfaceProfile } from './surface_example.js';

const X_MAX = 6;
const SAMPLES_PER_UNIT = 40;
const NORMAL_COUNT = 13;
const WIDTH = 720;
const ROW_HEIGHT = 135;
const LABEL_HEIGHT = 26;
const BUMP_PIXELS = 30;
const NORMAL_LENGTH = 34;

const properties = defineProps({
    description: { type: String, required: true },
});

const PROFILE = surfaceProfile(X_MAX, SAMPLES_PER_UNIT, NORMAL_COUNT);
const PIXELS_PER_UNIT = WIDTH / X_MAX;

function toScreen(x, height, baseline) {
    return { x: x * PIXELS_PER_UNIT, y: baseline - height * BUMP_PIXELS };
}

function normalArrow({ x, height, slope }, baseline, is_displaced) {
    const start = toScreen(x, is_displaced ? height : 0, baseline);
    const screen_slope = slope * BUMP_PIXELS / PIXELS_PER_UNIT;
    const length = Math.hypot(screen_slope, 1);
    return {
        x1: start.x, y1: start.y,
        x2: start.x - (screen_slope / length) * NORMAL_LENGTH,
        y2: start.y - NORMAL_LENGTH / length,
    };
}

const ROWS = [
    { label_key: 'gui.surface.bump_mapping', is_displaced: false },
    { label_key: 'gui.surface.displacement_mapping', is_displaced: true },
].map((row, i) => {
    const baseline = i * ROW_HEIGHT + ROW_HEIGHT - 36;
    const surface = PROFILE.surface
        .map(({ x, height }) => toScreen(x, row.is_displaced ? height : 0, baseline))
        .map(({ x, y }) => `${x},${y}`)
        .join(' ');
    const normals = PROFILE.normals.map(sample => normalArrow(sample, baseline, row.is_displaced));
    return { ...row, label_y: i * ROW_HEIGHT + LABEL_HEIGHT - 6, surface, normals };
});
const HEIGHT = ROWS.length * ROW_HEIGHT;
</script>

<template>
    <svg class="diagram" :viewBox="`-10 0 ${WIDTH + 20} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <defs>
            <marker id="surface-normal-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path class="arrow-head" d="M0,0 L10,5 L0,10 z" />
            </marker>
        </defs>
        <g v-for="row in ROWS" :key="row.label_key">
            <text class="label" x="0" :y="row.label_y">{{ localize(row.label_key) }}</text>
            <line v-for="(normal, index) in row.normals" :key="index" class="normal" v-bind="normal" marker-end="url(#surface-normal-arrow)" />
            <polyline class="surface" :points="row.surface" />
        </g>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.surface {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2.5;
    stroke-linejoin: round;
}

.normal {
    stroke: rgba(255, 255, 255, 0.7);
    stroke-width: 1.5;
}

.arrow-head {
    fill: rgba(255, 255, 255, 0.7);
}
</style>
