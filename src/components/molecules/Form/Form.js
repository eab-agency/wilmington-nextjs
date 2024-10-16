/* eslint-disable no-console */
import { Form, Formik, useFormikContext } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import ErrorSummary from './ErrorSummary'
import RenderField from './RenderField'

// Create a mapping of field IDs to field names
const createFieldIdToNameMap = (fields) => {
  const map = {}
  fields.forEach((field) => {
    map[field.id] = field.name
  })
  return map
}

// Accepts form data from FormStack component

const RequestForInformationForm = ({ formData }) => {
  // console.log('🚀 ~ RequestForInformationForm ~ formData:', formData)
  // Transform formData to use prefixed names
  const prefixedFormData = formData.map((field) => ({
    ...field,
    name: `field${field.id}` // Prefix the field name with 'field'
  }))
  // console.log(
  //   '🚀❤️❤️❤️ ~ prefixedFormData ~ prefixedFormData:',
  //   prefixedFormData
  // )

  // Generate initialValues using the prefixed names
  const initialValues = prefixedFormData.reduce((acc, field) => {
    acc[field.name] = field.type === 'checkbox' ? [] : field.default || ''
    return acc
  }, {})

  const validationSchema = Yup.object().shape({
    // Create validation rules based on the form field properties
    ...prefixedFormData.reduce((acc, field) => {
      const fieldName = field.name
      if (field.required === '1') {
        if (field.type === 'address') {
          acc[fieldName] = Yup.object().shape({
            [`${fieldName}-address`]: Yup.string().required(
              'Address Line 1 is required'
            ),
            [`${fieldName}-city`]: Yup.string().required('City is required'),
            [`${fieldName}-state`]: Yup.string().required('State is required'),
            [`${fieldName}-zip`]: Yup.string().required('Zip Code is required')
          })
        } else {
          acc[fieldName] = Yup.string().required(`${field.label} is required`)
        }
      }
      console.log('⭐⭐⭐ ~ ...prefixedFormData.reduce ~ acc:', acc)
      return acc
    }, {})
  })

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData()

    // Iterate over form values
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        // Transform array fields (checkboxes) into the desired format
        value.forEach((item) => {
          formData.append(`${key}[]`, item)
        })
      } else {
        // Keep other fields unchanged
        formData.append(key, value)
      }
    }

    // Log the formatted data to verify
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    // Here you can submit `formData` to your server using fetch or axios
    // Example: axios.post('your-api-endpoint', formData)
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <ErrorSummary formData={prefixedFormData} />

          {prefixedFormData.map((field) => (
            <RenderField
              key={field.id}
              field={field}
              fieldIdToNameMap={createFieldIdToNameMap(prefixedFormData)}
            />
          ))}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default RequestForInformationForm
