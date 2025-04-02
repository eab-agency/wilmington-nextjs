import { ErrorMessage, Field, useField } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { FormField } from '../formTypes'

interface AddressInputProps {
  field: FormField
}

export const getAddressValidationSchema = (
  field: AddressInputProps['field']
) => {
  const schema: Record<string, Yup.StringSchema> = {}
  field.visible_subfields?.forEach((subfield) => {
    if (subfield !== 'address2') {
      let errorMessage = ''
      switch (subfield) {
        case 'address':
          errorMessage = 'An address must be provided'
          break
        case 'city':
          errorMessage = 'A city must be provided'
          break
        case 'state':
          errorMessage = 'A state must be provided'
          break
        case 'zip':
          errorMessage = 'A ZIP Code must be provided'
          break
        default:
          errorMessage = `${field.label} ${subfield} is required`
      }
      schema[`${field.id}-${subfield}`] = Yup.string().required(errorMessage)
    }
  })
  return schema
}

// US state abbreviations only
const US_STATE_ABBREVIATIONS = [
  '',
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
]

const AddressInput: React.FC<AddressInputProps> = ({ field }) => {
  const [, meta] = useField(field.id)
  const hasError = meta.touched && meta.error
  const isRequired = field.required === '1' ? 'fsRequiredLabel' : ''

  return (
    <div className={`fsFieldCell ${hasError ? 'error' : ''}`}>
      <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
      <div className={`fsLabel ${isRequired}`}>
        <span className="label">{field.label}</span>
        {field.required === '1' && <span className="fsRequiredMarker">*</span>}
      </div>
      <div className="fsSubFieldGroup">
        {field.visible_subfields?.map((subfield) => {
          let subfieldLabel = subfield
          if (subfield === 'address') subfieldLabel = 'Address line 1'
          else if (subfield === 'address2') subfieldLabel = 'Address line 2'
          else if (subfield === 'zip') subfieldLabel = 'ZIP code'
          else if (subfield === 'state') subfieldLabel = 'State'

          const isStateDropdown = subfield === 'state' && field.format === 'US'

          return (
            <div
              key={`${field.id}-${subfield}`}
              className={`fsSubField fsField${subfield}`}
              id={field.id}
            >
              {isStateDropdown ? (
                <Field name={`${field.id}-${subfield}`} as="select">
                  {US_STATE_ABBREVIATIONS.map((abbr) => (
                    <option key={abbr} value={abbr}>
                      {abbr || 'Select a state'}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field
                  type="text"
                  name={`${field.id}-${subfield}`}
                  placeholder={field.placeholder}
                />
              )}
              <label htmlFor={`${field.id}-${subfield}`}>{subfieldLabel}</label>
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

export default AddressInput
