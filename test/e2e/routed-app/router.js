import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '/test/e2e/routed-app', component: 'home-page' },
  { path: '/test/e2e/routed-app/one', component: 'page-one' },
  { path: '/test/e2e/routed-app/two', component: 'page-two' }
], '#router-outlet')
