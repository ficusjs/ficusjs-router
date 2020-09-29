import { createComponent, html } from '../../util/component.js'

createComponent('page-error', {
  props: {
    message: {
      type: String
    }
  },
  render () {
    return html`<div>
    <p>Page error: ${this.props.message}</p>
</div>`
  }
})
