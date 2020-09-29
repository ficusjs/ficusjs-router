import { createRouter } from '../../../src/router.js'

import './contents/foo.js'

export const router = createRouter([
  {
    path: '/test/e2e/routed-app-child-outlets',
    component: 'home-page'
  },
  {
    path: '/test/e2e/routed-app-child-outlets/one',
    component: 'page-one',
    outlets: {
      '#foo': () => 'foo-contents',
      '#title': () => '<span>Page one title outlet</span>'
    }
  },
  {
    path: '/test/e2e/routed-app-child-outlets/two',
    component: 'page-two',
    outlets: {
      '#bar': (context, { dummy }) => import('./contents/bar.js').then(() => `<bar-contents dummy="${dummy}"></bar-contents>`),
      '.baz': (context) => import('./contents/baz.js').then(() => `<baz-contents dummy="${context.params.dummy}"></baz-contents>`),
      '#title': () => '<span>Page two title outlet</span>'
    }
  }
], '#router-outlet')
