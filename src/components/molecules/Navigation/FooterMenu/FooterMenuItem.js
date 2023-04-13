'use client'

import React, { useRef } from 'react'
import Link from '@/components/common/Link'
import Dropdown from '../MainNavigation/Dropdown'

const FooterMenuItem = ({ item, depthLevel, index }) => {
  return (
    <li className="menu-items">
      <Link href={item.path ?? '#'}>{item.label}</Link>
    </li>
  )
}

export default FooterMenuItem
