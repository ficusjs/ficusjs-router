import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' },
  { path: '/user/:personName', action: (context) => `<user-page person-name="${context.params.personName}"></user-page>` },
  { path: '/user/:personName/task/:task', action: (context, { personName, task }) => `<user-page person-name="${personName}" task="${task}"></user-page>` }
], '#router-outlet', { mode: 'hash' })
