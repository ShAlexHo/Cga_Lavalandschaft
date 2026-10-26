<script setup>
import { getSceneEngine } from '../scenes/ground-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene :engine="engine" scene_name="ground-scene" :scroll_hint="localize('ground.scroll_hint')">
        <h2 class="scene-description-title">{{ localize('ground.description_title') }}</h2>
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
