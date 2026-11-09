<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { ringBalls, contourSegments, INNER_RING_RADIUS, OUTER_RING_RADIUS, BALL_RADIUS } from './flow_spread_example.js';

const WIDTH = 720;
const HEIGHT = 420;
const PIXELS_PER_UNIT = 25;
const CENTER = { x: 250, y: HEIGHT / 2 };
const EXTENT = OUTER_RING_RADIUS + BALL_RADIUS + 0.5;
const CELL_SIZE = 0.08;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('lava_flow');

function toScreen({ x, y }) {
    return { x: CENTER.x + x * PIXELS_PER_UNIT, y: CENTER.y - y * PIXELS_PER_UNIT };
}

const INNER_BALLS = ringBalls(INNER_RING_RADIUS);
const OUTER_BALLS = ringBalls(OUTER_RING_RADIUS);
const RAYS = OUTER_BALLS.map(ball => toScreen(ball));
const CONTOUR_PATH = contourSegments([...INNER_BALLS, ...OUTER_BALLS], EXTENT, CELL_SIZE)
    .map(({ start, end }) => {
        const from = toScreen(start);
        const to = toScreen(end);
        return `M${from.x.toFixed(1)},${from.y.toFixed(1)}L${to.x.toFixed(1)},${to.y.toFixed(1)}`;
    })
    .join('');
const CENTERS = [...INNER_BALLS, ...OUTER_BALLS].map(toScreen);
const LABEL_X = CENTER.x + (OUTER_RING_RADIUS + BALL_RADIUS + 1.2) * PIXELS_PER_UNIT;
const INNER_LABEL_TARGET = toScreen({ x: INNER_BALLS[5].x + BALL_RADIUS * 0.8, y: INNER_BALLS[5].y - BALL_RADIUS * 0.5 });
const INNER_LABEL_Y = CENTER.y + 3.6 * PIXELS_PER_UNIT;
const OUTER_LABEL_TARGET = toScreen(OUTER_BALLS[1]);
</script>

<template>
    <svg class="diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <circle class="ring" :cx="CENTER.x" :cy="CENTER.y" :r="INNER_RING_RADIUS * PIXELS_PER_UNIT" />
        <circle class="ring" :cx="CENTER.x" :cy="CENTER.y" :r="OUTER_RING_RADIUS * PIXELS_PER_UNIT" />
        <line v-for="(ray, index) in RAYS" :key="index" class="ray" :x1="CENTER.x" :y1="CENTER.y" :x2="ray.x" :y2="ray.y" />
        <path class="contour" :d="CONTOUR_PATH" />
        <circle v-for="(center, index) in CENTERS" :key="`center-${index}`" class="center" :cx="center.x" :cy="center.y" r="3" />
        <circle class="crater" :cx="CENTER.x" :cy="CENTER.y" r="4" />
        <line class="pointer" :x1="LABEL_X - 8" :y1="INNER_LABEL_Y - 5" :x2="INNER_LABEL_TARGET.x" :y2="INNER_LABEL_TARGET.y" />
        <text class="label" :x="LABEL_X" :y="INNER_LABEL_Y">{{ descriptionText('spread_inner') }}</text>
        <line class="pointer" :x1="LABEL_X - 8" :y1="OUTER_LABEL_TARGET.y - 4" :x2="OUTER_LABEL_TARGET.x + BALL_RADIUS * PIXELS_PER_UNIT" :y2="OUTER_LABEL_TARGET.y" />
        <text class="label" :x="LABEL_X" :y="OUTER_LABEL_TARGET.y + 1">{{ descriptionText('spread_outer') }}</text>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.ring {
    fill: none;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 1;
    stroke-dasharray: 5 5;
}

.ray {
    stroke: rgba(255, 255, 255, 0.15);
    stroke-width: 1;
}

.contour {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2.5;
    stroke-linecap: round;
}

.center {
    fill: var(--color-accent);
}

.crater {
    fill: rgba(255, 255, 255, 0.6);
}

.pointer {
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1;
}

.label {
    fill: var(--color-text-muted);
    font-size: 16px;
}
</style>
