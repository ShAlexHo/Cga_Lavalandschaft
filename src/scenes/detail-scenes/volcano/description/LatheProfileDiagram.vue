<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { PROFILE_POINTS } from './volcano_example.js';

const WIDTH = 720;
const HEIGHT = 300;
const PIXELS_PER_UNIT = 22;
const AXIS_X = WIDTH / 2;
const GROUND_Y = 236;
const ELLIPSE_FLATTENING = 0.12;
const POINT_LABELS = [
    { key: 'profile_foot', offset_x: 0, offset_y: 30, anchor: 'end' },
    { key: 'profile_rim', offset_x: 10, offset_y: -10, anchor: 'start' },
    { key: 'profile_crater', offset_x: 6, offset_y: 24, anchor: 'start' },
];

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('volcano');

function toScreen({ x, y }, side = 1) {
    return { x: AXIS_X + side * x * PIXELS_PER_UNIT, y: GROUND_Y - y * PIXELS_PER_UNIT };
}

const toPath = side => PROFILE_POINTS.map(point => toScreen(point, side)).map(({ x, y }) => `${x},${y}`).join(' ');
const PROFILE_PATH = toPath(1);
const MIRRORED_PATH = toPath(-1);
const POINTS = PROFILE_POINTS.map((point, i) => ({ ...toScreen(point), label: POINT_LABELS[i] }));
const RINGS = PROFILE_POINTS.slice(0, 2).map(point => {
    const radius = point.x * PIXELS_PER_UNIT;
    return { y: toScreen(point).y, radius_x: radius, radius_y: radius * ELLIPSE_FLATTENING };
});
const AXIS_TOP = 28;
</script>

<template>
    <svg class="diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <ellipse v-for="ring in RINGS" :key="ring.y" class="ring" :cx="AXIS_X" :cy="ring.y" :rx="ring.radius_x" :ry="ring.radius_y" />
        <line class="axis" :x1="AXIS_X" :y1="AXIS_TOP" :x2="AXIS_X" :y2="GROUND_Y + 30" />
        <text class="label" :x="AXIS_X + 10" :y="AXIS_TOP + 6">{{ descriptionText('profile_axis') }}</text>
        <polyline class="mirrored" :points="MIRRORED_PATH" />
        <polyline class="profile" :points="PROFILE_PATH" />
        <g v-for="point in POINTS" :key="point.label.key">
            <circle class="point" :cx="point.x" :cy="point.y" r="4" />
            <text
                class="label"
                :x="point.x + point.label.offset_x"
                :y="point.y + point.label.offset_y"
                :text-anchor="point.label.anchor"
            >{{ descriptionText(point.label.key) }}</text>
        </g>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.axis {
    stroke: rgba(255, 255, 255, 0.45);
    stroke-width: 1;
    stroke-dasharray: 6 5;
}

.ring,
.mirrored {
    fill: none;
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1.5;
    stroke-dasharray: 5 5;
}

.profile {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2.5;
    stroke-linejoin: round;
}

.point {
    fill: var(--color-accent);
}
</style>
