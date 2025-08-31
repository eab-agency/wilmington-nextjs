/* eslint-disable no-console */
const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD

const auth = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString('base64')
const url = 'https://wordpress.wilmington.edu/wp-json/redirection/v1/redirect'

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
    if (error.name === 'AbortError') {
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
    if (error.name === 'AbortError') {
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
    if (error.name === 'AbortError') {
      console.error('Redirection endpoint timeout')
    } else {
      console.error('Error testing redirection endpoint:', error.message)
    }
    return false
  }
}

const fetchRedirects = async () => {
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

  // Recursive function to fetch all pages
  const fetchPage = (page = 0) => {
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
        return response.json()
      })
      .then((data) => {
        const redirects = data.items
          .filter(
            (item) =>
              item.url && item.action_data.url && item.action_code === 301
          )
          .map((item) => ({
            source: item.url,
            destination: item.action_data.url,
            permanent: true
          }))

        allRedirects.push(...redirects) // Add the fetched items to the array

        if (data.total > (page + 1) * perPage) {
          // Fetch the next page if there are more items to fetch
          return fetchPage(page + 1)
        }
        // Return the fetched items if there are no more items to fetch
        return allRedirects
      })
  }

  return fetchPage().catch((error) => {
    console.warn('━'.repeat(80))
    if (error.name === 'AbortError') {
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

module.exports = fetchRedirects
