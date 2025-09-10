/* eslint-disable no-console */
// pages/api/formstack.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fetchAuthenticatedGraphQLData from '../../lib/wordpress/fetchAuthenticatedGraphQLData'

const tokenQuery = `
query GetFormstackApiToken {
  formstackApiToken
}
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { formId } = req.query

  // Validate that formId is a non-empty string of digits
  if (!formId || typeof formId !== 'string' || !/^[0-9]+$/.test(formId)) {
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
        const errorData = await response.text()
        console.error('Formstack API error:', errorData)
        throw new Error(`Error fetching form data: ${response.statusText}`)
      }

      const data = await response.json()
      return res.status(200).json(data)
    } else if (req.method === 'POST') {
      // Handle form submission
      const submissionData = req.body

      // Log the request for debugging
      // console.log('Submitting to Formstack API:', {
      //   url: `https://www.formstack.com/api/v2/form/${formId}/submission.json`,
      //   body: JSON.stringify(submissionData).substring(0, 500) + '...' // Log partial body to avoid huge logs
      // })

      const response = await fetch(
        `https://www.formstack.com/api/v2/form/${formId}/submission.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${formstackApiToken}`
          },
          body: JSON.stringify(submissionData)
        }
      )

      // Get response as text first to help with debugging
      const responseText = await response.text()
      // console.log('Formstack response status:', response.status)
      // console.log(
      //   'Formstack response headers:',
      //   Object.fromEntries(response.headers.entries())
      // )
      // console.log('Formstack response body:', responseText)

      if (!response.ok) {
        console.error('Form submission error:', responseText)
        return res.status(response.status).json({
          error: `Error submitting form: ${response.statusText}`,
          details: responseText
        })
      }

      // Parse the response text as JSON if possible
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.warn('Could not parse Formstack response as JSON')
        data = {
          message: 'Form submitted successfully, but response was not JSON'
        }
      }

      return res.status(200).json(data)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in formstack API handler:', error)
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}
