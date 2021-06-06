import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '/test/e2e/routed-app-no-auto-start-path', component: 'home-page' },
  { path: '/test/e2e/routed-app-no-auto-start-path/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-no-auto-start-path/two', component: 'page-two' }
], '#router-outlet', { autoStart: false })
