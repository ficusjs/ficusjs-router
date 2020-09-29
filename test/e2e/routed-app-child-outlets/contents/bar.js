import { html, createComponent } from '../../util/component.js'

createComponent('bar-contents', {
  props: {
    dummy: {
      type: String
    }
  },
  render () {
    return html`<div>Bar contents with param <strong>${this.props.dummy}</strong></div>`
  }
})
