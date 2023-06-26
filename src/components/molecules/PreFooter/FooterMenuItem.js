'use client'

import NavIcon from '@/components/atoms/NavIcon'
import Link from '@/components/common/Link'
import { useRef } from 'react'
import FooterItemGraphic from './FooterItemGraphic'
import styles from './FooterMenuItem.module.scss'

const FooterMenuItem = ({ item }) => {
  const ref = useRef()

  return (
    <li ref={ref}>
      <Link
        href={item.path ?? '#'}
        className={styles.link}
        rel="noopener noreferrer"
      >
        <FooterItemGraphic
          className={styles.linkContent}
          graphic={item.label}
        />
        <NavIcon icon={item.label} />
        <div className={styles.label}>{item.label}</div>
      </Link>
    </li>
  )
}

export default FooterMenuItem
