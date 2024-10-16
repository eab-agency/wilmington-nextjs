import { useFormikContext } from 'formik'
import React from 'react'

const ErrorSummary = () => {
  const { errors, touched } = useFormikContext()
  console.log('🚀 ~ ErrorSummary ~ errors:', errors)
  const errorFields = Object.keys(errors).filter((field) => touched[field])
  console.log('🚀🚀🚀🚀 ~ ErrorSummary ~ errorFields:', errorFields)

  if (errorFields.length === 0) return null

  const getFieldLabel = (fieldName) => {
    if (fieldName.includes('-address')) return 'An address must be provided'
    if (fieldName.includes('-city')) return 'A city must be provided'
    if (fieldName.includes('-state')) return 'A state must be provided'
    if (fieldName.includes('-zip')) return 'A ZIP Code must be provided'
    return fieldName
  }

  return (
    <div className="error-summary">
      <ul>
        {errorFields.map((field) => (
          <li key={field}>
            <a href={`#${field}`}>{getFieldLabel(field)}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ErrorSummary
