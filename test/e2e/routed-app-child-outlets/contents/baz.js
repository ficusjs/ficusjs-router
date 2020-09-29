import { html, createComponent } from '../../util/component.js'

createComponent('baz-contents', {
  props: {
    dummy: {
      type: String
    }
  },
  render () {
    return html`<div>Baz contents with param <strong>${this.props.dummy}</strong></div>`
  }
})
