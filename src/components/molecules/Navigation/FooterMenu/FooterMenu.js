import React from 'react'
import { useWordPressContext } from '@/components/common/WordPressProvider'

import * as styles from './FooterMenu.module.scss'

// import { useMenuItems } from '@/hooks'
import FooterMenuItem from './FooterMenuItem'

const FooterMenu = ({ menuItems, menuTitle }) => {

  if (!menuItems || !menuItems?.length) {
    return null
  }

  return (
    <nav className={styles.footerNav}>
      <h3>{menuTitle}</h3>
      <ul className={styles.footerMenu}>
        {menuItems.map((navItem, index) => (
          <FooterMenuItem
            item={navItem}
            key={index}
            index={index}
          />
        ))}
      </ul>
    </nav>
  )
}

export default FooterMenu
