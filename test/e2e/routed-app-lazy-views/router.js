import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  {
    path: '/test/e2e/routed-app-lazy-views',
    action (context) {
      return import('./views/home-page.js')
        .then(() => `home-page`)
    }
  },
  { path: '/test/e2e/routed-app-lazy-views/one', action: () => import('./views/page-one.esm.js').then(() => 'page-one') },
  { path: '/test/e2e/routed-app-lazy-views/two', action: () => import('./views/page-two.js').then(() => 'page-two') }
], '#router-outlet')
