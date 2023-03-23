import React from 'react'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import * as styles from './TopMenu.module.scss'

import TopMenuItem from './TopMenuItem'

const TopMenu = ({ location, menuItems = [] }) => {
  const { menus } = useWordPressContext()
  const items = menus?.UTILITY_NAV || []

  return (
    <>
      <ul className={styles.topMenuItems}>
        {items.map((navItem, index) => (
          <TopMenuItem
            item={navItem}
            key={index}
            index={index}
          />
        ))}
      </ul>
    </>
  )
}

export default TopMenu
