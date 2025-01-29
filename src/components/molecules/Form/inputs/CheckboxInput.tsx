import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface CheckboxInputProps {
  field: FormField
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error

  return (
    <span key={field.id} className={`fsFieldCell ${hasError ? 'error' : ''}`}>
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className="fsLabel">
        <span>{field.label}</span>
      </div>
      <ErrorMessage name={field.id} component="div" className="error" />
      <fieldset role="group">
        <span
          style={{
            position: 'absolute',
            left: '-999em',
            width: '0.1em',
            height: '0.1em',
            overflow: 'hidden'
          }}
        >
          <legend id={`${field.id}-legend`}>{field.label}</legend>
        </span>
        {Array.isArray(field.options) ? (
          field.options.map((option) => (
            <div key={option.value}>
              <label className="fsOptionLabel">
                <Field type="checkbox" name={field.id} value={option.value} />{' '}
                {option.label}
              </label>
            </div>
          ))
        ) : (
          <p>
            {typeof field.options === 'string'
              ? field.options
              : 'No options available'}
          </p>
        )}
      </fieldset>
    </span>
  )
}

export default CheckboxInput
