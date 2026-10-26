export const DETAIL_SCENES = [
    { scene_name: 'metaballs-scene', message_key_prefix: 'details.metaballs' },
    { scene_name: 'noise-scene', message_key_prefix: 'details.noise' },
    { scene_name: 'surface-scene', message_key_prefix: 'details.surface' },
    { scene_name: 'ground-scene', message_key_prefix: 'details.ground' },
].map((detail, index) => ({ ...detail, number: index + 1 }));

export function findDetailScene(scene_name) {
    return DETAIL_SCENES.find(detail => detail.scene_name === scene_name) ?? null;
}

export function neighbouringDetailScenes(scene_name) {
    const index = DETAIL_SCENES.findIndex(detail => detail.scene_name === scene_name);
    if (index === -1) return { previous: null, next: null };
    return { previous: DETAIL_SCENES[index - 1] ?? null, next: DETAIL_SCENES[index + 1] ?? null };
}

export function numberedTitle(detail, title) {
    return `${detail.number}. ${title}`;
}
