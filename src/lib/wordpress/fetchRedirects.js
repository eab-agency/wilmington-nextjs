const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD

// Debug: Log the credentials being used (partially masked) - uncomment for debugging
// console.log(`🔐 Using WordPress credentials:`)
// console.log(`   Username: ${wpAppUser}`)
// console.log(
//   `   Password: ${
//     wpAppPass
//       ? wpAppPass.substring(0, 4) +
//         '***' +
//         wpAppPass.substring(wpAppPass.length - 4)
//       : 'NOT SET'
//   }`
// )

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
    const response = await fetch(testUrl)

    // 200 (OK) or 401 (Unauthorized) both indicate the API is available
    // 401 is expected for protected endpoints
    if (response.status === 200 || response.status === 401) {
      return true
    }

    console.error(`WordPress API test failed with status: ${response.status}`)
    return false
  } catch (error) {
    console.error('Error testing WordPress API connection:', error.message)
    return false
  }
}

// Function to test WordPress user authentication
const testUserAuth = async () => {
  try {
    const userEndpoint =
      'https://wordpress.wilmington.edu/wp-json/wp/v2/users/me'
    const authOptions = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Site'
      }
    }

    const response = await fetch(userEndpoint, authOptions)

    if (response.ok) {
      const userData = await response.json()
      console.log(
        `✅ Authentication successful! User: ${userData.name} (${userData.email})`
      )
      console.log(
        `User roles: ${userData.roles ? userData.roles.join(', ') : 'Unknown'}`
      )

      return true
    } else {
      console.error(
        `❌ User authentication failed with status: ${response.status}`
      )
      const responseText = await response.text()
      try {
        const jsonError = JSON.parse(responseText)
        console.error('Auth error response:', jsonError)
      } catch (e) {
        console.error('Auth error response text:', responseText)
      }
      return false
    }
  } catch (error) {
    console.error('Error testing user authentication:', error.message)
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
    const authOptions = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Site'
      }
    }

    const authResponse = await fetch(`${url}?page=0&per_page=5`, authOptions)

    if (authResponse.ok) {
      // console.log('✅ Redirection endpoint is accessible')
      return true
    } else {
      console.error(
        `❌ Redirection endpoint test failed with status: ${authResponse.status}`
      )

      // Get the response text for more detailed error info
      const responseText = await authResponse.text()
      try {
        const jsonError = JSON.parse(responseText)
        console.error('Redirection error response:', jsonError)
      } catch (e) {
        console.error('Redirection error response text:', responseText)
      }

      return false
    }
  } catch (error) {
    console.error('Error testing redirection endpoint:', error.message)
    return false
  }
}

// Fallback function to load static redirects
const loadStaticRedirects = () => {
  try {
    const fs = require('fs')
    const path = require('path')
    const redirectsPath = path.join(process.cwd(), 'data', 'redirects.json')

    if (fs.existsSync(redirectsPath)) {
      const redirectsData = fs.readFileSync(redirectsPath, 'utf8')
      const redirects = JSON.parse(redirectsData)
      console.warn(
        `📁 Using static redirects file: ${redirects.length} redirects loaded`
      )
      return redirects
    }
  } catch (error) {
    console.error('Error loading static redirects:', error.message)
  }
  return []
}

const fetchRedirects = async () => {
  // Check if credentials are present
  if (!wpAppUser || !wpAppPass) {
    console.warn(
      'WordPress credentials missing. Using static redirects fallback.'
    )
    return loadStaticRedirects()
  }

  // console.warn(`WordPress Credentials: ${getCredentialInfo()}`)

  // Test the API connection first
  const apiAvailable = await testApiConnection()
  if (!apiAvailable) {
    console.warn(
      '🚨 WordPress API is completely unavailable. Using static redirects fallback.'
    )
    return loadStaticRedirects()
  }

  // Test if the redirection endpoint is available
  const redirectionAvailable = await testRedirectionEndpoint()
  if (!redirectionAvailable) {
    console.warn(
      '🚨 Redirection plugin endpoint is not available. Using static redirects fallback.'
    )
    return loadStaticRedirects()
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

    return fetch(pageUrl, options)
      .then((response) => {
        if (!response.ok) {
          console.error(
            `HTTP error fetching redirects. Status: ${response.status}`
          )
          console.error(`URL: ${pageUrl}`)
          return response.text().then((text) => {
            try {
              const jsonError = JSON.parse(text)
              console.error('Error response:', jsonError)
            } catch (e) {
              console.error('Error response text:', text)
            }
            throw new Error(`HTTP error! status: ${response.status}`)
          })
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
    console.error('Error fetching redirects from API:', error.message)
    console.warn('Falling back to static redirects file')
    return loadStaticRedirects()
  })
}

module.exports = fetchRedirects
