import React from 'react'
import styles from './ProgramSubMenu.module.scss'

import ProgramSubMenuItem from './ProgramSubMenuItem'

const ProgramSubMenu = ({ location, menuItems }) => {
  const items = menuItems

  return (
    <>
      <pre>ProgramSubMenu.js</pre>
      <ul className={styles.subMenuItems}>
        {items.map((navItem, index) => (
          <ProgramSubMenuItem item={navItem} key={index} index={index} />
        ))}
      </ul>
    </>
  )
}

export default ProgramSubMenu
