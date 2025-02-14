import { ErrorMessage, Field, useFormikContext } from 'formik'
import React from 'react'
import { FormField } from '../formTypes'

interface NameInputProps {
  field: FormField
}

const NameInput: React.FC<NameInputProps> = ({ field }) => {
  const subfieldOrder = ['prefix', 'first', 'middle', 'last', 'suffix']
  const sortedSubfields = field.visible_subfields?.sort(
    (a, b) => subfieldOrder.indexOf(a) - subfieldOrder.indexOf(b)
  )

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
        {sortedSubfields?.map((subfield) => {
          const isOptional =
            (subfield === 'suffix' && field.suffix_optional === 1) ||
            (subfield === 'prefix' && field.suffix_optional === 1) ||
            (subfield === 'middle' && field.middle_name_optional === 1)
          return (
            <div
              key={`${field.id}-${subfield}`}
              className={`fsSubField fsName${
                subfield.charAt(0).toUpperCase() + subfield.slice(1)
              }`}
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
                {`${subfield.charAt(0).toUpperCase() + subfield.slice(1)} ${
                  field.type
                }`}{' '}
                {isOptional && '(optional)'}
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
