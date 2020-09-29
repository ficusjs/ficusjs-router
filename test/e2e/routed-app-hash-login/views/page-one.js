import { createComponent, html } from '../../util/component.js'

createComponent('page-one', {
  goBack () {
    this.router.goBack()
  },
  render () {
    return html`<div>
        Welcome to page one!
        <button type="button" @click=${this.goBack}>Back</button>
      </div>`
  }
})
