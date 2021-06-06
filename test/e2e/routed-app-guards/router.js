import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '/test/e2e/routed-app-guards', component: 'home-page' },
  { path: '/test/e2e/routed-app-guards/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-guards/cancelled', action: () => false },
  { path: '/test/e2e/routed-app-guards/error', action: () => new Error('Action error') }
], '#router-outlet', {
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
