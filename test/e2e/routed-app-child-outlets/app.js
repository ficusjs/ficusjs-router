import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

import './views/home-page.js'
import './views/page-one.js'
import './views/page-two.js'

createComponent('mock-routed-app', {
  render () {
    return html`<div>
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-child-outlets" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-child-outlets/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-child-outlets/two?dummy=Matt%20is%20one">Page two</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
