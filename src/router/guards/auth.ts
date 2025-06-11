import type { NavigationGuard } from 'vue-router'

export const authGuard: NavigationGuard = (to, from, next) => {
  const token = sessionStorage.getItem('token')

  if (!token && to.meta.requiresAuth) {
    next({ path: '/login' })
  } else {
    next()
  }
}
