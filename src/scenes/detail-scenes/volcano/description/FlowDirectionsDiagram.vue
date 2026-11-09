<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { BALL_PATHS } from '../../metaballs/metaballs_animation.js';
import { flowAngle } from '../flow_animation.js';
import { LAVA_FLOW_DEFAULTS } from '../config.js';

const WIDTH = 720;
const HEIGHT = 380;
const PANEL_WIDTH = WIDTH / 2;
const LABEL_HEIGHT = 40;
const RADIUS = 140;
const CRATER_RADIUS = 10;
const SECTOR_COUNT = LAVA_FLOW_DEFAULTS.sector_count;

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('lava_flow');

function panel(index, options, label) {
    const center = { x: PANEL_WIDTH * index + PANEL_WIDTH / 2, y: LABEL_HEIGHT + (HEIGHT - LABEL_HEIGHT) / 2 };
    const pointAt = (angle, radius) => ({ x: center.x + radius * Math.cos(angle), y: center.y - radius * Math.sin(angle) });
    const evenAngle = i => (2 * Math.PI * i) / BALL_PATHS.length;
    const balls = BALL_PATHS.map((path, i) => pointAt(options.sectors_enabled ? flowAngle(i, path, options) : evenAngle(i), RADIUS));
    const boundaries = options.sectors_enabled
        ? Array.from({ length: options.sector_count }, (_, k) => pointAt((k + 0.5) * 2 * Math.PI / options.sector_count, RADIUS + 16))
        : [];
    return { center, balls, boundaries, label };
}

const PANELS = [
    panel(0, { sectors_enabled: false }, descriptionText('directions_even')),
    panel(1, { sectors_enabled: true, sector_count: SECTOR_COUNT }, `${SECTOR_COUNT} ${descriptionText('directions_sectors')}`),
];
</script>

<template>
    <svg class="diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <g v-for="panel in PANELS" :key="panel.label">
            <text class="label" :x="panel.center.x" y="28" text-anchor="middle">{{ panel.label }}</text>
            <circle class="outline" :cx="panel.center.x" :cy="panel.center.y" :r="RADIUS" />
            <line
                v-for="(boundary, index) in panel.boundaries"
                :key="`boundary-${index}`"
                class="boundary"
                :x1="panel.center.x"
                :y1="panel.center.y"
                :x2="boundary.x"
                :y2="boundary.y"
            />
            <line
                v-for="(ball, index) in panel.balls"
                :key="`ray-${index}`"
                class="ray"
                :x1="panel.center.x"
                :y1="panel.center.y"
                :x2="ball.x"
                :y2="ball.y"
            />
            <circle v-for="(ball, index) in panel.balls" :key="`ball-${index}`" class="ball" :cx="ball.x" :cy="ball.y" r="6" />
            <circle class="crater" :cx="panel.center.x" :cy="panel.center.y" :r="CRATER_RADIUS" />
        </g>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.label {
    fill: var(--color-text-muted);
    font-size: 17px;
}

.outline {
    fill: none;
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
}

.boundary {
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1;
    stroke-dasharray: 5 5;
}

.ray {
    stroke: var(--color-accent);
    stroke-width: 1;
    opacity: 0.35;
}

.ball {
    fill: var(--color-accent);
}

.crater {
    fill: rgba(255, 255, 255, 0.15);
    stroke: rgba(255, 255, 255, 0.45);
}
</style>
