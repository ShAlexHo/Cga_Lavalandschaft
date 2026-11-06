<script setup>
import { ref } from 'vue';
import { localize } from '../ui/language_state.js';

const properties = defineProps({
    seminar_url: { type: String, required: true },
});

const AUTHOR_EMAIL_PARTS = ['shyue-shyang_alexander.ho', 'stud.tu-darmstadt.de'];
const seminar_url_text = properties.seminar_url.replace(/^https:\/\//, '').replace(/\/$/, '');

const footer = ref(null);

function writeToAuthor() {
    window.location.href = `mailto:${AUTHOR_EMAIL_PARTS.join('@')}`;
}

defineExpose({
    show: () => footer.value.scrollIntoView({ behavior: 'smooth' }),
});
</script>

<template>
    <footer id="course-note" ref="footer" class="course-footer">
        <h2 class="course-title"><sup class="footnote-number">1</sup> {{ localize('landing.course_title') }}</h2>
        <p>{{ localize('landing.course_text_1') }}</p>
        <p>{{ localize('landing.course_text_2') }}</p>
        <p>
            {{ localize('landing.course_website') }}
            <a :href="properties.seminar_url" class="text-link" target="_blank" rel="noopener noreferrer">{{ seminar_url_text }}</a>
        </p>
        <address class="author-details">
            <span class="author-details-name">{{ localize('landing.author_name') }}</span>
            <span>{{ localize('landing.author_degree') }}</span>
            <span>{{ localize('landing.author_university') }}</span>
            <a href="#" class="text-link" @click.prevent="writeToAuthor">{{ AUTHOR_EMAIL_PARTS.join('[at]') }}</a>
        </address>
    </footer>
</template>

<style scoped>
.course-footer {
    padding: 24px 24px 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    line-height: 1.6;
}

.course-title {
    color: var(--color-text);
    font-size: 0.8rem;
    font-weight: 600;
}

.footnote-number {
    color: var(--color-accent);
}

p {
    margin-top: 0.6em;
}

.author-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-style: normal;
}

.author-details-name {
    color: var(--color-text);
    font-weight: 600;
}

@media (max-width: 600px) {
    .course-footer {
        padding: 20px 16px 24px;
    }
}
</style>
