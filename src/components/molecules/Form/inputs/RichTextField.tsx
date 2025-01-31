import React from 'react'
import { FormField } from '../formTypes'

interface RichTextProps {
  field: FormField
}

const RichTextField: React.FC<RichTextProps> = ({ field }) => {
  if (field.hidden === '1') {
    return null
  } else {
    return (
      <span id={field.id} className="fsFieldCell">
        <a id={`field-anchor-${field.id}`} tabIndex={-1} aria-hidden="true"></a>
        <div
          dangerouslySetInnerHTML={{ __html: field.section_text || '' }}
        ></div>
      </span>
    )
  }
}

export default RichTextField
