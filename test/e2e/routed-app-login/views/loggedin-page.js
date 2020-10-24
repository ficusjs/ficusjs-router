import { createComponentWithStore, html } from '../../util/component.js'
import { getStore } from '../store.js'

createComponentWithStore(
  'loggedin-page',
  {
    render () {
      return html`<div>You are logged in <strong>${this.store.state.user.email}</strong></div>`
    }
  },
  getStore()
)
