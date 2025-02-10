import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface TextInputProps {
  field: FormField
}

const TextInput: React.FC<TextInputProps> = ({ field }) => {
  const isRequired = field.required === '1' ? 'fsRequiredLabel' : ''
  return (
    <label htmlFor={field.id} className={`fsFieldCell ${isRequired}`}>
      <span>{field.label}</span>
      {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      <Field
        type="text"
        name={field.id} // Use id for the field name
        placeholder={field.placeholder}
        size={field.text_size}
        className="fsFieldShortAnswer"
        aria-required={field.required === '1'}
      />
      <ErrorMessage name={field.id} component="div" className="error" />
    </label>
  )
}

export default TextInput
