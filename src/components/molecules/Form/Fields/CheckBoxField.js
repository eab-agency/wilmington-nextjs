import { ErrorMessage, Field, FieldArray } from 'formik'
import React from 'react'

const CheckboxField = ({ field }) => (
  <FieldArray
    name={field.name}
    render={(arrayHelpers) => (
      <fieldset aria-labelledby={`${field.id}-legend`} role="group">
        <legend id={`${field.id}-legend`}>
          {field.label}
          {field.required === '1' && (
            <span className="field-star" aria-hidden="true">
              *
            </span>
          )}{' '}
        </legend>
        {field.options.map((option, index) => (
          <div key={option.value}>
            <label htmlFor={`${field.name}_${index}`}>
              <Field
                type="checkbox"
                id={`${field.name}_${index}`}
                name={field.name}
                value={option.value}
                checked={arrayHelpers.form.values[field.name].includes(
                  option.value
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (
                      !arrayHelpers.form.values[field.name].includes(
                        option.value
                      )
                    ) {
                      arrayHelpers.push(option.value)
                    }
                  } else {
                    const idx = arrayHelpers.form.values[field.name].indexOf(
                      option.value
                    )
                    if (idx > -1) {
                      arrayHelpers.remove(idx)
                    }
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          </div>
        ))}
        <ErrorMessage name={field.name} component="div" className="error" />
      </fieldset>
    )}
  />
)

export default CheckboxField
