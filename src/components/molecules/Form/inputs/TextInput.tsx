import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface TextInputProps {
  field: FormField
}

const TextInput: React.FC<TextInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error
  const isRequired = field.required === '1' ? 'fsRequiredLabel' : ''

  return (
    <div className={`fsFieldCell ${isRequired} ${hasError ? 'error' : ''}`}>
      <label className="fsLabel" htmlFor={field.id}>
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className="fsLabel">
        <span>  <span>{field.label}</span></span>
          {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </label>
      </div>
      <Field
        type="text"
        name={field.id} // Use id for the field name
        placeholder={field.placeholder}
        size={field.text_size}
        className="fsFieldShortAnswer"
        aria-required={field.required === '1'}
      />
      <ErrorMessage name={field.id} component="div" className="error" />
    </div>
  )
}

export default TextInput
