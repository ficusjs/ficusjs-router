import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '/test/e2e/routed-app-redirects', component: 'home-page' },
  {
    path: '/test/e2e/routed-app-redirects/one',
    action () {
      return { redirect: '/test/e2e/routed-app-redirects/two' }
    }
  },
  { path: '/test/e2e/routed-app-redirects/two', component: 'page-two' }
], '#router-outlet')
