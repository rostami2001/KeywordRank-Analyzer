import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/dashboard-view.vue'),
    },
    {
      path: '/keywords',
      name: 'keywords',
      component: () => import('../views/keywords-view.vue'),
    },
    {
      path: '/websites',
      name: 'websites',
      component: () => import('../views/websites-view.vue'),
    },
  ],
})

export default router
