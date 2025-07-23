/**
 * Cookie utility module for managing browser cookies with TypeScript support
 */

/**
 * Options for setting cookies
 */
export interface CookieOptions {
  /** Cookie expiration date in days. If not specified, creates a session cookie */
  expires?: number
  /** Path for the cookie. Default is '/' */
  path?: string
  /** Domain for the cookie */
  domain?: string
  /** Whether the cookie should be secure (HTTPS only) */
  secure?: boolean
  /** SameSite attribute for the cookie ('strict', 'lax', or 'none') */
  sameSite?: 'strict' | 'lax' | 'none'
  /** Whether the cookie should be HTTP only (not accessible via JavaScript) */
  httpOnly?: boolean
}

/**
 * Sets a cookie with the specified name, value, and options
 *
 * @param name - The name of the cookie
 * @param value - The value of the cookie
 * @param options - Optional cookie configuration options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof document === 'undefined') {
    return // Not in browser environment
  }

  const { expires, path = '/', domain, secure, sameSite, httpOnly } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  // Add expiration date if provided
  if (expires !== undefined) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expires)
    cookieString += `; expires=${expirationDate.toUTCString()}`
  }

  // Add path
  cookieString += `; path=${path}`

  // Add domain if provided
  if (domain) {
    cookieString += `; domain=${domain}`
  }

  // Add secure flag if true
  if (secure) {
    cookieString += '; secure'
  }

  // Add SameSite attribute if provided
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  // Add HttpOnly flag if true
  if (httpOnly) {
    cookieString += '; httponly'
  }

  document.cookie = cookieString
}

/**
 * Gets a cookie value by name
 *
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null // Not in browser environment
  }

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    // Check if this cookie starts with the name we're looking for
    if (cookie.startsWith(`${encodeURIComponent(name)}=`)) {
      // Return the decoded value
      return decodeURIComponent(
        cookie.substring(name.length + 1, cookie.length)
      )
    }
  }

  return null // Cookie not found
}

/**
 * Removes a cookie by setting its expiration date to the past
 *
 * @param name - The name of the cookie to remove
 * @param path - Optional path of the cookie (must match the path used when setting)
 */
export const removeCookie = (name: string, path = '/'): void => {
  if (typeof document === 'undefined') {
    return // Not in browser environment
  }

  // Set expiration date to a past date to remove the cookie
  document.cookie = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}
