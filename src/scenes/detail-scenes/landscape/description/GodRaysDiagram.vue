<script setup>
import { createDescriptionText } from '../../shared/description/description_text.js';
import { createMask, sampleTowardsLight, isInsidePolygon } from './god_rays_example.js';

const WIDTH = 720;
const HEIGHT = 380;
const SUN = { x: 340, y: 160, radius: 55 };
const VOLCANO = [{ x: 60, y: HEIGHT }, { x: 380, y: 190 }, { x: 500, y: 190 }, { x: 720, y: HEIGHT }];
const PIXELS = [
    { label_key: 'pixel_open', x: 180, y: 40 },
    { label_key: 'pixel_blocked', x: 700, y: 300 },
];
const SAMPLE_RADIUS = 4;
const VOLCANO_REACH = 0.5;
const DARK_PIXEL_COLOR = [20, 14, 12];
const BRIGHT_PIXEL_COLOR = [255, 216, 74];

const properties = defineProps({
    description: { type: String, required: true },
});

const descriptionText = createDescriptionText('sun_god_rays');
const mask = createMask(SUN, VOLCANO);
function visibleSamples(pixel, samples) {
    const distanceFromPixel = sample => Math.hypot(sample.x - pixel.x, sample.y - pixel.y);
    const distance_to_sun_edge = Math.hypot(SUN.x - pixel.x, SUN.y - pixel.y) - SUN.radius;
    const sun_reach = distance_to_sun_edge + SUN.radius;
    const entry = samples.find(sample => isInsidePolygon(sample, VOLCANO));
    if (!entry) return samples.filter(sample => distanceFromPixel(sample) < sun_reach);
    const entry_distance = distanceFromPixel(entry);
    const reach = Math.max(entry_distance, entry_distance + (distance_to_sun_edge - entry_distance) * VOLCANO_REACH);
    return samples.filter(sample => distanceFromPixel(sample) < Math.min(reach, sun_reach));
}

function pixelColor(brightness_ratio) {
    const [r, g, b] = DARK_PIXEL_COLOR.map((dark, i) => Math.round(dark + (BRIGHT_PIXEL_COLOR[i] - dark) * brightness_ratio));
    return `rgb(${r}, ${g}, ${b})`;
}

const RESULTS = PIXELS.map(pixel => {
    const { samples, brightness } = sampleTowardsLight(pixel, SUN, mask);
    return { ...pixel, brightness, first_weight: samples[0].weight, samples: visibleSamples(pixel, samples) };
});
const BRIGHTEST = Math.max(...RESULTS.map(result => result.brightness));
const VOLCANO_POINTS = VOLCANO.map(({ x, y }) => `${x},${y}`).join(' ');
</script>

<template>
    <svg class="diagram" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="properties.description">
        <rect class="mask-background" x="0" y="0" :width="WIDTH" :height="HEIGHT" />
        <circle class="sun" :cx="SUN.x" :cy="SUN.y" :r="SUN.radius" />
        <polygon class="volcano" :points="VOLCANO_POINTS" />
        <g v-for="result in RESULTS" :key="result.label_key">
            <line class="path" :x1="result.x" :y1="result.y" :x2="result.samples.at(-1).x" :y2="result.samples.at(-1).y" />
            <circle
                v-for="(sample, index) in result.samples"
                :key="index"
                class="sample"
                :class="{ lit: sample.value > 0 }"
                :cx="sample.x"
                :cy="sample.y"
                :r="SAMPLE_RADIUS"
                :opacity="0.25 + 0.75 * sample.weight / result.first_weight"
            />
            <circle class="pixel" :cx="result.x" :cy="result.y" r="11" :fill="pixelColor(result.brightness / BRIGHTEST)" />
            <text class="label" :x="result.x - 18" :y="result.y + 5" text-anchor="end">{{ descriptionText(result.label_key) }}</text>
        </g>
    </svg>
</template>

<style scoped src="../../shared/description/diagram.css"></style>

<style scoped>
.mask-background {
    fill: #8a2a1c;
}

.sun {
    fill: #fff;
}

.volcano {
    fill: #000;
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1.5;
    stroke-dasharray: 5 5;
}

.path {
    stroke: rgba(255, 255, 255, 0.25);
    stroke-width: 1;
}

.sample {
    fill: none;
    stroke: rgba(255, 255, 255, 0.6);
    stroke-width: 1;
}

.sample.lit {
    fill: #ffd84a;
    stroke: none;
}

.pixel {
    stroke: #fff;
    stroke-width: 2;
}

.label {
    fill: #fff;
}
</style>
