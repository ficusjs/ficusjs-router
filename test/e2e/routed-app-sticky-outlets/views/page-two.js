import { html, createComponent } from '../../util/component.js'
import { router } from '../router.js'

createComponent('page-two', {
  render () {
    return html`<div>
    <p>Welcome to page two!</p>
    <div id="bar"></div>
    <div class="baz"></div>
    <p><a @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-sticky-outlets" role="button">Go back to home page</a></p>
    <div class="baz"></div>
</div>`
  }
})
