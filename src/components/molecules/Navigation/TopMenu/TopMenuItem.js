import React from 'react'
import Link from '@/components/common/Link'
import NavIcon from '@/components/atoms/NavIcon/'

const TopMenuItem = ({item}) => {
  return (
    <li>
      <Link href={item.path ?? '#'}>
        <NavIcon icon={item.label} />
        {item.label}
      </Link>
    </li>
  )
}

export default TopMenuItem
