/**
 * Function to render a router outlet
 * @param {string|HTMLElement} what A component tag, HTML snippet or DOM element
 * @param {HTMLElement|string} where An element to render into
 */
import { elementFromString } from './element-from-string.mjs'
import { isElement } from './is-element.mjs'
import { elementEmpty } from './element-empty.mjs'

export function renderOutlet (what, where) {
  // check for an outlet
  const outlet = typeof where === 'string' ? document.querySelector(where) : where
  if (!outlet) {
    console.warn(`Unable to find outlet: ${where}`)
    return
  }

  // decide what to render into the outlet
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

  elementEmpty(outlet)
  outlet.appendChild(element)

  // set the data attribute so we can clear the outlet later
  const dro = 'data-router-outlet'
  if (!outlet.hasAttribute(dro)) outlet.setAttribute(dro, '')
}
