import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface NameInputProps {
  field: FormField
}

const NameInput: React.FC<NameInputProps> = ({ field }) => {
  return (
    <span id={field.id} className="fsFieldCell">
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className="fsLabel">
        <span className="label">{field.label}</span>
      </div>
      <div className="fsSubFieldGroup">
        {field.visible_subfields?.map((subfield) => (
          <div key={`${field.id}-${subfield}`} className="fsSubField">
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
        )) || <p>No subfields available</p>}
      </div>
    </span>
  )
}

export default NameInput
