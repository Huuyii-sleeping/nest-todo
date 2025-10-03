import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { 
            path: '/login',
            component: () => import('../components/Login.vue')
        },
        {
            path: '/',
            component: () => import('../components/List.vue')
        }
    ],
})