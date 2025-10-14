/**
 * Security Configuration: Allowed Script Sources
 *
 * This file validates script sources for the BlockHtml component.
 * Domain allowlist is centrally managed in: src/config/allowedScriptDomains.js
 *
 * To add new trusted domains, edit src/config/allowedScriptDomains.js
 */

// Import from centralized config
// Single source of truth for allowed domains
import { ALLOWED_SCRIPT_DOMAINS } from '@/config/allowedScriptDomains.js'

/**
 * Check if a script source is allowed based on the domain allowlist
 * Note: This is a fallback defense layer. Primary security should be enforced
 * via Content Security Policy (CSP) headers at the Next.js config level.
 *
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

    // Validate hostname is not empty
    if (!hostname || hostname.trim() === '') {
      console.error('[BlockHtml] Empty hostname in script URL:', src)
      return false
    }

    // Check if the hostname matches any allowed domain
    return ALLOWED_SCRIPT_DOMAINS.some((allowedDomain) => {
      // Exact match or subdomain match
      return (
        hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`)
      )
    })
  } catch (error) {
    // Invalid URL, block it
    console.error('[BlockHtml] Invalid script URL:', src, error)
    return false
  }
}
