// pages/api/formstack.ts
import fetchAuthenticatedGraphQLData from '../../lib/wordpress/fetchAuthenticatedGraphQLData'

const tokenQuery = `
query GetFormstackApiToken {
  formstackApiToken
}
`

export default async function handler(req, res) {
  const { formId } = req.query

  // Validate that formId is a non-empty string of digits
  if (!formId || !/^[0-9]+$/.test(formId)) {
    return res.status(400).json({ error: 'Invalid formId query parameter' })
  }

  try {
    // Fetch the Formstack API token
    const tokenData = await fetchAuthenticatedGraphQLData(tokenQuery)

    if (!tokenData || !tokenData.formstackApiToken) {
      throw new Error('Failed to retrieve Formstack API token')
    }

    const formstackApiToken = tokenData.formstackApiToken

    if (req.method === 'GET') {
      // Handle fetching form data
      const response = await fetch(
        `https://www.formstack.com/api/v2/form/${formId}/field.json`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${formstackApiToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error fetching form data: ${response.statusText}`)
      }

      const data = await response.json()
      res.status(200).json(data)

    } else if (req.method === 'POST') {
      const submissionData = req.body

      if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        // Proxy to legacy HTML endpoint using form-urlencoded data
        const rawBody = typeof submissionData === 'string'
          ? submissionData
          : new URLSearchParams(submissionData).toString()

        const response = await fetch(
          'https://wilmingtoncollege.formstack.com/forms/index.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: rawBody
          }
        )

        const text = await response.text()
        return res.status(response.status).send(text)
      }

      // Otherwise, use API endpoint with token
      const tokenData = await fetchAuthenticatedGraphQLData(tokenQuery)
      if (!tokenData || !tokenData.formstackApiToken) {
        throw new Error('Failed to retrieve Formstack API token')
      }

      const formstackApiToken = tokenData.formstackApiToken

      const response = await fetch(
        `https://www.formstack.com/api/v2/form/${formId}/submission.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${formstackApiToken}`
          },
          body: JSON.stringify(submissionData),
        }
      )

      const data = await response.json()
      res.status(response.status).json(data)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
