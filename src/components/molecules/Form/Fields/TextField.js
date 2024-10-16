import { ErrorMessage, Field } from 'formik'
import React from 'react'

const TextField = ({ field }) => {
  if (field.hidden === '1') {
    return <Field type="hidden" id={field.name} name={field.name} />
  } else {
    return (
      <div>
        <label htmlFor={field.name} id={`label-${field.name}`}>
          {field.label}{' '}
          {field.required === '1' && (
            <span className="field-star" aria-hidden="true">
              *
            </span>
          )}{' '}
        </label>
        <Field
          type="text"
          id={field.name}
          name={field.name}
          required={field.required === '1'}
        />
        <ErrorMessage name={field.name} component="div" className="error" />
      </div>
    )
  }
}

export default TextField
