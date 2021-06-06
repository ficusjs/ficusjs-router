import { createRouter } from '../../../src/router.mjs'

export const router = createRouter([
  { path: '', component: 'home-page' },
  {
    path: '/one',
    action () {
      return { redirect: '/two' }
    }
  },
  { path: '/two', component: 'page-two' }
], '#router-outlet', { mode: 'hash' })
