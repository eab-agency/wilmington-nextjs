'use client'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
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

// helper function to group fields into sections
const groupFieldsIntoSections = (fields: FormField[]) => {
  const sections: Array<{ section?: FormField; fields: FormField[] }> = []
  let currentSection: { section?: FormField; fields: FormField[] } | null = null

  fields.forEach((field) => {
    if (field.type === 'section') {
      // Push current section if it exists
      if (currentSection) {
        sections.push(currentSection)
      }
      // Start new section
      currentSection = { section: field, fields: [] }
    } else {
      // Create initial section only when needed
      if (!currentSection) {
        currentSection = { fields: [] }
      }
      currentSection.fields.push(field)
    }
  })

  // Push the final section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

const RequestForInformationForm: React.FC<{ fields: FormField[] }> = ({
  fields
}) => {
  const router = useRouter()
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  )
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Process fields into sections
  const groupedSections = useMemo(
    () => groupFieldsIntoSections(fields),
    [fields]
  )

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
      const isArray = Array.isArray(fieldValue)

      switch (check.condition) {
        case 'equals':
          return isArray
            ? fieldValue.includes(check.option)
            : fieldValue === check.option
        case 'not_equals':
          return isArray
            ? !fieldValue.includes(check.option)
            : fieldValue !== check.option
        case 'contains':
          return String(fieldValue).includes(check.option)
        case 'greater_than':
          return Number(fieldValue) > Number(check.option)
        case 'less_than':
          return Number(fieldValue) < Number(check.option)
        default:
          return false
      }
    })

    const conditionalMet =
      conditional === 'all' ? results.every(Boolean) : results.some(Boolean)

    return action === 'show' ? conditionalMet : !conditionalMet
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
        return <h2>{field.type}</h2>
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
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
                className="form-section"
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
                {sectionGroup.fields.map((field) => renderField(field, values))}
              </div>
            )
          })}

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
  )
}

export default RequestForInformationForm
