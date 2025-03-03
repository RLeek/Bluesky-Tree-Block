import { createRouter, createWebHistory } from 'vue-router'
import PruneView from '@/views/PruneView.vue'
import SearchView from '@/views/SearchView.vue'
import ActivePrunesView from '@/views/ActivePrunesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/prune'
    },
    {
      path: '/prune',
      name: 'prune',
      component: PruneView
    },
    {
      path: '/prune/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/prune/active',
      name: 'activePrunes',
      component: ActivePrunesView
    },

  ],
})

export default router
