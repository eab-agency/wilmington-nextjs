/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD

const auth = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString('base64')
const url = 'https://wordpress.wilmington.edu/wp-json/redirection/v1/redirect'

// Cache configuration
const CACHE_FILE_PATH = path.join(process.cwd(), '.redirects-cache.json')
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Get credential info (partially masked for security)
const getCredentialInfo = () => {
  const info = []

  if (wpAppUser) {
    info.push(`Username: ${wpAppUser}`)
  } else {
    info.push('Username: NOT SET')
  }

  if (wpAppPass) {
    const maskedPass =
      wpAppPass.substring(0, 2) +
      '***' +
      (wpAppPass.length > 5 ? wpAppPass.substring(wpAppPass.length - 2) : '')
    info.push(`Password: ${maskedPass} (${wpAppPass.length} chars)`)
  } else {
    info.push('Password: NOT SET')
  }

  return info.join(', ')
}

// Function to test the WordPress API connection
const testApiConnection = async () => {
  const testUrl = 'https://wordpress.wilmington.edu/wp-json'
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(testUrl, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // 200 (OK) or 401 (Unauthorized) both indicate the API is available
    // 401 is expected for protected endpoints
    if (response.status === 200 || response.status === 401) {
      return true
    }

    console.error(`WordPress API test failed with status: ${response.status}`)
    return false
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('WordPress API connection timeout')
    } else {
      console.error('Error testing WordPress API connection:', error.message)
    }
    return false
  }
}

// Utility function to safely parse error responses with size limits
const parseErrorResponse = async (response, maxSize = 1024) => {
  try {
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return `HTTP ${response.status}: ${response.statusText}`
    }

    const text = await response.text()
    if (text.length > maxSize) {
      return `HTTP ${response.status}: Response too large (${text.length} chars)`
    }

    const jsonError = JSON.parse(text)
    return (
      jsonError.message || `HTTP ${response.status}: ${response.statusText}`
    )
  } catch (e) {
    return `HTTP ${response.status}: ${response.statusText}`
  }
}

// Function to test WordPress user authentication
const testUserAuth = async () => {
  try {
    const userEndpoint =
      'https://wordpress.wilmington.edu/wp-json/wp/v2/users/me'
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const authOptions = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Site'
      },
      signal: controller.signal
    }

    const response = await fetch(userEndpoint, authOptions)
    clearTimeout(timeoutId)

    if (response.ok) {
      const userData = await response.json()
      // console.log(`✅ Authentication successful! User: ${userData.name}`)
      return true
    } else {
      const errorMsg = await parseErrorResponse(response)
      console.error(`❌ User authentication failed: ${errorMsg}`)
      return false
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('User authentication timeout')
    } else {
      console.error('Error testing user authentication:', error.message)
    }
    return false
  }
}

// Function to check if the redirection plugin is available
const testRedirectionEndpoint = async () => {
  try {
    // First test user authentication
    const authWorking = await testUserAuth()
    if (!authWorking) {
      console.error(
        '❌ User authentication failed, cannot test redirection endpoint'
      )
      return false
    }

    // Now test the redirection endpoint
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const authOptions = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Site'
      },
      signal: controller.signal
    }

    const authResponse = await fetch(`${url}?page=0&per_page=5`, authOptions)
    clearTimeout(timeoutId)

    if (authResponse.ok) {
      // console.log('✅ Redirection endpoint is accessible')
      return true
    } else {
      const errorMsg = await parseErrorResponse(authResponse)
      console.error(`❌ Redirection endpoint test failed: ${errorMsg}`)
      return false
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Redirection endpoint timeout')
    } else {
      console.error('Error testing redirection endpoint:', error.message)
    }
    return false
  }
}

/**
 * Fetches redirects from WordPress Redirection plugin API
 * This is the internal function that does the actual API call
 */
