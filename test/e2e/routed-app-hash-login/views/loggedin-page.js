import { createComponent, html } from '../../util/component.js'
import { store } from '../store/store.js'

createComponent('loggedin-page', {
  store,
  render () {
    return html`<div>You are logged in <strong>${this.store.state.user.email}</strong></div>`
  }
})
