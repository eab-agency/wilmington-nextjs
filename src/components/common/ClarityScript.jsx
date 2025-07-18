import { useEffect } from 'react'

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

const ClarityScript = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && clarityProjectId) {
      import('@microsoft/clarity')
        .then((Clarity) => {
          Clarity.init(clarityProjectId)
        })
        .catch((error) => {
          console.error('Failed to load Clarity:', error)
        })
    }
  }, [])

  return null
}

export default ClarityScript
