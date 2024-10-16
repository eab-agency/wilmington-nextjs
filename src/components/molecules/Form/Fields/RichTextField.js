import React from 'react'

const RichTextField = ({ field }) => {
  if (field.hidden === '1') {
    return null
  } else {
    return <div dangerouslySetInnerHTML={{ __html: field.section_text }}></div>
  }
}

export default RichTextField
