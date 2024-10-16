import { Field } from 'formik'
import React from 'react'

const SelectField = ({ field }) => (
  <div>
    <label htmlFor={field.name}>
      {field.label}{' '}
      {field.required === '1' && (
        <span className="field-star" aria-hidden="true">
          *
        </span>
      )}{' '}
    </label>
    <Field
      as="select"
      id={field.name}
      name={field.name}
      required={field.required === '1'}
    >
      {field.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
)

export default SelectField
