import { createComponent, html } from '../../util/component.js'
import { router } from '../router.js'

createComponent('page-two', {
  props: {
    test: {
      type: String
    }
  },
  render () {
    return html`<div>
    <p>Welcome to page two!</p>
    <p>Test: ${this.props.test}</p>
    <p><button type="button" @click="${e => this.navigateTo(e, router)}" data-href="/">Go back to home page</button></p>
</div>`
  }
})
