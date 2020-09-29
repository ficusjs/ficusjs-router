import { createComponent, html } from '../../util/component.js'
import { getStore } from '../store.js'
import { getRouter } from '../router.js'

export function createTopNavComponent (router) {
  createComponent('top-nav', {
    store: getStore(),
    render () {
      if (this.store.state.userLoggedIn) {
        return html`<nav>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/home" class="active">Home</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/one">Page one</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/two" active-class-name="this-is-active">Page two</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/fake">Fake page</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/logout">Logout</button>
  </nav>`
      } else {
        return html`<nav>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/home" class="active">Home</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/one">Page one</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/two" active-class-name="this-is-active">Page two</button>
    <button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login/fake">Fake page</button>
  </nav>`
      }
    }
  })
}
