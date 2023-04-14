const fetchRedirects = () => {
  const url = process.env.SITE_URL
    ? `${process.env.SITE_URL}api/wordpress/redirects`
    : 'https://wilmington-nexjs.vercel.app/api/wordpress/redirects'

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching redirects:', error)
      throw error
    })
}

module.exports = fetchRedirects
