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
