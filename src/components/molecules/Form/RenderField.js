import { useFormikContext } from 'formik'

import {
  AddressField,
  CheckboxField,
  DateTimeField,
  EmailField,
  NameField,
  PhoneField,
  RadioField,
  RichTextField,
  SelectField,
  TextAreaField,
  TextField
} from './Fields'

import { shouldShowField } from './conditionalLogic'

const RenderField = ({ field, fieldIdToNameMap }) => {
  const { values } = useFormikContext()

  // handle conditional logic from formstack
  if (!shouldShowField(field.logic, values, fieldIdToNameMap)) {
    return null
  }

  switch (field.type) {
    case 'text':
      return <TextField key={field.id} field={field} />
    case 'textarea':
      return <TextAreaField key={field.id} field={field} />
    case 'select':
      return <SelectField key={field.id} field={field} />
    case 'radio':
      return <RadioField key={field.id} field={field} />
    case 'checkbox':
      return <CheckboxField key={field.id} field={field} />
    case 'name':
      return <NameField key={field.id} field={field} />
    case 'address':
      return <AddressField key={field.id} field={field} />
    case 'email':
      return <EmailField key={field.id} field={field} />
    case 'datetime':
      return <DateTimeField key={field.id} field={field} />
    case 'richtext':
      return <RichTextField key={field.id} field={field} />
    case 'phone':
      return <PhoneField key={field.id} field={field} />

    default:
      // eslint-disable-next-line no-console
      console.warn('No component for:', field.type)
      return null
  }
}

export default RenderField
