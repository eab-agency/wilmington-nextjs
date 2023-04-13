import React from 'react'

const Description = ({description}) => (
  <p dangerouslySetInnerHTML={{__html: description}} />
)

export default Description
