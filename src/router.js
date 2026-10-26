import { createRouter, createWebHistory } from 'vue-router';
import LandingView from './views/LandingView.vue';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'landing', component: LandingView },
        { path: '/main-scene', name: 'main-scene', component: () => import('./views/MainSceneView.vue'), meta: { scene: true } },
        { path: '/metaballs-scene', name: 'metaballs-scene', component: () => import('./views/MetaballsSceneView.vue'), meta: { scene: true } },
        { path: '/noise-scene', name: 'noise-scene', component: () => import('./views/NoiseSceneView.vue'), meta: { scene: true } },
        { path: '/surface-scene', name: 'surface-scene', component: () => import('./views/SurfaceSceneView.vue'), meta: { scene: true } },
        { path: '/:path(.*)*', redirect: { name: 'landing' } },
    ],
});
