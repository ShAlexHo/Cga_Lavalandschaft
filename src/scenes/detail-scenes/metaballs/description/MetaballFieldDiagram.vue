<script setup>
import { computed } from 'vue';
import { fieldValue, isoContour } from './metaball_field_contour.js';

const VIEW = { x_min: -3, x_max: 6, y_min: -3, y_max: 3 };
const PIXELS_PER_UNIT = 56;
const WIDTH = (VIEW.x_max - VIEW.x_min) * PIXELS_PER_UNIT;
const HEIGHT = (VIEW.y_max - VIEW.y_min) * PIXELS_PER_UNIT;
const LABEL_OFFSET = 10;

const properties = defineProps({
    balls: { type: Array, required: true },
    threshold: { type: Number, required: true },
    point: { type: Object, required: true },
    show_single_circles: { type: Boolean, default: false },
    description: { type: String, required: true },
});

function toSvgX(x) {
    return (x - VIEW.x_min) * PIXELS_PER_UNIT;
}

function toSvgY(y) {
    return (VIEW.y_max - y) * PIXELS_PER_UNIT;
}

function range(minimum, maximum) {
    return Array.from({ length: maximum - minimum + 1 }, (_, i) => minimum + i);
}

const grid_xs = range(VIEW.x_min, VIEW.x_max);
const grid_ys = range(VIEW.y_min, VIEW.y_max);

const contour_path = computed(() => {
    const points = isoContour(properties.balls, properties.threshold);
    return `${points.map((point, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(point.x).toFixed(2)},${toSvgY(point.y).toFixed(2)}`).join(' ')} Z`;
});

const single_radius = computed(() => PIXELS_PER_UNIT / properties.threshold);

const is_point_inside = computed(() => fieldValue(properties.point, properties.balls) >= properties.threshold);
</script>

<template>
    <svg class="metaball-field-diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <g class="grid">
            <line v-for="x in grid_xs" :key="`x${x}`" :x1="toSvgX(x)" :x2="toSvgX(x)" :y1="0" :y2="HEIGHT" />
            <line v-for="y in grid_ys" :key="`y${y}`" :x1="0" :x2="WIDTH" :y1="toSvgY(y)" :y2="toSvgY(y)" />
        </g>
        <g class="axes">
            <line :x1="0" :x2="WIDTH" :y1="toSvgY(0)" :y2="toSvgY(0)" />
            <line :x1="toSvgX(0)" :x2="toSvgX(0)" :y1="0" :y2="HEIGHT" />
            <text :x="WIDTH - LABEL_OFFSET" :y="toSvgY(0) - LABEL_OFFSET" text-anchor="end">x</text>
            <text :x="toSvgX(0) + LABEL_OFFSET" :y="2 * LABEL_OFFSET">y</text>
            <template v-for="x in grid_xs" :key="`tick-x${x}`">
                <text v-if="x !== 0 && x !== VIEW.x_min && x !== VIEW.x_max" class="tick" :x="toSvgX(x)" :y="toSvgY(0) + 2 * LABEL_OFFSET" text-anchor="middle">{{ x }}</text>
            </template>
            <template v-for="y in grid_ys" :key="`tick-y${y}`">
                <text v-if="y !== 0 && y !== VIEW.y_min && y !== VIEW.y_max" class="tick" :x="toSvgX(0) - LABEL_OFFSET" :y="toSvgY(y) + LABEL_OFFSET / 2" text-anchor="end">{{ y }}</text>
            </template>
        </g>

        <path class="metaball" :d="contour_path" />
        <template v-if="properties.show_single_circles">
            <circle v-for="(ball, i) in properties.balls" :key="`circle${i}`" class="single-circle" :cx="toSvgX(ball.x)" :cy="toSvgY(ball.y)" :r="single_radius" />
        </template>

        <g v-for="(ball, i) in properties.balls" :key="`ball${i}`" class="ball-center">
            <circle :cx="toSvgX(ball.x)" :cy="toSvgY(ball.y)" r="4" />
            <text :x="toSvgX(ball.x) - LABEL_OFFSET / 2" :y="toSvgY(ball.y) - LABEL_OFFSET" text-anchor="middle">c<tspan baseline-shift="sub" font-size="0.7em">{{ i + 1 }}</tspan></text>
        </g>

        <g class="test-point" :class="{ inside: is_point_inside }">
            <circle :cx="toSvgX(properties.point.x)" :cy="toSvgY(properties.point.y)" r="3.5" />
            <text :x="toSvgX(properties.point.x)" :y="toSvgY(properties.point.y) - 1.2 * LABEL_OFFSET" text-anchor="middle">P</text>
        </g>
    </svg>
</template>

<style scoped>
.metaball-field-diagram {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    font-family: inherit;
}

.grid line {
    stroke: rgba(255, 255, 255, 0.07);
    stroke-width: 1;
}

.axes line {
    stroke: var(--color-text-muted);
    stroke-width: 1.5;
}

.axes text {
    fill: var(--color-text-muted);
    font-size: 16px;
    font-style: italic;
}

.axes .tick {
    font-size: 13px;
    font-style: normal;
}

.metaball {
    fill: var(--color-accent);
    fill-opacity: 0.28;
    stroke: var(--color-accent);
    stroke-width: 2.5;
}

.single-circle {
    fill: none;
    stroke: var(--color-text);
    stroke-width: 1.5;
    stroke-dasharray: 6 5;
    opacity: 0.7;
}

.ball-center circle {
    fill: var(--color-text);
}

.ball-center text,
.test-point text {
    fill: var(--color-text);
    font-size: 17px;
    font-style: italic;
}

.test-point circle {
    fill: var(--color-background);
    stroke: var(--color-text);
    stroke-width: 1.5;
}

.test-point.inside circle {
    fill: var(--color-text);
}
</style>
