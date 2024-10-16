import { Field } from 'formik'
import React from 'react'

const TextAreaField = ({ field }) => (
  <div>
    <label htmlFor={field.name}>
      {field.label}
      {field.required === '1' && (
        <span className="field-star" aria-hidden="true">
          *
        </span>
      )}{' '}
    </label>
    <Field
      as="textarea"
      id={field.name}
      name={field.name}
      required={field.required === '1'}
      rows={field.rows}
      cols={field.cols}
    />
  </div>
)

export default TextAreaField
