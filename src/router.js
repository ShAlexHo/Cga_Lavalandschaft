import { createRouter, createWebHistory } from 'vue-router';
import LandingView from './views/LandingView.vue';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'landing', component: LandingView },
        { path: '/main-scene', name: 'main-scene', component: () => import('./views/MainSceneView.vue') },
        { path: '/:path(.*)*', redirect: { name: 'landing' } },
    ],
});
