import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/two', action: (context, { test }) => `<page-two test=${test}></page-two>` }
], '#router-outlet', { mode: 'hash' })
