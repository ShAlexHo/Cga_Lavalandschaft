<script setup>
import { getSceneEngine } from '../scenes/radial-flow-scene/scene_engine.js';
import DescribedScene from '../components/DescribedScene.vue';
import { localize } from '../language_state.js';

const engine = getSceneEngine();
</script>

<template>
    <DescribedScene
        :engine="engine"
        scene_name="radial-flow-scene"
        :title="localize('radial_flow.description_title')"
        :scroll_hint="localize('radial_flow.scroll_hint')"
    >
        <p>{{ localize('scene.description_in_work') }}</p>
    </DescribedScene>
</template>
