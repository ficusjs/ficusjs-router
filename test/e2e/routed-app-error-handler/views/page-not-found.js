import { createComponent, html } from '../../util/component.js'

createComponent('page-not-found', {
  props: {
    path: {
      type: String
    }
  },
  render () {
    return html`<div>Page not found: ${this.props.path}</div>`
  }
})
