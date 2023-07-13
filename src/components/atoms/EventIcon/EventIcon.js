import React from 'react'
import {
  MdAccessTime,
  MdLocationPin,
  MdOutlineCalendarMonth
} from 'react-icons/md'

export default function EventIcon(props) {
  const { icon } = props

  if (icon === 'calendar') {
    return (
      <i>
        <MdOutlineCalendarMonth />
      </i>
    )
  } else if (icon === 'location') {
    return (
      <i>
        <MdLocationPin />
      </i>
    )
  } else if (icon === 'time') {
    return (
      <i>
        <MdAccessTime />
      </i>
    )
  } else {
    return null
  }
}
