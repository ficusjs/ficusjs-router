import { createComponent, html } from '../../util/component.js'
import { getRouter } from '../router.js'

createComponent('page-two', {
  render () {
    return html`<div>
    <p>Welcome to page two!</p>
    <p><button type="button" @click="${e => this.navigateTo(e, getRouter())}" data-href="/test/e2e/routed-app-login">Go back to home page</button></p>
</div>`
  }
})
