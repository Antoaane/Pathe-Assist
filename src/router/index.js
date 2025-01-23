import { createRouter, createWebHistory } from 'vue-router'
import Cleaning from '@/views/Cleaning.vue'
import Closing from '@/views/Closing.vue'
import CapturePage from '@/views/CapturePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Cleaning,
    },
    {
      path: '/cleaning',
      name: 'cleaning',
      component: Cleaning,
    },
    {
      path: '/closing',
      name: 'closing',
      component: Closing,
    },
    {
      path: '/capture',
      name: 'capture',
      component: CapturePage,
    }
  ],
})

export default router
