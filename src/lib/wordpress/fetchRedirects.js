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
    // Public endpoint - should work without auth
    const response = await fetch(testUrl)
    if (!response.ok) {
      console.error(`WordPress API test failed with status: ${response.status}`)
      return false
    }

    // A 401 error for the main API is normal - we just needed to confirm the API is responding
    return true
  } catch (error) {
    console.error('Error testing WordPress API connection:', error.message)
    return false
  }
}

// Function to check if the redirection plugin is available
const testRedirectionEndpoint = async () => {
  try {
    // First try without authentication to see if endpoint exists
    const response = await fetch(`${url}?page=0&per_page=1`)

    if (response.status === 401) {
      // 401 means the endpoint exists but requires authentication
      // Now try with authentication

      // Testing with authentication
      const authOptions = {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`
        }
      }

      // Try with authentication
      const authResponse = await fetch(`${url}?page=0&per_page=1`, authOptions)

      if (authResponse.ok) {
        return true
      } else {
        console.error(
          `Authenticated redirection endpoint test failed with status: ${authResponse.status}`
        )

        // Get the response text for more detailed error info
        const responseText = await authResponse.text()
        try {
          const jsonError = JSON.parse(responseText)
          console.error('Error response:', jsonError)
        } catch (e) {
          console.error('Error response text:', responseText)
        }

        return false
      }
    } else if (response.ok) {
      return true
    } else if (response.status === 404) {
      console.error(
        'Redirection plugin endpoint not found. Is the Redirection plugin installed and active?'
      )
      return false
    } else {
      console.error(
        `Redirection endpoint test failed with status: ${response.status}`
      )
      return false
    }
  } catch (error) {
    console.error('Error testing redirection endpoint:', error.message)
    return false
  }
}

const fetchRedirects = async () => {
  // Check if credentials are present
  if (!wpAppUser || !wpAppPass) {
    console.warn('WordPress credentials missing. Skipping redirect fetch.')
    return Promise.resolve([])
  }

  console.warn(`WordPress Credentials: ${getCredentialInfo()}`)

  // Test the API connection first
  const apiAvailable = await testApiConnection()
  if (!apiAvailable) {
    console.warn(
      'WordPress API is completely unavailable. Skipping redirect fetch.'
    )
    return []
  }

  // Test if the redirection endpoint is available
  const redirectionAvailable = await testRedirectionEndpoint()
  if (!redirectionAvailable) {
    console.warn(
      'Redirection plugin endpoint is not available. Skipping redirect fetch.'
    )
    return []
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`
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
    console.error('Error fetching redirects:', error.message)
    console.error('Continuing build without redirects')
    return [] // Return empty array to avoid breaking the build
  })
}

module.exports = fetchRedirects
