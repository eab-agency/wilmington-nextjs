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
    const perPage = 100
    const pageUrl = `${url}?page=${page}&per_page=${perPage}`

    return fetch(pageUrl, options)
      .then((response) => response.json())
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

  return fetchPage()
}

module.exports = fetchRedirects
