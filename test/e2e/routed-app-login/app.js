import { html, createComponentWithStore } from '../util/component.js'
import { getRouter } from './router.js'
import { getStore } from './store.js'

import { createTopNavComponent } from './components/nav.js'

function isLoginPath (path) {
  return path === '/test/e2e/routed-app-login/login' || path === '/test/e2e/routed-app-login/login/'
}

function isRootPath (path) {
  return path === '/test/e2e/routed-app-login' || path === '/test/e2e/routed-app-login/'
}

const store = getStore()
const router = getRouter(resolveRoute, errorHandler)

function resolveRoute (context, params) {
  if (!isLoginPath(context.path) && !store.state.userLoggedIn) {
    return { redirect: '/test/e2e/routed-app-login/login' }
  }

  if (isRootPath(context.path) && store.state.userLoggedIn) {
    return { redirect: '/test/e2e/routed-app-login/home' }
  }

  if (context.path === '/test/e2e/routed-app-login/logout') {
    store.dispatch('setUserLoggedIn', false)
    return { redirect: '/test/e2e/routed-app-login' }
  }
}

function errorHandler (error, context) {
  return error.status === 404 ? `<page-not-found path="${context.location.pathname}"></page-not-found>` : `<page-error message="${error.message}"></page-error>`
}

createTopNavComponent(router)

createComponentWithStore(
  'mock-routed-app-login',
  {
    render () {
      return html`<div>
  <style>
  .this-is-active {
    color: #fff;
    background-color: darkgreen;
  }
  .this-is-active:hover {
    color: #fff;
  }
  </style>
  <top-nav></top-nav>
  <div id="router-outlet"></div>
  </div>`
    }
  },
  store
)
