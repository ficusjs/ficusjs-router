import { createRouter } from '../../../src/router.js'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/two', action: (context, { test }) => `<page-two test=${test}></page-two>` }
], '#router-outlet', { mode: 'hash' })
