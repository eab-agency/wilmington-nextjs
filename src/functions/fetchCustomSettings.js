const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}graphql`
import customSettingsFields from '@/lib/wordpress/_query-partials/customSettingsFields'

async function fetchCustomSettingsJSON() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: customSettingsFields
    })
  })
  const customSettings = await response.json()
  return customSettings
}

export default fetchCustomSettingsJSON
