import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '/test/e2e/routed-app-guards-resolve-route', component: 'home-page' },
  { path: '/test/e2e/routed-app-guards-resolve-route/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-guards-resolve-route/cancelled', component: 'dummy-page' },
  { path: '/test/e2e/routed-app-guards-resolve-route/error', component: 'dummy-page' },
  { path: '/test/e2e/routed-app-guards-resolve-route/two', component: 'dummy-page' }
], '#router-outlet', {
  resolveRoute (context) {
    if (context.location.pathname === '/test/e2e/routed-app-guards-resolve-route/cancelled') {
      return false
    }
    if (context.location.pathname === '/test/e2e/routed-app-guards-resolve-route/error') {
      return new Error('Action error')
    }
    if (context.location.pathname === '/test/e2e/routed-app-guards-resolve-route/two') {
      return { redirect: '/test/e2e/routed-app-guards-resolve-route/one' }
    }
  },
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
