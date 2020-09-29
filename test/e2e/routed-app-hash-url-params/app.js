import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

import './views/home-page.js'
import './views/page-one.js'
import './views/page-two.js'
import './views/user-page.js'

createComponent('mock-routed-app', {
  render () {
    return html`<div>
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/two">Page two</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/user/matt">Matt's page</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/user/matt/task/12345">Task page</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
