'use client'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { FormField } from './formTypes'
import {
  AddressInput,
  CheckboxInput,
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

// Accepts form data from FormStack component

const RequestForInformationForm: React.FC<{ fields: FormField[] }> = ({
  fields
}) => {
  const router = useRouter()
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  )
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  // if fields is empty or undefined, return null
  if (!fields || fields.length === 0) return null
  // Create initial values for Formik
  const initialValues = fields.reduce((acc, field) => {
    if (field.type === 'address' && field.visible_subfields) {
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

  // Create Yup validation schema
  const validationSchema = Yup.object(
    fields.reduce((acc, field) => {
      if (field.required === '1') {
        if (field.type === 'address' && field.visible_subfields) {
          Object.assign(acc, getAddressValidationSchema(field))
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
      default:
        return null
    }
  }

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting }: FormikHelpers<Record<string, unknown>>
  ) => {
    const transformedValues = {
      displayTime: new Date().toISOString(),
      form: 3222784,
      viewkey: 'TYlVmXXEl1',
      fsUserAgent: navigator.userAgent,
      ...Object.fromEntries(
        Object.entries(values).map(([name, value]) => {
          const id = nameToIdMap[name] || name // Use name if id is not found
          return [`field${id}`, value]
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
      const thankYouPagePath = `${currentPath}/thanks`
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
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            {fields.map((field) => renderField(field, values))}
            <div className="fsSubmitButtonWrapper">
              <button
                className="fsSubmitButton"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting form...' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {submissionMessage && <p>{submissionMessage}</p>}
      {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}
    </>
  )
}

export default RequestForInformationForm