const fetchRedirectsFromWordPress = async () => {
  // Check if credentials are present
  if (!wpAppUser || !wpAppPass) {
    console.warn('━'.repeat(80))
    console.warn('🚨 CRITICAL BUILD WARNING: WordPress credentials missing!')
    console.warn(
      '   Using static redirects fallback - redirects may be outdated'
    )
    console.warn('━'.repeat(80))
    return [] // Return empty array when credentials are missing
  }

  // console.warn(`WordPress Credentials: ${getCredentialInfo()}`)

  // Test the API connection first
  const apiAvailable = await testApiConnection()
  if (!apiAvailable) {
    console.warn('━'.repeat(80))
    console.warn(
      '🚨 CRITICAL BUILD WARNING: WordPress API completely unavailable!'
    )
    console.warn(
      '   Using static redirects fallback - redirects may be outdated'
    )
    console.warn('   Check WordPress server status and network connectivity')
    console.warn('━'.repeat(80))
    return [] // Return empty array when API is unavailable
  }

  // Test if the redirection endpoint is available
  const redirectionAvailable = await testRedirectionEndpoint()
  if (!redirectionAvailable) {
    console.warn('━'.repeat(80))
    console.warn(
      '🚨 CRITICAL BUILD WARNING: Redirection plugin endpoint unavailable!'
    )
    console.warn(
      '   Using static redirects fallback - redirects may be outdated'
    )
    console.warn('   Check WordPress redirection plugin status and permissions')
    console.warn('━'.repeat(80))
    return [] // Return empty array when redirection endpoint is unavailable
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Wilmington-NextJS-Site'
    }
  }

  const allRedirects = [] // Array to store all the fetched items
  const seenUrls = new Set() // Track seen URLs to prevent duplicates
  const maxPages = 1000 // Safety limit to prevent infinite loops

  // Recursive function to fetch all pages
  const fetchPage = (page = 0) => {
    // Safety check to prevent infinite loops
    if (page >= maxPages) {
      console.warn(
        `⚠️  Reached maximum page limit (${maxPages}), stopping pagination`
      )
      return allRedirects
    }

    const perPage = 100
    const pageUrl = `${url}?page=${page}&per_page=${perPage}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout for data fetching

    const fetchOptions = {
      ...options,
      signal: controller.signal
    }

    return fetch(pageUrl, fetchOptions)
      .then(async (response) => {
        clearTimeout(timeoutId)
        if (!response.ok) {
          const errorMsg = await parseErrorResponse(response)
          console.error(
            `HTTP error fetching redirects from ${pageUrl}: ${errorMsg}`
          )
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Check for pagination headers
        const totalPages = response.headers.get('X-WP-TotalPages')
        const totalItems = response.headers.get('X-WP-Total')

        const data = await response.json()

        // Use header info if available, otherwise fall back to response data
        const actualTotal = totalItems ? parseInt(totalItems, 10) : data.total
        const actualTotalPages = totalPages ? parseInt(totalPages, 10) : null

        return { data, actualTotal, actualTotalPages }
      })
      .then(({ data, actualTotal, actualTotalPages }) => {
        const currentPageItems = data.items || []

        // Filter and map redirects, checking for duplicates
        const redirects = currentPageItems
          .filter(
            (item) =>
              item.url &&
              item.action_data.url &&
              item.action_code === 301 &&
              !seenUrls.has(item.url) // Prevent duplicates
          )
          .map((item) => {
            seenUrls.add(item.url) // Track this URL
            return {
              source: item.url,
              destination: item.action_data.url,
              permanent: true
            }
          })

        allRedirects.push(...redirects) // Add the fetched items to the array

        // Determine if we should continue pagination
        const shouldContinue = (() => {
          // If we have total pages from headers, use that
          if (actualTotalPages !== null) {
            return page < actualTotalPages - 1
          }

          // If we have total items, use that calculation
          if (actualTotal !== undefined) {
            return actualTotal > (page + 1) * perPage
          }

          // Fallback: continue if we got a full page of items
          // But add safety check - if we got 0 items, definitely stop
          return (
            currentPageItems.length === perPage && currentPageItems.length > 0
          )
        })()

        if (shouldContinue) {
          // Fetch the next page if there are more items to fetch
          return fetchPage(page + 1)
        }

        // Return the fetched items if there are no more items to fetch
        return allRedirects
      })
  }

  return fetchPage()
    .then((redirects) => {
      console.log('━'.repeat(80))
      console.log('✅ SUCCESS: WordPress redirects fetched successfully!')
      console.log(`   Retrieved ${redirects.length} redirect rules from API`)
      console.log('━'.repeat(80))
      return redirects
    })
    .catch((error) => {
      console.warn('━'.repeat(80))
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn('🚨 CRITICAL BUILD WARNING: Redirect fetch timeout!')
        console.warn('   WordPress API took too long to respond')
      } else {
        console.warn(
          '🚨 CRITICAL BUILD WARNING: Failed to fetch redirects from API!'
        )
        console.warn(`   Error: ${error.message}`)
      }
      console.warn(
        '   Using static redirects fallback - redirects may be outdated'
      )
      console.warn(
        '   This may result in broken redirect functionality on the site'
      )
      console.warn('━'.repeat(80))
      return [] // Return empty array on error to prevent build failure
    })
}

/**
 * Main export function with caching layer
 * Fetches redirects from cache if available and fresh, otherwise fetches from WordPress
 * Also includes static redirects like wp-content uploads
 */
const fetchRedirects = async () => {
  let redirects = []

  try {
    // Check if cache file exists and is fresh
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const stats = fs.statSync(CACHE_FILE_PATH)
      const cacheAge = Date.now() - stats.mtimeMs

      if (cacheAge < CACHE_MAX_AGE) {
        // Cache is fresh, use it
        const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf-8'))
        console.log(
          `✅ Using cached redirects (${
            cachedData.length
          } rules, age: ${Math.round(cacheAge / 1000 / 60)} minutes)`
        )
        return cachedData
      } else {
        console.log('⏰ Redirect cache expired, fetching fresh data...')
        redirects = await fetchRedirectsFromWordPress()
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(redirects, null, 2))
      }
    } else {
      // No cache exists, fetch and create
      console.log('📥 No redirect cache found, fetching from WordPress...')
      redirects = await fetchRedirectsFromWordPress()
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(redirects, null, 2))
    }
  } catch (error) {
    console.error('❌ Error with redirect caching:', error.message)
    // Fallback to fresh fetch if cache fails
    redirects = await fetchRedirectsFromWordPress()
  }

  // To force a fresh fetch of redirects, delete: .redirects-cache.json
  return redirects
}

module.exports = fetchRedirects
