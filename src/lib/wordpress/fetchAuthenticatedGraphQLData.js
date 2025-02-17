// fetchAuthenticatedGraphQLData.ts

const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD
export const graphQlEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}graphql`

const auth = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString('base64')

const fetchAuthenticatedGraphQLData = async (query, variables) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  }

  try {
    const response = await fetch(graphQlEndpoint, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
    }

    return result.data
  } catch (error) {
    console.error('Error fetching GraphQL data:', error)
    throw error
  }
}

export default fetchAuthenticatedGraphQLData
