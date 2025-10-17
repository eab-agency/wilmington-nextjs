/**
 * Script Component Registry
 *
 * A centralized registry that maps script patterns to specialized React components.
 * This allows BlockHtml to delegate third-party script rendering without hardcoding
 * dependencies, making it easy to add new script handlers in the future.
 *
 * Example: Adding a new handler for HubSpot forms
 * ```
 * import HubSpotForm from '@/components/blocks/core/HubSpotForm'
 *
 * SCRIPT_HANDLERS.push({
 *   test: (src) => src.includes('hubspot.com/form'),
 *   component: HubSpotForm,
 *   getProps: (script) => {
 *     const urlParams = new URLSearchParams(script.src.split('?')[1])
 *     return {
 *       portalId: urlParams.get('portalId'),
 *       formId: urlParams.get('formId')
 *     }
 *   }
 * })
 * ```
 */

import MauticForm from '@/components/blocks/core/MauticForm'

/**
 * @typedef {Object} ScriptHandler
 * @property {function(string): boolean} test - Function to test if script matches this handler
 * @property {React.Component} component - React component to render for this script type
 * @property {function(HTMLScriptElement): Object} getProps - Extract props from script element
 */

/**
 * Registry of script handlers
 * @type {ScriptHandler[]}
 */
export const SCRIPT_HANDLERS = [
  {
    // Mautic/EAB form handler
    test: (src) => src.includes('form.js?pid='),
    component: MauticForm,
    getProps: (script) => {
      const urlParams = new URLSearchParams(script.src.split('?')[1])
      return {
        pid: urlParams.get('pid'),
        formname: urlParams.get('formname') || 'default',
        display: urlParams.get('display') || 'inline',
        scriptSrc: script.src
      }
    }
  }
  // Future handlers can be added here
  // e.g., HubSpot, Formstack, Typeform, etc.
]

/**
 * Find a matching handler for a given script element
 * @param {HTMLScriptElement} script - Script element to match
 * @returns {ScriptHandler|null} Matching handler or null
 */
export const findScriptHandler = (script) => {
  if (!script.src) return null

  return SCRIPT_HANDLERS.find((handler) => handler.test(script.src)) || null
}
