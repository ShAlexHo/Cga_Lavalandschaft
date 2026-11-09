<script setup>
import { computed } from 'vue';
import { DETAIL_SCENES } from '../../detail_scenes.js';
import { splitSceneReferences } from './description_text.js';

const properties = defineProps({
    text: { type: String, required: true },
});

const SCENE_NAMES = DETAIL_SCENES.map(detail => detail.scene_name);
const parts = computed(() => splitSceneReferences(properties.text, SCENE_NAMES));
</script>

<template>
    <template v-for="(part, index) in parts" :key="index">
        <RouterLink v-if="part.scene_name" :to="{ name: part.scene_name }" class="text-link">{{ part.text }}</RouterLink>
        <template v-else>{{ part.text }}</template>
    </template>
</template>
