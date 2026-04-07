import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/case/digi-express',
    name: 'case-digi-express',
    component: () => import('@/pages/CaseDigiExpress.vue'),
  },
  {
    path: '/case/kork-app',
    name: 'case-kork-app',
    component: () => import('@/pages/CaseKorkApp.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
