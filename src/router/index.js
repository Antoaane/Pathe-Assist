import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import CapturePage from '@/views/CapturePage.vue'
import Cleaning from '@/views/SessionsList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/capture',
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
      props: { mode: 'cleared' },
    },
    {
      path: '/closing',
      name: 'closing',
      component: Cleaning,
      props: { mode: 'closed' },
    },
  ],
})

export default router
