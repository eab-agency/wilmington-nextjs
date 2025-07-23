/**
 * Unit tests for cookie utility functions
 */
import { getCookie, removeCookie, setCookie } from '../cookieUtils'

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

describe('Cookie Utility Functions', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = ''
  })

  describe('setCookie', () => {
    test('should set a basic cookie with name and value', () => {
      setCookie('testCookie', 'testValue')
      expect(document.cookie).toContain('testCookie=testValue')
    })

    test('should set a cookie with expiration date', () => {
      const spy = jest.spyOn(Date.prototype, 'toUTCString')
      setCookie('testCookie', 'testValue', { expires: 7 })
      expect(spy).toHaveBeenCalled()
      expect(document.cookie).toContain('testCookie=testValue')
      spy.mockRestore()
    })

    test('should set a cookie with path', () => {
      setCookie('testCookie', 'testValue', { path: '/test' })
      expect(document.cookie).toContain('path=/test')
    })

    test('should set a cookie with domain', () => {
      setCookie('testCookie', 'testValue', { domain: 'example.com' })
      expect(document.cookie).toContain('domain=example.com')
    })

    test('should set a secure cookie', () => {
      setCookie('testCookie', 'testValue', { secure: true })
      expect(document.cookie).toContain('secure')
    })

    test('should set a cookie with SameSite attribute', () => {
      setCookie('testCookie', 'testValue', { sameSite: 'strict' })
      expect(document.cookie).toContain('samesite=strict')
    })

    test('should set an HttpOnly cookie', () => {
      setCookie('testCookie', 'testValue', { httpOnly: true })
      expect(document.cookie).toContain('httponly')
    })

    test('should handle special characters in name and value', () => {
      setCookie('test;Cookie', 'test=Value')
      expect(document.cookie).toContain('test%3BCookie=test%3DValue')
    })
  })

  describe('getCookie', () => {
    test('should return null if cookie does not exist', () => {
      expect(getCookie('nonExistentCookie')).toBeNull()
    })

    test('should get a cookie value by name', () => {
      document.cookie = 'testCookie=testValue; path=/'
      expect(getCookie('testCookie')).toBe('testValue')
    })

    test('should handle multiple cookies', () => {
      document.cookie = 'cookie1=value1; path=/'
      document.cookie = 'cookie2=value2; path=/'
      expect(getCookie('cookie1')).toBe('value1')
      expect(getCookie('cookie2')).toBe('value2')
    })

    test('should handle encoded values', () => {
      document.cookie = 'encodedCookie=test%20value; path=/'
      expect(getCookie('encodedCookie')).toBe('test value')
    })
  })

  describe('removeCookie', () => {
    test('should remove an existing cookie', () => {
      // Set a cookie first
      document.cookie = 'testCookie=testValue; path=/'
      expect(getCookie('testCookie')).toBe('testValue')

      // Remove the cookie
      removeCookie('testCookie')

      // Check if the cookie was removed
      // Note: In a real browser, the cookie would be removed,
      // but in the test environment, we're just checking if the expiration date was set to the past
      expect(document.cookie).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
    })

    test('should handle removing a cookie with a specific path', () => {
      document.cookie = 'testCookie=testValue; path=/test'
      removeCookie('testCookie', '/test')
      expect(document.cookie).toContain('path=/test')
    })
  })
})
