'use client'
import { gql } from '@apollo/client'

// import React from 'react'
import { useMenuData } from '@/functions/contextProviders/'
import formatHeirarchialMenu from '@/functions/wordpress/menus/formatHeirarchialMenu'
import { useEffect, useRef, useState } from 'react'
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
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
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

const MainNavigation = ({ enableDropdown }) => {
  const { data: menu } = useMenuData()
  const mainMenu = formatHeirarchialMenu(menu?.mainMenuItems?.nodes ?? [])

  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen((prev) => !prev)
  }

  const navWrapper = useRef(null)

  const documentClickHandler = (e) => {
    if (open && !e.target.closest('ul')) {
      setOpen(false)
    }
  }

  useEffect(() => {
    const theNavWrapper = navWrapper.current

    theNavWrapper.addEventListener('click', documentClickHandler)

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    })

    return () => {
      theNavWrapper.removeEventListener('click', documentClickHandler)
    }
  })

  if (!mainMenu) {
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
        <div ref={navWrapper} className={styles.navWrapper}>
          <Burger open={open} setOpen={handleToggle} />
          <ul>
            {mainMenu?.map((navItem, index) => (
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
    }
  `
}
