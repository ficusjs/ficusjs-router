/**
 * Function to create an element from an HTML string
 * @param {string} html The HTML string
 * @returns {HTMLElement} The created element
 * @example
 * elementFromString(`<div>
 *   <h3>A 3rd level header</h3>
 *   <p>A paragraph</p>
 * </div>`)
 */
export function elementFromString (html) {
  const div = document.createElement('div')
  div.innerHTML = html.trim()
  return div.firstChild
}
