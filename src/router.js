import { h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from './views/LandingView.vue';
import { DETAIL_SCENES } from './scenes/detail-scenes/detail_scenes.js';
import { MAIN_SCENE_NAME } from './scenes/main-scene/scene_name.js';

function detailSceneRoute(detail) {
    return {
        path: `/${detail.scene_name}`,
        name: detail.scene_name,
        async component() {
            const [{ default: DescribedScene }, { getSceneEngine }] = await Promise.all([
                import('./components/DescribedScene.vue'),
                detail.loadEngine(),
            ]);
            return {
                setup() {
                    const engine = getSceneEngine();
                    return () => h(DescribedScene, { engine, scene_name: detail.scene_name });
                },
            };
        },
        meta: { scene: true },
    };
}

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'landing', component: LandingView },
        { path: `/${MAIN_SCENE_NAME}`, name: MAIN_SCENE_NAME, component: () => import('./views/MainSceneView.vue'), meta: { scene: true } },
        ...DETAIL_SCENES.map(detailSceneRoute),
        { path: '/:path(.*)*', redirect: { name: 'landing' } },
    ],
});
