const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD
const auth = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString('base64')
const url = 'https://wordpress.wilmington.edu/wp-json/redirection/v1/redirect'

const fetchRedirects = () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`
    }
  }

  const allRedirects = [] // Array to store all the fetched items

  // Recursive function to fetch all pages
  const fetchPage = (page = 0) => {
    const pageUrl = `${url}?page=${page}`
    return fetch(pageUrl, options)
      .then((response) => response.json())
      .then((data) => {
        const redirects = data.items.map((item) => ({
          source: item.url,
          destination: item.action_data.url,
          permanent: item.action_code === 301
        }))

        allRedirects.push(...redirects) // Add the fetched items to the array

        if (data.items.length === 0) {
          // Stop fetching if there are no more items on the current page
          return allRedirects
        }

        // Fetch the next page
        return fetchPage(page + 1)
      })
  }

  return fetchPage()
}

module.exports = fetchRedirects
