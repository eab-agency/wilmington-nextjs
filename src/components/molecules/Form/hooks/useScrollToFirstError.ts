import { useEffect } from 'react'

const useScrollToFirstError = (errors: Record<string, any>) => {
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorField = document.querySelector(
        `[name="${Object.keys(errors)[0]}"]`
      )
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [errors])
}

export default useScrollToFirstError
