'use client'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import * as Yup from 'yup'
import CurrentValues from './CurrentValues' // Import the CurrentValues component
import LoadingIndicator from './LoadingIndicator' // Import the loading indicator
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
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Process fields into sections
  const groupedSections = useMemo(
    () => groupFieldsIntoSections(fields),
    [fields]
  )
  // Handle different form states
  if (isRedirecting) {
    // Show a loading indicator when redirecting
    return (
      <div className="submissionMessage">
        <LoadingIndicator />
        <p className="text-center">Redirecting to confirmation page...</p>
      </div>
    )
  }

  // Show submission message and hide form
  if (submissionMessage) {
    return (
      <div className="submissionMessage">
        <p>{submissionMessage}</p>
      </div>
    )
  }

  // Show submission error if there is one
  if (submissionError) {
    return (
      <div className="submissionError">
        <h2>Submission Error</h2>
        <p>{submissionError}</p>
        <button onClick={() => setSubmissionError(null)}>Try Again</button>
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

    // Format date in the exact format used by Formstack
    const now = new Date()
    const offset = -now.getTimezoneOffset() / 60
    const offsetStr =
      offset >= 0
        ? `+${String(offset).padStart(2, '0')}:00`
        : `-${String(Math.abs(offset)).padStart(2, '0')}:00`
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}${offsetStr}`

    // Collect IDs of hidden fields based on logic
    const hiddenByLogicFieldIds = fields
      .filter(
        (field) => field.hidden === '1' || !shouldShowField(field, values)
      )
      .map((field) => field.id)

    // Prepare the transformed values object for the Formstack API
    const transformedValues: Record<string, any> = {
      user_agent: navigator.userAgent
    }

    // Add form field values according to Formstack API requirements
    // The API expects field values in the format field_<fieldId>
    Object.entries(values).forEach(([name, value]) => {
      const id = nameToIdMap[name] || name // Use name if id is not found

      if (typeof value === 'object' && value !== null) {
        // For structured fields like name and address
        Object.entries(value).forEach(([subfield, subfieldValue]) => {
          transformedValues[`field_${id}[${subfield}]`] = subfieldValue
        })
      } else {
        transformedValues[`field_${id}`] = Array.isArray(value)
          ? JSON.stringify(value)
          : value
      }
    })

    // Add metadata that might be useful for debugging
    transformedValues._metadata = {
      displayTime: formattedDate,
      hiddenFieldIds: hiddenByLogicFieldIds
    }

    try {
      console.log('Submitting form to Formstack API...')
      setSubmissionMessage('Submitting form...')

      // Send the form data to our API endpoint that handles the authentication
      const response = await fetch(`/api/formstack?formId=${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedValues)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Form submission error:', data)
        throw new Error(data.error || data.message || 'Error submitting form')
      }

      // Check if the thank you page exists
      const currentPath = router.asPath
      const thanksPath = `${currentPath}/rfi-thanks`

      // Show a temporary processing message that won't display if redirecting
      setSubmissionMessage('Processing your submission...')

      // Check if the thanks page exists before redirecting
      const checkThanksPage = async () => {
        try {
          const response = await fetch(thanksPath, {
            method: 'HEAD'
          })

          if (response.ok) {
            // If the thanks page exists, set redirecting state and navigate
            setIsRedirecting(true)
            // Small delay to avoid any flash of the success message
            setTimeout(() => {
              router.push(thanksPath)
            }, 100)
          } else {
            // If not, just show a success message
            setSubmissionMessage(
              `Thank you for your submission! Your request has been received.`
            )
          }
        } catch (error) {
          // If there's an error checking the thanks page, show the success message
          setSubmissionMessage(
            `Thank you for your submission! Your request has been received.`
          )
        }
      }

      // Execute the check
      checkThanksPage()
    } catch (error) {
      // Handle errors during form submission
      console.error('Form submission error:', error)

      // Set a user-friendly error message
      setSubmissionError(
        'There was an error submitting the form. Please try again or contact us directly.'
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
