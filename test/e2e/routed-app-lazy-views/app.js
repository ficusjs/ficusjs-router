import { html, createComponent } from '../util/component.js'
import { router } from './router.js'

createComponent('mock-routed-app', {
  render () {
    return html`<div>
<nav>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-lazy-views" class="active">Home</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-lazy-views/one">Page one</button>
  <button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-lazy-views/two">Page two</button>
</nav>
<div id="router-outlet"></div>
</div>`
  }
})
