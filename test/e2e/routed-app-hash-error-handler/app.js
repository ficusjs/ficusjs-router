import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

import './views/home-page.js'
import './views/page-one.js'
import './views/page-two.js'
import './views/page-error.js'
import './views/page-not-found.js'

createComponent('mock-routed-app', {
  render () {
    return html`<div>
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/two">Page two</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/fake">Fake page</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/error">Error page</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
