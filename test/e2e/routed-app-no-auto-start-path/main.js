import { router } from './router.js'

import('./app.js').then(() => router.start('/test/e2e/routed-app-no-auto-start-path/two'))
