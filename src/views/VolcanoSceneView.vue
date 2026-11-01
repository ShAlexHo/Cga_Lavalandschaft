<script setup>
import { getSceneEngine } from '../scenes/volcano-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene
        :engine="engine"
        scene_name="volcano-scene"
        :title="localize('volcano.description_title')"
        :scroll_hint="localize('volcano.scroll_hint')"
    >
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
