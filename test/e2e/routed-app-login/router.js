import { createRouter } from '../../../src/router.mjs'

let router = null

export function getRouter (resolveRoute, errorHandler) {
  if (!router && resolveRoute && errorHandler) {
    router = createRouter([
      { path: '/test/e2e/routed-app-login', component: 'home-page' },
      { path: '/test/e2e/routed-app-login/home', component: 'loggedin-page' },
      { path: '/test/e2e/routed-app-login/login', component: 'login-page' },
      { path: '/test/e2e/routed-app-login/one', component: 'page-one' },
      { path: '/test/e2e/routed-app-login/two', component: 'page-two' }
    ], '#router-outlet', { resolveRoute, errorHandler })
    import('./views/index.js')
  }
  return router
}
