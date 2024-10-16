import { ErrorMessage, Field } from 'formik'
import React from 'react'

const NameField = ({ field }) => {
  const renderSubField = (subField) => {
    switch (subField) {
      case 'prefix':
        return (
          <div key={`${field.name}_prefix`}>
            <label htmlFor={`${field.name}_prefix`}>
              Prefix
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      case 'first':
        return (
          <div key={`${field.name}_first`}>
            <label htmlFor={`${field.name}_first`}>
              First Name
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      case 'middle':
        return (
          <div key={`${field.name}_middle`}>
            <label htmlFor={`${field.name}_middle`}>
              Middle Name
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      case 'initial':
        return (
          <div key={`${field.name}_initial`}>
            <label htmlFor={`${field.name}_initial`}>
              Middle Initial
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      case 'last':
        return (
          <div key={`${field.name}_last`}>
            <label htmlFor={`${field.name}_last`}>
              Last Name
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      case 'suffix':
        return (
          <div key={`${field.name}_suffix`}>
            <label htmlFor={`${field.name}_suffix`}>
              Suffix
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
              size={field.text_size}
            />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <label>{field.label}</label>
      {field.visible_subfields.map((subField) => renderSubField(subField))}
    </div>
  )
}

export default NameField
