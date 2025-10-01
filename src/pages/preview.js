/* eslint-disable no-console */
import { WordPressTemplate, useAuth } from '@faustwp/core'
import { useEffect, useState } from 'react'

export default function Preview(props) {
  const { isAuthenticated, isReady, loginUrl } = useAuth()
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)

      // Log all environment variables related to WordPress (client-side only)
      const envInfo = {
        NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        origin: window.location.origin
      }
      console.log('🔧 Environment Config:', envInfo)

      // Check if we have an auth code from WordPress
      const authCode = params.get('code')
      if (authCode) {
        console.log(
          '✅ Auth code received from WordPress:',
          authCode.substring(0, 20) + '...'
        )
        console.log('📍 This means WordPress redirected back after login')
        console.log(
          '🔄 FaustWP should now be exchanging this code for an access token...'
        )
        console.log(
          '   Check Network tab for request to: /api/faust/auth/token'
        )
        console.log(
          '   If that request fails (401/403/500), the authentication will fail'
        )
      }

      const info = {
        isAuthenticated,
        isReady,
        loginUrl,
        currentUrl: window.location.href,
        hasPreviewParam: params.has('preview'),
        previewPathname: params.get('previewPathname'),
        postId:
          params.get('p') || params.get('page_id') || params.get('preview_id'),
        hasAuthCode: !!authCode,
        authCodePrefix: authCode ? authCode.substring(0, 20) + '...' : null,
        wordPressBackend: loginUrl ? new URL(loginUrl).origin : 'unknown',
        timestamp: new Date().toISOString()
      }
      setDebugInfo(info)
      console.log('🔍 Preview Debug Info:', info)

      // Log the WordPress backend connection
      if (loginUrl) {
        const wpUrl = new URL(loginUrl).origin
        console.log('📌 WordPress Backend:', wpUrl)
        console.log('📌 Frontend URL:', window.location.origin)
      }

      // Detect infinite loop - if we see multiple redirects in short time
      const redirectCount =
        parseInt(sessionStorage.getItem('previewRedirectCount') || '0') + 1
      sessionStorage.setItem('previewRedirectCount', redirectCount.toString())

      if (redirectCount > 3) {
        console.error(
          '⚠️ INFINITE LOOP DETECTED! Redirected',
          redirectCount,
          'times'
        )
        console.error('Please check:')
        console.error(
          '1. WordPress Faust plugin Front-end site URL matches:',
          window.location.origin
        )
        console.error('2. WORDPRESS_APPLICATION_PASSWORD is correct in .env')
        console.error('3. FAUST_SECRET_KEY matches WordPress plugin setting')
      }

      // Clear counter after 5 seconds of stability
      const timer = setTimeout(() => {
        sessionStorage.removeItem('previewRedirectCount')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isReady, loginUrl])

  // Auto-redirect to WordPress login if not authenticated
  // This prevents the infinite loop by only redirecting once
  useEffect(() => {
    if (isReady && !isAuthenticated && loginUrl) {
      const hasAttemptedLogin = sessionStorage.getItem('previewLoginAttempted')

      if (!hasAttemptedLogin) {
        console.log('🔐 Not authenticated, redirecting to WordPress login...')
        sessionStorage.setItem('previewLoginAttempted', 'true')

        // Clear the flag after successful auth (5 seconds)
        setTimeout(() => {
          sessionStorage.removeItem('previewLoginAttempted')
        }, 5000)

        window.location.assign(loginUrl)
      } else {
        console.error(
          '⚠️ Login redirect already attempted but still not authenticated'
        )
        console.error('This usually means:')
        console.error('1. WORDPRESS_APPLICATION_PASSWORD is incorrect')
        console.error('2. FAUST_SECRET_KEY mismatch')
        console.error('3. WordPress plugin Front-end URL mismatch')
      }
    }
  }, [isReady, isAuthenticated, loginUrl])

  // Show loading state while checking authentication
  if (!isReady || (isReady && !isAuthenticated)) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <h2>Loading Preview...</h2>
        <p>Authenticating with WordPress...</p>
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>
              Debug Info (click to expand)
            </summary>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                fontSize: '12px'
              }}
            >
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return <WordPressTemplate {...props} />
}
