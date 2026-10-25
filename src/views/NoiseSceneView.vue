<script setup>
import { getSceneEngine } from '../scenes/noise-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene :engine="engine" scene_name="noise-scene" :scroll_hint="localize('noise.scroll_hint')">
        <h2 class="scene-description-title">{{ localize('noise.description_title') }}</h2>
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
