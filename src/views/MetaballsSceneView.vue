<script setup>
import { getSceneEngine } from '../scenes/metaballs-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene
        :engine="engine"
        scene_name="metaballs-scene"
        :title="localize('metaballs.description_title')"
        :scroll_hint="localize('metaballs.scroll_hint')"
    >
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
