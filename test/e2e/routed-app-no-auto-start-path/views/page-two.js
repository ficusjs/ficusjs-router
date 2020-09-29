import { createComponent, html } from '../../util/component.js'
import { router } from '../router.js'

createComponent('page-two', {
  render () {
    return html`<div>
    <p>Welcome to page two!</p>
    <p><button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/test/e2e/routed-app-no-auto-start-path">Go back to home page</button></p>
</div>`
  }
})
