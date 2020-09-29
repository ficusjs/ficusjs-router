import { createComponent, html } from '../../util/component.js'
import { getStore } from '../store.js'

createComponent('login-page', {
  store: getStore(),
  login (e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {}
    for (const pair of fd.entries()) {
      data[pair[0]] = pair[1]
    }
    this.store.dispatch('setUserLoggedIn', data)
  },
  render () {
    return html`<div>
<form method="post" @submit=${this.login}>
  <label for="email">Email</label>
  <input type="email" name="email">
  <label for="password">Password</label>
  <input type="password" name="password">
  <button type="submit">Login</button>
</form>
</div>`
  }
})
