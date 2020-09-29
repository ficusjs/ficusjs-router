import { createComponent, html } from '../../util/component.js'
import { getStore } from '../store.js'

createComponent('loggedin-page', {
  store: getStore(),
  render () {
    return html`<div>You are logged in <strong>${this.store.state.user.email}</strong></div>`
  }
})
