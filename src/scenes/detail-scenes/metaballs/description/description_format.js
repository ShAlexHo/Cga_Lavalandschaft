import { localize, current_language } from '../../../../ui/language_state.js';

export function descriptionText(key) {
    return localize(`details.metaballs.description.${key}`);
}

export function formatNumber(value) {
    return new Intl.NumberFormat(current_language.value, { maximumFractionDigits: 2 }).format(value);
}
