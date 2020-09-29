import { createComponent, html } from '../../util/component.js'
import { getRouter } from '../router.js'

createComponent('page-one', {
  goBack () {
    getRouter().goBack()
  },
  render () {
    return html`<div>
        Welcome to page one!
        <button type="button" @click=${this.goBack}>Back</button>
      </div>`
  }
})
