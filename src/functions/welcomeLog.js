/* eslint-disable no-console */
let consoleShown = false

export function logToConsole() {
  if (!consoleShown && typeof window !== 'undefined' && window.console) {
    consoleShown = true
    console.groupCollapsed(
      '%cWilmington College',
      'color: rgb(142, 198, 64);font-size: 30px;font-weight: bold;text-shadow: 1px 1px 5px rgb(0, 0, 0);filter: dropshadow(color=rgb(0, 198, 0), offx=1, offy=1);'
    )
    console.log(
      'You have what it takes. Apply now!\nhttps://www.wilmington.edu/admission/apply/'
    )
    console.groupEnd()
  }
}
