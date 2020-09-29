import { createComponent, html } from '../../util/component.js'
import { store } from '../store/store.js'

createComponent('login-page', {
  store,
  login (e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {}
    for (const pair of fd.entries()) {
      data[pair[0]] = pair[1]
    }
    this.store.dispatch('setUserLoggedIn', e.detail.data)
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
