import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '/test/e2e/routed-app-hash-params', component: 'home-page' },
  { path: '/test/e2e/routed-app-hash-params/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-hash-params/two', component: 'page-two' },
  { path: '/test/e2e/routed-app-hash-params/user/:personName', action: (context) => `<user-page person-name="${context.params.personName}"></user-page>` },
  {
    path: '/test/e2e/routed-app-hash-params/user/:personName/task',
    // eslint-disable-next-line camelcase
    action (context, { personName, access_token, code }) {
      // eslint-disable-next-line camelcase
      return `<user-page person-name="${personName}" task="${access_token}"></user-page>`
    }
  }
], '#router-outlet')
