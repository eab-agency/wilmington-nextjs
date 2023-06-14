import React from 'react'
import Link from '@/components/common/Link'

const ProgramSubMenuItem = ({ item }) => {
  return (
    <li>
      <Link href={item.url ?? '#'}>{item.label}</Link>
    </li>
  )
}

export default ProgramSubMenuItem
