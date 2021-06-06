import { createRouter } from '../../../../src/router.mjs'
import { routes } from './routes.js'

export const router = createRouter(routes, '#router-outlet', { mode: 'hash' })
