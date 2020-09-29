import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

import './views/home-page.js'
import './views/page-one.js'
import './views/page-two.js'

createComponent('mock-routed-app-no-auto-start-path', {
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
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-no-auto-start-path" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-no-auto-start-path/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-no-auto-start-path/two" active-class-name="this-is-active">Page two</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-no-auto-start-path/fake">Fake page</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
