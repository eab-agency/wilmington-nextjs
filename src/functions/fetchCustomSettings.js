const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}graphql`
import customSettingsAndLatestAlertsFields from '@/lib/wordpress/_query-partials/customSettingsAndLatestAlertsFields.js'

async function fetchCustomSettingsJSON() {
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
  console.log(
    '🚀 ~ file: fetchCustomSettings.js:16 ~ fetchCustomSettingsJSON ~ response:',
    response
  )
  const customSettingsAndAlerts = await response.json()
  return customSettingsAndAlerts
}

export default fetchCustomSettingsJSON
