import { Field } from 'formik'
import React from 'react'

const RadioField = ({ field }) => {
  return (
    <div>
      <label>
        {field.label}
        {field.required === '1' && (
          <span className="field-star" aria-hidden="true">
            *
          </span>
        )}{' '}
      </label>
      {field.options.map((option, i) => (
        <div key={option.value}>
          <Field
            type="radio"
            id={`${field.name}_${i}`}
            name={field.name}
            value={option.value}
            required={field.required === '1'}
          />
          <label htmlFor={`${field.name}-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default RadioField
