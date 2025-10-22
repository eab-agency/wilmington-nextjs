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

/**
 * Check if inline script content only loads scripts from allowed domains
 * This allows safe dynamic script loaders (like BoxCast) while blocking arbitrary inline code
 *
 * @param {string} content - The inline script content
 * @returns {boolean} - True if safe, false otherwise
 */
export function isInlineScriptSafe(content) {
  if (!content || typeof content !== 'string') return false

  // Extract all URLs from the script content (both http:// and protocol-relative //)
  const urlPattern = /(?:https?:)?\/\/([a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})?)/g
  const matches = content.matchAll(urlPattern)

  const foundDomains = new Set()
  for (const match of matches) {
    const domain = match[1]
    if (domain) {
      foundDomains.add(domain)
    }
  }

  // If no external domains found, block it (pure inline code)
  if (foundDomains.size === 0) {
    return false
  }

  // Check if ALL found domains are in our allowlist
  for (const domain of foundDomains) {
    const isAllowed = ALLOWED_SCRIPT_DOMAINS.some((allowedDomain) => {
      return domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
    })

    if (!isAllowed) {
      // eslint-disable-next-line no-console
      console.warn(
        '[BlockHtml Security] Inline script references unauthorized domain:',
        domain
      )
      return false
    }
  }

  // All referenced domains are allowed
  return true
}
