import { createComponent, html } from '../../util/component.js'

createComponent('page-error', {
  props: {
    message: {
      type: String
    }
  },
  render () {
    return html`<div>
    <p>An error occurred: ${this.props.message}</p>
</div>`
  }
})
