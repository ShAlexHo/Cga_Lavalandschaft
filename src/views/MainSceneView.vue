<script setup>
import { getSceneEngine } from '../scenes/main-scene/scene_engine.js';
import SceneStage from '../components/SceneStage.vue';

const engine = getSceneEngine();
</script>

<template>
    <div class="main-scene-view">
        <SceneStage :engine="engine" scene_name="main-scene" />
    </div>
</template>

<style scoped>
.main-scene-view {
    position: fixed;
    inset: 0;
}
</style>
