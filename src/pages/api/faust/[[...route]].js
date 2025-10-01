/* eslint-disable no-console */
import { apiRouter } from '@faustwp/core'
import cookie from 'cookie'

// Patch the cookie.serialize function to log what's being set
const originalSerialize = cookie.serialize
cookie.serialize = function (name, value, options) {
  console.log('🍪 cookie.serialize called:', {
    name,
    value: value?.substring(0, 50),
    options
  })

  try {
    return originalSerialize(name, value, options)
  } catch (error) {
    console.error('❌ cookie.serialize error:', error.message)
    console.error('   Cookie name:', JSON.stringify(name))
    console.error('   Cookie value:', JSON.stringify(value?.substring(0, 100)))
    console.error('   Cookie options:', JSON.stringify(options))
    throw error
  }
}

export default async function handler(req, res) {
  // Intercept setHeader to catch cookie operations BEFORE FaustWP processes them
  const originalSetHeader = res.setHeader.bind(res)
  res.setHeader = function (name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log('🍪 INTERCEPT res.setHeader for Set-Cookie:')
      console.log('   Value type:', typeof value)
      console.log('   Value:', JSON.stringify(value))

      // Try to parse the cookie string to see what's invalid
      if (typeof value === 'string') {
        const cookieParts = value.split(';')[0].split('=')
        console.log('   Cookie name from string:', JSON.stringify(cookieParts[0]))
        console.log('   Cookie name length:', cookieParts[0]?.length)
        console.log('   Cookie name charCodes:', Array.from(cookieParts[0] || '').map(c => c.charCodeAt(0)))
      }
    }
    return originalSetHeader(name, value)
  }

  // Log all Faust API requests for debugging
  const route = req.query.route?.join('/') || 'root'
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🔌 Faust API Request: /api/faust/${route}`)
  console.log(`   Method: ${req.method}`)
  console.log(`   WordPress URL: ${process.env.NEXT_PUBLIC_WORDPRESS_URL}`)

  if (route === 'auth/token') {
    console.log('🔑 Token exchange request detected')
    console.log(`   Code present: ${!!req.query.code || !!req.body?.code}`)
    console.log(
      `   Code value: ${
        req.query.code?.substring(0, 20) || req.body?.code?.substring(0, 20)
      }...`
    )
    console.log(
      `   FAUST_SECRET_KEY present: ${!!process.env.FAUST_SECRET_KEY}`
    )
    console.log(
      `   FAUST_SECRET_KEY value: ${process.env.FAUST_SECRET_KEY?.substring(
        0,
        10
      )}...`
    )
    console.log(
      `   WORDPRESS_APPLICATION_PASSWORD present: ${!!process.env
        .WORDPRESS_APPLICATION_PASSWORD}`
    )
    console.log(
      `   WORDPRESS_APPLICATION_USERNAME: ${process.env.WORDPRESS_APPLICATION_USERNAME}`
    )

    // Log all NEXT_PUBLIC env vars to check for invalid characters
    console.log('📝 Environment variables check:')
    Object.keys(process.env)
      .filter((k) => k.startsWith('NEXT_PUBLIC_'))
      .forEach((key) => {
        const value = process.env[key]
        const hasNewline = value?.includes('\n')
        const hasTab = value?.includes('\t')
        // eslint-disable-next-line no-control-regex
        const hasInvalidChars = /[\x00-\x1F\x7F-\x9F]/.test(value || '')
        console.log(
          `   ${key}: ${value?.substring(
            0,
            30
          )}... (newline:${hasNewline}, tab:${hasTab}, invalid:${hasInvalidChars})`
        )
      })
  }

  if (route === 'auth/user') {
    console.log('👤 User auth check request')
  }

  try {
    // Call the original apiRouter and await it
    const result = await apiRouter(req, res)

    if (route === 'auth/token') {
      console.log('✅ Token exchange completed successfully')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return result
  } catch (error) {
    console.error('❌ Faust API Error:', error.message)
    console.error('   Stack:', error.stack)

    // If it's a cookie error, log all environment variables that might affect cookie names
    if (error.message?.includes('argument name is invalid')) {
      console.error('🔍 Cookie error detected! Checking all env vars:')
      console.error(
        '   NEXT_PUBLIC_URL:',
        JSON.stringify(process.env.NEXT_PUBLIC_URL)
      )
      console.error(
        '   NEXT_PUBLIC_WORDPRESS_URL:',
        JSON.stringify(process.env.NEXT_PUBLIC_WORDPRESS_URL)
      )
      console.error(
        '   FAUST_SECRET_KEY:',
        JSON.stringify(process.env.FAUST_SECRET_KEY)
      )
      console.error('   VERCEL_URL:', JSON.stringify(process.env.VERCEL_URL))
      console.error('   Error details:', JSON.stringify(error, null, 2))
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    throw error
  }
}
