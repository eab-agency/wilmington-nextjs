import dayjs from 'dayjs'
import { Field, useFormikContext } from 'formik'
import React, { useRef, useState } from 'react'
import { FormField } from '../formTypes'

interface DateTimeInputProps {
  field: FormField
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ field }) => {
  const { setFieldValue } = useFormikContext()
  const [inputValue, setInputValue] = useState({
    month: '',
    day: '',
    year: ''
  })

  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'month' && value.length === 2) {
      dayRef.current?.focus()
    } else if (name === 'day' && value.length === 2) {
      yearRef.current?.focus()
    }
    setInputValue((prev) => ({ ...prev, [name]: value }))
  }

  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement
    if (event.key === 'Backspace' && value.length === 0) {
      if (name === 'day') {
        monthRef.current?.focus()
      } else if (name === 'year') {
        dayRef.current?.focus()
      }
    }
  }

  const handleBlur = () => {
    const date = dayjs(
      `${inputValue.month} ${inputValue.day}, ${inputValue.year}`
    )
    if (date.isValid()) {
      setFieldValue(`${field.id}M`, date.format('MMM'))
      setFieldValue(`${field.id}D`, date.format('DD'))
      setFieldValue(`${field.id}Y`, date.format('YYYY'))
      setFieldValue(`${field.id}H`, date.format('hh'))
      setFieldValue(`${field.id}I`, date.format('mm'))
      setFieldValue(`${field.id}S`, date.format('ss'))
      setFieldValue(`${field.id}A`, date.format('A'))
    } else {
      setFieldValue(`${field.id}M`, '')
      setFieldValue(`${field.id}D`, '')
      setFieldValue(`${field.id}Y`, '')
      setFieldValue(`${field.id}H`, '')
      setFieldValue(`${field.id}I`, '')
      setFieldValue(`${field.id}S`, '')
      setFieldValue(`${field.id}A`, '')
    }
  }

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
              name="month"
              placeholder="MM"
              required={field.required === '1'}
              type="text"
              aria-label={`Month field for ${field.label}`}
              data-testid={`${field.id}-month-input`}
              value={inputValue.month}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className="fsDateInput"
              innerRef={monthRef}
            />
            <Field
              id={`${field.id}D`}
              name="day"
              placeholder="DD"
              required={field.required === '1'}
              type="text"
              aria-label={`Day field for ${field.label}`}
              data-testid={`${field.id}-day-input`}
              value={inputValue.day}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className="fsDateInput"
              innerRef={dayRef}
            />
            <Field
              id={`${field.id}Y`}
              name="year"
              placeholder="YYYY"
              required={field.required === '1'}
              type="text"
              aria-label={`Year field for ${field.label}`}
              data-testid={`${field.id}-year-input`}
              value={inputValue.year}
              onChange={handleDateChange}
              onKeyDown={handleBackspace}
              onBlur={handleBlur}
              className="fsDateInput"
              innerRef={yearRef}
            />
          </span>
        </div>
      </label>
      <input
        name={`${field.id}H`}
        id={`${field.id}H`}
        type="hidden"
        readOnly
        data-testid="hour"
        data-fs-field-id={field.id}
        data-fs-field-name="datetime"
        data-fs-field-alias="H"
        className="StyledHiddenInput"
      />
      <input
        name={`${field.id}I`}
        id={`${field.id}I`}
        type="hidden"
        readOnly
        data-testid="minutes"
        data-fs-field-id={field.id}
        data-fs-field-name="datetime"
        data-fs-field-alias="I"
        className="StyledHiddenInput"
      />
      <input
        name={`${field.id}S`}
        id={`${field.id}S`}
        type="hidden"
        readOnly
        data-testid="seconds"
        data-fs-field-id={field.id}
        data-fs-field-name="datetime"
        data-fs-field-alias="S"
        className="StyledHiddenInput"
      />
      <input
        name={`${field.id}A`}
        id={`${field.id}A`}
        type="hidden"
        readOnly
        data-testid="ampm"
        data-fs-field-id={field.id}
        data-fs-field-name="datetime"
        data-fs-field-alias="A"
        className="StyledHiddenInput"
      />
    </div>
  )
}

export default DateTimeInput
