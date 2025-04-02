'use client'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import * as Yup from 'yup'
import CurrentValues from './CurrentValues'; // Import the CurrentValues component
import { FormField } from './formTypes'
import {
  AddressInput,
  CheckboxInput,
  DateTimeInput,
  EmailInput,
  NameInput,
  PhoneInput,
  RadioInput,
  RichTextField,
  SelectInput,
  TextInput,
  TextareaInput,
  getAddressValidationSchema
} from './inputs'
import groupFieldsIntoSections from './utils/groupFieldsIntoSections'
import shouldShowField from './utils/shouldShowFields'
// Accepts form data from FormStack component

const RequestForInformationForm: React.FC<{
  fields: FormField[]
  formId: string
}> = ({ fields, formId }) => {
  // console.log('🚀 ~ formId:', formId)
  // console.log('🚀 ~ fields:', fields)
  const router = useRouter()
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  )
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Process fields into sections
  const groupedSections = useMemo(
    () => groupFieldsIntoSections(fields),
    [fields]
  )
  // Show submission message and hide form
  if (submissionMessage) {
    return (
      <div className="submissionMessage">
        <h2>Submission Successful</h2>
        <p>{submissionMessage}</p>
      </div>
    )
  }

  // if fields is empty or undefined, return null
  if (!fields || fields.length === 0) return null
  // Create initial values for Formik
  const initialValues = fields.reduce((acc, field) => {
    if (field.type === 'address' && field.visible_subfields) {
      field.visible_subfields.forEach((subfield) => {
        acc[`${field.id}-${subfield}`] = ''
      })
    } else if (field.type === 'checkbox') {
      acc[field.id] = []
    } else if (field.type === 'datetime') {
      acc[`${field.id}M`] = ''
      acc[`${field.id}D`] = ''
      acc[`${field.id}Y`] = ''
    } else if (field.type === 'name' && field.visible_subfields) {
      field.visible_subfields.forEach((subfield) => {
        acc[`${field.id}-${subfield}`] = ''
      })
    } else {
      acc[field.id] = ''
    }
    return acc
  }, {} as Record<string, unknown>)

  // Create a lookup table from name to id
  const nameToIdMap = fields.reduce((acc, field) => {
    if (field.type === 'address' && field.visible_subfields) {
      field.visible_subfields.forEach((subfield) => {
        acc[`${field.name}-${subfield}`] = `${field.id}-${subfield}`
      })
    } else {
      acc[field.name] = field.id
    }
    return acc
  }, {} as Record<string, string>)

  // Create a sorted array of fields based on the sort property
  const sortedFields = [...fields].sort((a, b) => +a.sort - +b.sort)

  // Create Yup validation schema using the sortedFields array
  const validationSchema = Yup.object(
    sortedFields.reduce((acc, field) => {
      if (field.required === '1') {
        if (field.type === 'address' && field.visible_subfields) {
          Object.assign(acc, getAddressValidationSchema(field))
        } else if (field.type === 'checkbox') {
          acc[field.id] = Yup.array().min(1, `${field.label} is required`)
        } else if (field.type === 'datetime') {
          acc[field.id] = Yup.object({
            [`${field.id}M`]: Yup.string().required('Month is required'),
            [`${field.id}D`]: Yup.string().required('Day is required'),
            [`${field.id}Y`]: Yup.string().required('Year is required')
          }).test(
            'datetime-required',
            `${field.label} is required`,
            (value) =>
              !!value[`${field.id}M`] &&
              !!value[`${field.id}D`] &&
              !!value[`${field.id}Y`]
          )
        } else if (field.type === 'name' && field.visible_subfields) {
          field.visible_subfields.forEach((subfield) => {
            if (
              (subfield === 'suffix' && field.suffix_optional === 1) ||
              (subfield === 'prefix' && field.suffix_optional === 1) ||
              (subfield === 'middle' && field.middle_name_optional === 1)
            ) {
              acc[`${field.id}-${subfield}`] = Yup.string()
            } else {
              acc[`${field.id}-${subfield}`] = Yup.string().required(
                `${
                  subfield.charAt(0).toUpperCase() + subfield.slice(1)
                } Name is required`
              )
            }
          })
        } else {
          acc[field.id] = Yup.string().required(`${field.label} is required`)
        }
      }
      return acc
    }, {} as Record<string, any>)
  )

  // Function to check if a field should be shown based on logic
  const shouldShowField = (
    field: FormField,
    values: Record<string, unknown>
  ) => {
    if (!field.logic) return true

    const { action, conditional, checks } = field.logic
    const results = checks.map((check) => {
      const fieldValue = values[check.field]
      switch (check.condition) {
        case 'equals':
          return fieldValue === check.option
        // Add more conditions as needed
        default:
          return false
      }
    })

    return conditional === 'all'
      ? results.every(Boolean)
      : results.some(Boolean)
  }

  // Render form fields
  const renderField = (field: FormField, values: Record<string, unknown>) => {
    if (field.hidden === '1' || !shouldShowField(field, values)) return null

    switch (field.type) {
      case 'text':
        return <TextInput key={field.id} field={field} />
      case 'email':
        return <EmailInput key={field.id} field={field} />
      case 'phone':
        return <PhoneInput key={field.id} field={field} />
      case 'textarea':
        return <TextareaInput key={field.id} field={field} />
      case 'select':
        return <SelectInput key={field.id} field={field} />
      case 'radio':
        return <RadioInput key={field.id} field={field} />
      case 'checkbox':
        return <CheckboxInput key={field.id} field={field} />
      case 'address':
        return <AddressInput key={field.id} field={field} />
      case 'name':
        return <NameInput key={field.id} field={field} />
      case 'richtext':
        return <RichTextField key={field.id} field={field} />
      case 'datetime':
        return <DateTimeInput key={field.id} field={field} />
      default:
        return <h2 key={field.id}>{field.type} Field type not supported</h2>
    }
  }

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting }: FormikHelpers<Record<string, unknown>>
  ) => {
    setSubmitting(true)
    setSubmitAttempted(true) // Set the state when the submit button is clicked

    const transformedValues = {
      displayTime: new Date().toISOString(),
      form: formId,
      viewkey: 'TYlVmXXEl1',
      fsUserAgent: navigator.userAgent,
      ...Object.fromEntries(
        Object.entries(values).map(([name, value]) => {
          const id = nameToIdMap[name] || name // Use name if id is not found
          return [
            `field${id}`,
            Array.isArray(value) ? JSON.stringify(value) : value
          ]
        })
      )
    }

    try {
      const response = await fetch(
        'https://wilmingtoncollege.formstack.com/forms/index.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(
            transformedValues as unknown as Record<string, string>
          ).toString()
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Check if the thank you page exists
      const currentPath = window.location.pathname
      const thankYouPagePath = `${currentPath}/rfi-thanks`
      const thankYouPageResponse = await fetch(thankYouPagePath)
      if (thankYouPageResponse.ok) {
        router.push(thankYouPagePath)
      } else {
        setSubmissionMessage('Thank you for submitting the form')
      }
    } catch (error) {
      // Handle submission error
      console.error('Form submission error:', error)
      setSubmissionError(
        'There was an error submitting the form. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values, dirty }) => {
        return (
          <Form>
            {groupedSections.map((sectionGroup, index) => {
              // Determine if we should show this section
              const showSection = sectionGroup.section
                ? shouldShowField(sectionGroup.section, values)
                : true // Always show fields without a section

              if (!showSection) return null

              return (
                <div
                  key={sectionGroup.section?.id || `section-${index}`}
                  className="fsSection"
                  id={`fsSection${index}`}
                >
                  {/* Render section header */}
                  {sectionGroup.section && (
                    <div className="section-header">
                      <h2>{sectionGroup.section.section_heading}</h2>
                      {sectionGroup.section.section_text && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sectionGroup.section.section_text
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Render fields in this section */}
                  {sectionGroup.fields
                    .sort((a, b) => +a.sort - +b.sort)
                    .map((field) => renderField(field, values))}
                </div>
              )
            })}
            {Object.keys(errors).length > 0 && (
              <div className="error">
                There are errors on the form. Please fix them before submitting.
              </div>
            )}
            <div className="fsSubmitButtonWrapper">
              <button
                className="fsSubmitButton"
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Submitting form...' : 'Submit'}
              </button>
            </div>
            {/* <CurrentValues /> */}
          </Form>
        )
      }}
    </Formik>
  )
}

export default RequestForInformationForm
