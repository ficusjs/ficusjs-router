import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/cancelled', component: 'dummy-page' },
  { path: '/error', component: 'dummy-page' },
  { path: '/two', component: 'dummy-page' }
], '#router-outlet', {
  mode: 'hash',
  resolveRoute (context) {
    if (context.location.pathname === '/cancelled') {
      return false
    }
    if (context.location.pathname === '/error') {
      return new Error('Action error')
    }
    if (context.location.pathname === '/two') {
      return { redirect: '/one' }
    }
  },
  errorHandler: (error, context) => {
    return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
  }
})
