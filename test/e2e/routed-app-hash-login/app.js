import { createComponent, html } from '../util/component.js'
import { store } from './store/store.js'
import { router } from './router/router.js'

import './components/nav.js'

// add the custom login handler to the router
router.setOptions({
  ...router.options,
  resolveRoute (context, params) {
    if (context.path !== '/login' && !store.state.userLoggedIn) {
      return { redirect: '/login' }
    }

    if (context.path === '/' && store.state.userLoggedIn) {
      return { redirect: '/home' }
    }

    if (context.path === '/logout') {
      store.dispatch('setUserLoggedIn', false)
      return { redirect: '/' }
    }
  },
  errorHandler (error, context) {
    return error.status === 404
      ? import('./views/page-not-found.js').then(() => html`<page-not-found path=${context.location.pathname}></page-not-found>`)
      : import('./views/page-error.js').then(() => html`<page-error message=${error.message}></page-error>`)
  }
})

createComponent('mock-routed-app-login', {
  store,
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
})
