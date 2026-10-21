import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/identity'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../features/identity/views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: () => import('../features/dashboard/views/DashboardView.vue'),
    },
    {
      path: '/apikeys',
      name: 'apikeys',
      meta: { requiresAuth: true },
      component: () => import('../features/apikeys/views/ApiKeysView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      meta: { requiresAuth: true, roles: ['Admin'] },
      component: () => import('../features/users/views/UsersView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('../features/users/views/ProfileView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'home' }
  }

  const roles = to.meta.roles
  if (roles?.length) {
    const userRoles = auth.user?.roles ?? []
    if (!roles.some((role) => userRoles.includes(role))) {
      return { name: 'dashboard' }
    }
  }

  if (to.name === 'home' && auth.isLoggedIn) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
