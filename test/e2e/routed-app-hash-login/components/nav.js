import { createComponent, html } from '../../util/component.js'
import { store } from '../store/store.js'

createComponent('top-nav', {
  store,
  render () {
    if (this.store.state.userLoggedIn) {
      return html`<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/home" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/two" active-class-name="this-is-active">Page two</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/fake">Fake page</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/logout">Logout</button>
</nav>`
    } else {
      return html`<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/two" active-class-name="this-is-active">Page two</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/fake">Fake page</button>
</nav>`
    }
  }
})
