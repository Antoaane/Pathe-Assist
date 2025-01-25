import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import CapturePage from '@/views/CapturePage.vue'
import Cleaning from '@/views/Cleaning.vue'
import Closing from '@/views/Closing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'capture',
      component: CapturePage,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
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
  ],
})

export default router
