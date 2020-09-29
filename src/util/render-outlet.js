/**
 * Function to render a router outlet
 * @param {string} what A component tag
 * @param {HTMLElement|string} where An element to render into
 */
import { elementFromString } from './element-from-string.js'
import { isElement } from './is-element.js'

export function renderOutlet (what, where) {
  let element
  if (isElement(what)) {
    element = what
  } else {
    const isComponent = window.customElements.get(what)
    if (isComponent) {
      element = document.createElement(what)
    } else {
      element = elementFromString(what)
    }
  }
  const outlet = typeof where === 'string' ? document.querySelector(where) : where
  if (!outlet) {
    console.warn(`Dude, I cannot find outlet: ${where}`)
    return
  }
  outlet.appendChild(element)

  // set the data attribute so we can clear the outlet later
  const dro = 'data-router-outlet'
  if (!outlet.hasAttribute(dro)) outlet.setAttribute(dro, '')
}
