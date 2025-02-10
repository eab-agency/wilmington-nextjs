import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface EmailInputProps {
  field: FormField
}

const EmailInput: React.FC<EmailInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error
  const isRequired = field.required === '1' ? 'fsRequiredLabel' : ''
  return (
    <label
      id={field.id}
      key={field.id}
      className={`fsFieldCell ${hasError ? 'error' : ''}`}
    >
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className={`fsLabel ${isRequired}`}>
        <span>{field.label}</span>
        {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </div>
      <div className="fsSubFieldGroup">
        <Field
          type="email"
          name={field.id} // Use id for the field name
          placeholder={field.placeholder}
          size={field.text_size}
        />
      </div>
      <ErrorMessage name={field.id} component="div" className="error" />
    </label>
  )
}

export default EmailInput
