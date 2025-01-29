import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface TextareaInputProps {
  field: FormField
}

const TextareaInput: React.FC<TextareaInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error

  return (
    <label key={field.id} className={`fsFieldCell ${hasError ? 'error' : ''}`}>
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className="fsLabel">
        <span>{field.label}</span>
        {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </div>
      <Field
        as="textarea"
        name={field.id} // Use id for the field name
        placeholder={field.placeholder}
        className="fsFieldLongAnswer"
        aria-required={field.required === '1'}
      />
      <ErrorMessage name={field.id} component="div" className="error" />
    </label>
  )
}

export default TextareaInput
