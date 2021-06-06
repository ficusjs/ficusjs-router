/**
 * Function to empty an element
 * @param {Element} el
 */
export function elementEmpty (el) {
  while (el.firstChild) el.removeChild(el.firstChild)
}
