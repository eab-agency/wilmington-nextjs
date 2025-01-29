import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface TextInputProps {
  field: FormField
}

const PhoneInput: React.FC<TextInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error

  return (
    <label
      key={field.id}
      className={`fsFieldCell ${hasError ? 'error' : ''}`}
      htmlFor={field.id}
    >
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className="fsLabel">
        <span>{field.label}</span>
      </div>
      <Field
        type="tel"
        name={field.id} // Use id for the field name
        placeholder={field.placeholder}
        size={field.text_size}
        className="fsFieldPhone"
      />
      <ErrorMessage name={field.id} component="div" className="error" />
    </label>
  )
}

export default PhoneInput
