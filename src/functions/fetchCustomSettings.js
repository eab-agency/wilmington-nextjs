const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}graphql`
import customSettingsAndLatestAlertsFields from '@/lib/wordpress/_query-partials/customSettingsAndLatestAlertsFields.js'

async function fetchCustomSettingsJSON() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-store'
      },
      body: JSON.stringify({
        query: customSettingsAndLatestAlertsFields
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const customSettingsAndAlerts = await response.json()
    return customSettingsAndAlerts
  } catch (error) {
    // Handle error
    console.error('An error occurred while fetching data:', error.message)
    // You can choose to throw the error again to propagate it to the caller
    throw error
  }
}

export default fetchCustomSettingsJSON
