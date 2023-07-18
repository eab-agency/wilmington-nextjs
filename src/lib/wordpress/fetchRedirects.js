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

  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const redirects = data.items.map((item) => ({
        source: item.url,
        destination: item.action_data.url,
        permanent: item.action_code === 301
      }))
      return redirects
    })
}

module.exports = fetchRedirects
