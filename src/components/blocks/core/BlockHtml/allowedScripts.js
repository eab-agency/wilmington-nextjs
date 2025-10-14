/**
 * Security Configuration: Allowed Script Sources
 *
 * This file defines which external scripts are permitted to execute
 * in BlockHtml components. Only scripts from these domains will be loaded.
 *
 * Add trusted domains here to allow their scripts to execute.
 */

export const ALLOWED_SCRIPT_DOMAINS = [
  'admiss.info', // EAB/Mautic forms and APIs
  'formstack.com' // Formstack forms and APIs
  // Add additional trusted domains below:
  // 'google-analytics.com',
  // 'googletagmanager.com',
  // 'cdn.example.com',
]

/**
 * Check if a script source is allowed based on the domain allowlist
 * @param {string} src - The script src URL
 * @returns {boolean} - True if allowed, false otherwise
 */
export function isScriptAllowed(src) {
  if (!src) {
    // Block inline scripts by default for security
    return false
  }

  try {
    const url = new URL(src, window.location.origin)
    const hostname = url.hostname

    // Check if the hostname matches any allowed domain
    return ALLOWED_SCRIPT_DOMAINS.some((allowedDomain) => {
      // Exact match or subdomain match
      return (
        hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`)
      )
    })
  } catch (error) {
    // Invalid URL, block it
    console.error('[BlockHtml] Invalid script URL:', src)
    return false
  }
}
