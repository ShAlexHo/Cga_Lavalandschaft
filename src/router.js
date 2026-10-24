import { createRouter, createWebHistory } from 'vue-router';
import LandingView from './views/LandingView.vue';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'landing', component: LandingView },
        { path: '/scene', name: 'scene', component: () => import('./views/SceneView.vue') },
        { path: '/:path(.*)*', redirect: { name: 'landing' } },
    ],
});
