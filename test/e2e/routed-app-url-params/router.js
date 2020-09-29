import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '/test/e2e/routed-app-url-params', component: 'home-page' },
  { path: '/test/e2e/routed-app-url-params/one', component: 'page-one' },
  { path: '/test/e2e/routed-app-url-params/two', component: 'page-two' },
  { path: '/test/e2e/routed-app-url-params/user/:personName', action: (context) => `<user-page person-name="${context.params.personName}"></user-page>` },
  { path: '/test/e2e/routed-app-url-params/user/:personName/task/:task', action: (context, { personName, task }) => `<user-page person-name="${personName}" task="${task}"></user-page>` }
], '#router-outlet')
