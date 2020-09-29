import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '/test/e2e/routed-app-no-auto-start', component: 'home-page' },
  { path: '/test/e2e/routed-app-no-auto-start/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-no-auto-start/two', component: 'page-two' }
], '#router-outlet', { autoStart: false })
