import React from 'react'
import MainNavigationItem from './MainNavigationItem'
import * as styles from './mainNavigation.module.scss'

const Dropdown = ({ submenus, dropdown, depthLevel, enableDropdown }) => {
  const openCloseClasses = dropdown
    ? styles.openedSubMenu
    : styles.closedSubMenu
  // increment the depthLevel for each submenu
  depthLevel = depthLevel + 1

  return (
    <ul className={openCloseClasses}>
      {submenus.map((submenu, index) => (
        <MainNavigationItem
          item={submenu}
          key={index}
          depthLevel={depthLevel}
          enableDropdown={enableDropdown}
        />
      ))}
    </ul>
  )
}

export default Dropdown
