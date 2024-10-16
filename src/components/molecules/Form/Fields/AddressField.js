import { ErrorMessage, Field, useFormikContext } from 'formik'
import React from 'react'
import ErrorSummary from '../ErrorSummary'
import { states } from '../states'

const AddressField = ({ field }) => {
  const { errors } = useFormikContext()

  React.useEffect(() => {
    console.log('🚀🚨🚨🚨🚨🚨 ~ AddressField ~ errors:', errors)
  }, [errors])

  const renderSubField = (subField) => {
    switch (subField) {
      case 'address':
        return (
          <div key={`${field.name}-address`}>
            <label htmlFor={`${field.name}-address`}>
              Address Line 1
              {field.required === '1' && (
                <span className="field-star" aria-hidden="true">
                  *
                </span>
              )}{' '}
            </label>
            <Field
              type="text"
              id={`${field.name}-address`}
              name={`${field.name}-address`}
              size={field.text_size}
              required={true}
            />
            <ErrorMessage
              name={`${field.name}-address`}
              component="div"
              className="error"
            />
          </div>
        )
      case 'address2':
        return (
          <div key={`${field.name}-address2`}>
            <label htmlFor={`${field.name}-address2`}>Address Line 2</label>
            <Field
              type="text"
              id={`${field.name}-address2`}
              name={`${field.name}-address2`}
              size={field.text_size}
            />
            <ErrorMessage
              name={`${field.name}-address2`}
              component="div"
              className="error"
            />
          </div>
        )
      case 'city':
        return (
          <div key={`${field.name}-city`}>
            <label htmlFor={`${field.name}-city`}>
              City
              {field.required === '1' && (
                <span className="field-star" aria-hidden="true">
                  *
                </span>
              )}{' '}
            </label>
            <Field
              type="text"
              id={`${field.name}-city`}
              name={`${field.name}-city`}
              size={field.text_size}
              required={true}
            />
            <ErrorMessage
              name={`${field.name}-city`}
              component="div"
              className="error"
            />
          </div>
        )
      case 'state':
        return (
          <div key={`${field.name}-state`}>
            <label htmlFor={`${field.name}-state`}>
              State
              {field.required === '1' && (
                <span className="field-star" aria-hidden="true">
                  *
                </span>
              )}{' '}
            </label>
            <Field
              as="select"
              id={`${field.name}-state`}
              name={`${field.name}-state`}
              required={true}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name={`${field.name}-state`}
              component="div"
              className="error"
            />
          </div>
        )

      case 'zip':
        return (
          <div key={`${field.name}-zip`}>
            <label htmlFor={`${field.name}-zip`}>
              Zip Code
              {field.required === '1' && (
                <span className="field-star" aria-hidden="true">
                  *
                </span>
              )}{' '}
            </label>
            <Field
              type="text"
              id={`${field.name}-zip`}
              name={`${field.name}-zip`}
              size={field.text_size}
              required={true}
            />
            <ErrorMessage
              name={`${field.name}-zip`}
              component="div"
              className="error"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <ErrorSummary formData={[field]} />
      <span>{field.label}</span>

      {field.visible_subfields.map((subField) => renderSubField(subField))}
    </div>
  )
}

export default AddressField
