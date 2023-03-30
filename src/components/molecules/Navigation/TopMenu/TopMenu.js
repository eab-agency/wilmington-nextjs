import React from 'react'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import * as styles from './TopMenu.module.scss'

import TopMenuItem from './TopMenuItem'

const TopMenu = ({ menuItems }) => {

  if (!menuItems || !menuItems?.length) {
    return null
  }

  return (
    <>
      <ul className={styles.topMenuItems}>
        {menuItems.map((navItem, index) => (
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
