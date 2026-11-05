<script setup>
import { localize } from '../../../../ui/language_state.js';
import { createDescriptionText } from './description_text.js';

const properties = defineProps({
    detail_key: { type: String, required: true },
    controls: { type: Array, required: true },
});

const descriptionText = createDescriptionText(properties.detail_key);

function controlLabel({ folder_key, label_key }) {
    return [folder_key, label_key].filter(Boolean).map(localize).join(' › ');
}
</script>

<template>
    <section class="try-it">
        <h3>{{ descriptionText('try_heading') }}</h3>
        <p>{{ descriptionText('try_text') }}</p>
        <dl class="scene-controls">
            <template v-for="control in properties.controls" :key="control.text_key">
                <dt>{{ controlLabel(control) }}</dt>
                <dd>{{ descriptionText(control.text_key) }}</dd>
            </template>
        </dl>
        <p>{{ descriptionText('try_tip') }}</p>
    </section>
</template>

<style scoped src="./description.css"></style>

<style scoped>
.try-it {
    margin: 2.5em 0;
    padding: 1.4em 1.6em;
    border: 1px solid var(--color-accent-soft);
    border-left: 4px solid var(--color-accent);
    border-radius: 12px;
    background: rgba(255, 91, 0, 0.06);
}

.try-it h3 {
    margin-top: 0;
    color: var(--color-accent);
}

.try-it p:first-of-type {
    margin-top: 0.4em;
}

.scene-controls {
    margin: 1em 0;
}

.scene-controls dt {
    margin-top: 0.8em;
    font-weight: 600;
}

.scene-controls dd {
    margin-left: 1.2em;
    color: var(--color-text-muted);
}
</style>
