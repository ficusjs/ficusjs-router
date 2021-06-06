/* global Element HTMLElement */

/**
 * Function to assert for a DOM element
 * @param {Element|HTMLElement} element
 * @returns {boolean}
 */
export function isElement (element) {
  return element instanceof Element || element instanceof HTMLElement
}
