import { ref } from 'vue';
import { getLanguage, onLanguageChange, translate } from './language.js';

export const current_language = ref(getLanguage());
onLanguageChange(language => { current_language.value = language; });

export function localize(key) {
    return translate(key, current_language.value);
}
