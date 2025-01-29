import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface SelectInputProps {
  field: FormField
}

const SelectInput: React.FC<SelectInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error

  const renderOptions = () => {
    if (Array.isArray(field.options)) {
      return field.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    } else if (typeof field.options === 'string') {
      // Handle the case where options is a string
      // This could be a placeholder or a single option
      return <option value={field.options}>{field.options}</option>
    }
    // Handle the case where options is undefined
    // You might want to return null or a default option
    return null
  }

  return (
    <label
      key={field.id}
      className={`fsFieldCell ${hasError ? 'error' : ''}`}
      htmlFor={field.id}
    >
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>

      <div className="fsLabel">
        <span>{field.label}</span>
        {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </div>
      <Field
        as="select"
        name={field.id}
        className="fsFieldSelect"
        aria-required={field.required === '1'}
      >
        {renderOptions()}
      </Field>
      <ErrorMessage name={field.id} component="div" className="error" />
    </label>
  )
}

export default SelectInput
