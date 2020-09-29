import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '/test/e2e/routed-app-error-handler', component: 'home-page' },
  { path: '/test/e2e/routed-app-error-handler/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-error-handler/two', component: 'page-two' },
  { path: '/test/e2e/routed-app-error-handler/error', action: () => Promise.reject(new Error('Action error')) }
], '#router-outlet', {
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
