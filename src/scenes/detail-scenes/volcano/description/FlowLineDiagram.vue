<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { PROFILE_POINTS, EXAMPLE_FLOW, flowLine } from './volcano_example.js';

const WIDTH = 720;
const PIXELS_PER_UNIT = 40;
const LEFT_MARGIN = 40;
const TOP_MARGIN = 30;
const BOTTOM_MARGIN = 24;
const SLOPE_STEP = 1;
const BALL_RADIUS = 1;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('volcano');
const LINE = flowLine(EXAMPLE_FLOW);
const SLOPE = EXAMPLE_FLOW.flow_slope;
const LAST_DISTANCE = Math.min(LINE.end.x, (WIDTH - LEFT_MARGIN - 12) / PIXELS_PER_UNIT);
const LAST_POINT = { x: LAST_DISTANCE, y: LINE.heightAt(LAST_DISTANCE) };
const TOP_HEIGHT = Math.max(...PROFILE_POINTS.map(point => point.y), LINE.start.y);
const HEIGHT = TOP_MARGIN + (TOP_HEIGHT - LAST_POINT.y) * PIXELS_PER_UNIT + BOTTOM_MARGIN;
const GROUND_Y = TOP_MARGIN + TOP_HEIGHT * PIXELS_PER_UNIT;

function toScreen({ x, y }) {
    return { x: LEFT_MARGIN + x * PIXELS_PER_UNIT, y: GROUND_Y - y * PIXELS_PER_UNIT };
}

const toPoints = points => points.map(toScreen).map(({ x, y }) => `${x},${y}`).join(' ');
const VOLCANO_PATH = toPoints([{ x: 0, y: 0 }, { x: 0, y: PROFILE_POINTS.at(-1).y }, ...[...PROFILE_POINTS].reverse()]);
const ABOVE_GROUND = [toScreen(LINE.start), toScreen(LINE.ground)];
const BELOW_GROUND = [toScreen(LINE.ground), toScreen(LAST_POINT)];
const BALL = toScreen(LINE.ball);
const START = toScreen(LINE.start);
const SLOPE_START_DISTANCE = LINE.crossing.x * 0.45;
const SLOPE_CORNER = toScreen({ x: SLOPE_START_DISTANCE, y: LINE.start.y - SLOPE * SLOPE_START_DISTANCE });
const SLOPE_RIGHT = toScreen({ x: SLOPE_START_DISTANCE + SLOPE_STEP, y: LINE.start.y - SLOPE * SLOPE_START_DISTANCE });
const SLOPE_BOTTOM = toScreen({ x: SLOPE_START_DISTANCE + SLOPE_STEP, y: LINE.start.y - SLOPE * (SLOPE_START_DISTANCE + SLOPE_STEP) });
</script>

<template>
    <svg class="diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <polygon class="volcano" :points="VOLCANO_PATH" />
        <line class="ground" x1="0" :y1="GROUND_Y" :x2="WIDTH" :y2="GROUND_Y" />
        <text class="label" :x="WIDTH - 8" :y="GROUND_Y - 8" text-anchor="end">{{ descriptionText('flow_ground') }}</text>
        <line class="height" :x1="START.x" :y1="GROUND_Y" :x2="START.x" :y2="START.y" />
        <text class="symbol" :x="START.x - 22" :y="(GROUND_Y + START.y) / 2 + 5">b</text>
        <polyline class="slope" :points="`${SLOPE_CORNER.x},${SLOPE_CORNER.y} ${SLOPE_RIGHT.x},${SLOPE_RIGHT.y} ${SLOPE_BOTTOM.x},${SLOPE_BOTTOM.y}`" />
        <text class="symbol" :x="SLOPE_RIGHT.x + 8" :y="(SLOPE_RIGHT.y + SLOPE_BOTTOM.y) / 2 + 6">m</text>
        <text class="symbol" :x="(SLOPE_CORNER.x + SLOPE_RIGHT.x) / 2" :y="SLOPE_CORNER.y - 8" text-anchor="middle">{{ SLOPE_STEP }}</text>
        <line class="lava" :x1="ABOVE_GROUND[0].x" :y1="ABOVE_GROUND[0].y" :x2="ABOVE_GROUND[1].x" :y2="ABOVE_GROUND[1].y" />
        <line class="lava hidden" :x1="BELOW_GROUND[0].x" :y1="BELOW_GROUND[0].y" :x2="BELOW_GROUND[1].x" :y2="BELOW_GROUND[1].y" />
        <circle class="ball" :cx="BALL.x" :cy="BALL.y" :r="BALL_RADIUS * PIXELS_PER_UNIT" />
        <circle class="start" :cx="START.x" :cy="START.y" r="5" />
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.volcano {
    fill: rgba(255, 255, 255, 0.1);
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1.5;
}

.ground {
    stroke: rgba(255, 255, 255, 0.45);
    stroke-width: 1.5;
}

.height,
.slope {
    fill: none;
    stroke: rgba(255, 255, 255, 0.7);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
}

.lava {
    stroke: var(--color-accent);
    stroke-width: 3;
    stroke-linecap: round;
}

.lava.hidden {
    stroke-dasharray: 6 6;
    opacity: 0.6;
}

.start {
    fill: var(--color-accent);
}

.ball {
    fill: rgba(255, 91, 0, 0.12);
    stroke: var(--color-accent);
    stroke-width: 2;
    stroke-dasharray: 6 5;
}

.symbol {
    fill: var(--color-text);
    font-size: 18px;
    font-style: italic;
}
</style>
