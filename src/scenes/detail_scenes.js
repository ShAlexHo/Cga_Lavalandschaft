import metaballs_preview_url from '../assets/metaballs_preview.jpg';
import noise_preview_url from '../assets/noise_preview.jpg';
import surface_preview_url from '../assets/surface_preview.jpg';
import ground_preview_url from '../assets/ground_preview.jpg';
import volcano_preview_url from '../assets/volcano_preview.jpg';
import radial_flow_preview_url from '../assets/radial_flow_preview.jpg';
import landscape_volcano_preview_url from '../assets/landscape_volcano_preview.jpg';

export const DETAIL_SCENES = [
    {
        scene_name: 'metaballs-scene', message_key_prefix: 'details.metaballs', preview_url: metaballs_preview_url,
        loadEngine: () => import('./metaballs-scene/scene_engine.js'),
    },
    {
        scene_name: 'noise-scene', message_key_prefix: 'details.noise', preview_url: noise_preview_url,
        loadEngine: () => import('./noise-scene/scene_engine.js'),
    },
    {
        scene_name: 'surface-scene', message_key_prefix: 'details.surface', preview_url: surface_preview_url,
        loadEngine: () => import('./surface-scene/scene_engine.js'),
    },
    {
        scene_name: 'ground-scene', message_key_prefix: 'details.ground', preview_url: ground_preview_url,
        loadEngine: () => import('./ground-scene/scene_engine.js'),
    },
    {
        scene_name: 'volcano-scene', message_key_prefix: 'details.volcano', preview_url: volcano_preview_url,
        loadEngine: () => import('./volcano-scene/scene_engine.js'),
    },
    {
        scene_name: 'radial-flow-scene', message_key_prefix: 'details.radial_flow', preview_url: radial_flow_preview_url,
        loadEngine: () => import('./radial-flow-scene/scene_engine.js'),
    },
    {
        scene_name: 'landscape-volcano-scene', message_key_prefix: 'details.landscape_volcano', preview_url: landscape_volcano_preview_url,
        loadEngine: () => import('./landscape-volcano-scene/scene_engine.js'),
    },
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
