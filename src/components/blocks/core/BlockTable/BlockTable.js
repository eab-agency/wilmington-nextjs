import React from 'react'
import Table from '@/components/atoms/Table'
import PropTypes from 'prop-types'

export default function BlockTable ({
  anchor,
  body,
  caption,
  className,
  foot,
  head
}) {
  return (
    <Table
      id={anchor}
      className={className}
      tag="p"
      head={head}
      body={body}
      foot={foot}
      caption={caption}
    />
  )
}

BlockTable.propTypes = {
  anchor: PropTypes.string,
  className: PropTypes.string,
  head: PropTypes.array,
  body: PropTypes.array,
  foot: PropTypes.array,
  caption: PropTypes.string
}
