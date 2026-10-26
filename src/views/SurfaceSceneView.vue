<script setup>
import { getSceneEngine } from '../scenes/surface-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene :engine="engine" scene_name="surface-scene" :scroll_hint="localize('surface.scroll_hint')">
        <h2 class="scene-description-title">{{ localize('surface.description_title') }}</h2>
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
