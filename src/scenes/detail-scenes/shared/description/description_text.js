import { localize, current_language } from '../../../../ui/language_state.js';

export function createDescriptionText(detail_key) {
    return key => localize(`details.${detail_key}.description.${key}`);
}

export function formatNumber(value, maximum_fraction_digits = 2) {
    return new Intl.NumberFormat(current_language.value, { maximumFractionDigits: maximum_fraction_digits }).format(value);
}
