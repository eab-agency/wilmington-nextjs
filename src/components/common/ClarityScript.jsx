import Clarity from '@microsoft/clarity'
import { useEffect } from 'react'

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

const ClarityScript = () => {
  useEffect(() => {
    // Only initialize in production and if we have a project ID
    if (process.env.NODE_ENV === 'production' && clarityProjectId) {
      Clarity.init(clarityProjectId)
    }
  }, [])

  return null
}
export default ClarityScript
