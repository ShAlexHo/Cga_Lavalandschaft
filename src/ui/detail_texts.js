import { localize } from './language_state.js';
import { numberedTitle } from '../scenes/detail-scenes/detail_scenes.js';

export function detailText(detail, text) {
    return localize(`${detail.message_key_prefix}.${text}`);
}

export function detailTitle(detail) {
    return numberedTitle(detail, detailText(detail, 'title'));
}
