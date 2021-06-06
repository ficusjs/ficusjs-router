/**
 * A promise based function to wait for a condition to pass or timeout - whichever is the soonest
 * @param {Function} test
 * @param {number} timeoutInMilliseconds
 * @returns {Promise<unknown>}
 */
export const waitFor = (test = () => true, timeoutInMilliseconds = 10000) => new Promise((resolve, reject) => {
  const check = () => {
    const result = test()
    if (result) {
      resolve(result)
    } else if ((timeoutInMilliseconds -= 100) < 0) {
      reject(new Error('Timed out waiting!'))
    } else {
      setTimeout(check, 100)
    }
  }
  setTimeout(check, 100)
})
