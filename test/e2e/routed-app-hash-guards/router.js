import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/cancelled', action: () => false },
  { path: '/error', action: () => new Error('Action error') }
], '#router-outlet', {
  mode: 'hash',
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
