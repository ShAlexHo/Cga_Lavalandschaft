import { ref } from 'vue';
import { getLanguage, onLanguageChange, translate } from './ui/language.js';

export const current_language = ref(getLanguage());
onLanguageChange(language => { current_language.value = language; });

// reads current_language, so templates re-render on a language switch
export function localize(key) {
    return translate(key, current_language.value);
}
