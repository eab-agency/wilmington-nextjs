import dayjs from 'dayjs'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { FormField } from '../formTypes'

interface DateTimeInputProps {
  field: FormField
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ field }) => {
  const { setFieldValue, values, errors, touched } =
    useFormikContext<Record<string, any>>()
  const [inputValue, setInputValue] = useState({
    month: values[`${field.id}M`] || '',
    day: values[`${field.id}D`] || '',
    year: values[`${field.id}Y`] || ''
  })

  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue({
      month: values[`${field.id}M`] || '',
      day: values[`${field.id}D`] || '',
      year: values[`${field.id}Y`] || ''
    })
  }, [values, field.id])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const subfield = name.slice(-1).toLowerCase()
    setInputValue((prev) => ({
      ...prev,
      [subfield]: value
    }))
    setFieldValue(name, value)

    if (subfield === 'm' && value.length === 2) {
      dayRef.current?.focus()
    } else if (subfield === 'd' && value.length === 2) {
      yearRef.current?.focus()
    }
  }

  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement
    if (event.key === 'Backspace' && value.length === 0) {
      if (name === `${field.id}D`) {
        monthRef.current?.focus()
      } else if (name === `${field.id}Y`) {
        dayRef.current?.focus()
      }
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const subfield = name.slice(-1).toLowerCase()
    setInputValue((prev) => ({
      ...prev,
      [subfield]: value
    }))
    setFieldValue(name, value)

    const date = dayjs(
      `${inputValue.month} ${inputValue.day}, ${inputValue.year}`
    )
    if (!date.isValid()) {
      setFieldValue(`${field.id}M`, '')
      setFieldValue(`${field.id}D`, '')
      setFieldValue(`${field.id}Y`, '')
    }
  }

  const hasError = (subfield: string) =>
    touched[`${field.id}${subfield}`] && errors[`${field.id}${subfield}`]

  return (
    <div className="fsFieldCell">
      <label
        className="fsLabelVertical"
        htmlFor={field.id}
        id={`label-${field.id}`}
        data-testid={`field-${field.id}`}
      >
        <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
        <div className="fsLabel fsRequiredLabel">
          <span>{field.label}</span>
          {field.required === '1' && (
            <span className="fsRequiredMarker">*</span>
          )}
        </div>
        <div className="fsDateField">
          <span className="fsDateTimeWrapper">
            <Field
              id={`${field.id}M`}
              name={`${field.id}M`}
              placeholder="MM"
              required={field.required === '1'}
              type="text"
              aria-label={`Month field for ${field.label}`}
              data-testid={`${field.id}-month-input`}
              value={inputValue.month}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className={`fsDateInput ${hasError('M') ? 'error' : ''}`}
              innerRef={monthRef}
            />
            <ErrorMessage
              name={`${field.id}M`}
              component="div"
              className="error"
            />
            <Field
              id={`${field.id}D`}
              name={`${field.id}D`}
              placeholder="DD"
              required={field.required === '1'}
              type="text"
              aria-label={`Day field for ${field.label}`}
              data-testid={`${field.id}-day-input`}
              value={inputValue.day}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className={`fsDateInput ${hasError('D') ? 'error' : ''}`}
              innerRef={dayRef}
            />
            <ErrorMessage
              name={`${field.id}D`}
              component="div"
              className="error"
            />
            <Field
              id={`${field.id}Y`}
              name={`${field.id}Y`}
              placeholder="YYYY"
              required={field.required === '1'}
              type="text"
              aria-label={`Year field for ${field.label}`}
              data-testid={`${field.id}-year-input`}
              value={inputValue.year}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className={`fsDateInput ${hasError('Y') ? 'error' : ''}`}
              innerRef={yearRef}
            />
            <ErrorMessage
              name={`${field.id}Y`}
              component="div"
              className="error"
            />
          </span>
        </div>
      </label>
    </div>
  )
}

export default DateTimeInput
