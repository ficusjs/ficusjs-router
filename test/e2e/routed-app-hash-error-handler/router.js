import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' },
  { path: '/error', action: () => Promise.reject(new Error('Action error')) }
], '#router-outlet', {
  mode: 'hash',
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
