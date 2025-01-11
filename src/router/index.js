import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/views/Default.vue'
import CapturePage from '@/views/CapturePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      component: Default,
    },
    {
      path: '/capture',
      name: 'capture',
      component: CapturePage,
    }
  ],
})

export default router
