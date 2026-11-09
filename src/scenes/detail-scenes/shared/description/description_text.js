import { localize, current_language } from '../../../../ui/language_state.js';

export function createDescriptionText(detail_key) {
    return key => localize(`details.${detail_key}.description.${key}`);
}

export function formatNumber(value, maximum_fraction_digits = 2) {
    return new Intl.NumberFormat(current_language.value, { maximumFractionDigits: maximum_fraction_digits }).format(value);
}

const SCENE_REFERENCE = /\b(?:Szene|scene) (\d{1,2})\b/gi;

export function splitSceneReferences(text, scene_names) {
    const parts = [];
    let last_index = 0;
    for (const match of text.matchAll(SCENE_REFERENCE)) {
        const scene_name = scene_names[Number(match[1]) - 1];
        if (!scene_name) continue;
        if (match.index > last_index) parts.push({ text: text.slice(last_index, match.index) });
        parts.push({ text: match[0], scene_name });
        last_index = match.index + match[0].length;
    }
    if (last_index < text.length) parts.push({ text: text.slice(last_index) });
    return parts;
}
