/* global CustomEvent */
/**
 * Function to emit an event on an element
 * @param {Node} elem The element that emits the event
 * @param {string} name The name of the event
 * @param {object} opts Options to pass to the event
 * @returns {boolean} The return value is <code>false</code> if event is cancelable and at least one of the event handlers which handled this event called <code>Event.preventDefault()</code>. Otherwise it returns <code>true</code>.
 */
export function emit (elem, name, opts = {}) {
  const defs = {
    bubbles: true,
    cancelable: true,
    composed: false
  }
  const eventOptions = Object.assign({}, defs, opts)
  const e = new CustomEvent(name, eventOptions)
  return elem.dispatchEvent(e)
}
