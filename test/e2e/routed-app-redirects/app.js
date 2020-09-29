import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

import './views/home-page.js'
import './views/page-two.js'

createComponent('mock-routed-app', {
  render () {
    return html`<div>
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-redirects" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-redirects/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-redirects/two">Page two</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
