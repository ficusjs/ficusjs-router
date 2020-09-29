import { createComponent, html, nothing } from '../../util/component.js'

createComponent('user-page', {
  props: {
    personName: {
      type: String
    },
    task: {
      type: String
    }
  },
  render () {
    return html`<div>
    <p>Welcome ${this.props.personName ? this.props.personName : nothing} to the user page!</p>
    <p>${this.props.task ? html`Task ${this.props.task}` : nothing}</p>
</div>`
  }
})
