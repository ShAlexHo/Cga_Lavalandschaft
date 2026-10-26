<script setup>
import { getSceneEngine } from '../scenes/ground-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene
        :engine="engine"
        scene_name="ground-scene"
        :title="localize('ground.description_title')"
        :scroll_hint="localize('ground.scroll_hint')"
    >
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
