/* eslint-disable no-console */
import { apiRouter } from '@faustwp/core'

export default async function handler(req, res) {
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    throw error
  }
}
