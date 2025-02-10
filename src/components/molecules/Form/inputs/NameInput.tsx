import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface NameInputProps {
  field: FormField
}

const NameInput: React.FC<NameInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error
  const isRequired = field.required === '1' ? 'fsRequiredLabel' : ''

  return (
    <div id={field.id} className={`fsFieldCell ${hasError ? 'error' : ''}`}>
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className={`fsLabel ${isRequired}`}>
        <span className="label">{field.label}</span>
        {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </div>
      <div className="fsSubFieldGroup">
        {field.visible_subfields?.map((subfield) => {
          const subFieldName = `${field.name}${
            subfield.charAt(0).toUpperCase() + subfield.slice(1)
          }`
          return (
            <div
              key={`${field.id}-${subfield}`}
              className={`fsSubField ${subFieldName}`}
            >
              <Field
                type="text"
                label={field.label}
                name={`${field.id}-${subfield}`} // Use id for the field name
                placeholder={field.placeholder}
                autoComplete={
                  subfield === 'first'
                    ? 'given-name'
                    : subfield === 'last'
                    ? 'family-name'
                    : undefined
                }
              />
              <label htmlFor={`${field.id}-${subfield}`}>
                {`${subfield} ${field.type}`}
              </label>
              <ErrorMessage
                name={`${field.id}-${subfield}`}
                component="div"
                className="error"
              />
            </div>
          )
        }) || <p>No subfields available</p>}
      </div>
    </div>
  )
}

export default NameInput
