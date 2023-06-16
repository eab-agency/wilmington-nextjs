'use client'
import { gql } from '@apollo/client'

// import React from 'react'
import { useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import MainNavigationItem from './MainNavigationItem'

import styles from './mainNavigation.module.scss'

const Burger = ({ open, setOpen }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add(styles.navOpen)
    } else {
      document.body.classList.remove(styles.navOpen)
    }
  }, [open])

  return (
    <button
      className={styles.hamburger}
      open={open}
      onClick={() => setOpen(!open)}
    >
      {open ? (
        <MdClose />
      ) : (
        <>
          <MdMenu /> <span>Menu</span>
        </>
      )}
    </button>
  )
}

const MainNavigation = ({ menuItems, enableDropdown }) => {
  const items = menuItems
  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen((prev) => !prev)
  }

  if (!menuItems) {
    return null
  }
  const openCloseClasses = open ? styles.openMenu : styles.closedMenu
  const depthLevel = 0
  return (
    <>
      <nav
        aria-label="Main"
        className={`${styles.navContainer} ${openCloseClasses}`}
      >
        <div className={styles.navWrapper}>
          <Burger open={open} setOpen={handleToggle} />
          <ul>
            {items &&
              items.map((navItem, index) => (
                <MainNavigationItem
                  item={navItem}
                  key={index}
                  index={index}
                  depthLevel={depthLevel}
                  enableDropdown={enableDropdown}
                />
              ))}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation

MainNavigation.fragments = {
  entry: gql`
    fragment NavigationMenuItemFragment on MenuItem {
      id
      path
      label
      parentId
      cssClasses
      menu {
        node {
          name
        }
      }
    }
  `
}
