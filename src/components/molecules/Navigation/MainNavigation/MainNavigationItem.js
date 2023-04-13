'use client'

import React, {useEffect, useRef, useState} from 'react'
import Link from '@/components/common/Link'
import Dropdown from './Dropdown'
import styles from './mainNavigation.module.scss'

const MainNavigationItem = ({item, depthLevel, index, enableDropdown}) => {
  // to control the dropdown state
  const [dropdown, setDropdown] = useState(false)

  const handleButtonClick = (item) => {
    setDropdown(!dropdown)
  }

  // attach this ref to the li below
  const ref = useRef()
  // closes the dropdown menu when user clicks outside of it by setting event listener on the ref
  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('click', handler)
    // document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('click', handler)
      // document.removeEventListener('touchstart', handler);
    }
  }, [dropdown])

  // TODO: this is messy, need to refactor
  return (
    <li className={styles.menuItems} ref={ref}>
      {item.children?.length > 0 ? (
        <>
          {enableDropdown ? (
            <button
              tabIndex={0}
              type="button"
              aria-expanded={dropdown ? 'true' : 'false'}
              aria-haspopup="menu"
              onClick={handleButtonClick}
            >
              {depthLevel > 0 ? (
                <span>&raquo;</span>
              ) : (
                <span className="arrow" />
              )}
              {item.label}{' '}
            </button>
          ) : (
            <Link href={item.path ?? '#'}>{item.label}</Link>
          )}
          {enableDropdown ? (
            <Dropdown
              dropdown={dropdown}
              submenus={item.children}
              depthLevel={depthLevel}
              index={index}
              enableDropdown={enableDropdown}
            />
          ) : (
            <ul>
              {item.children.map((submenu, index) => (
                <MainNavigationItem
                  item={submenu}
                  key={index}
                  depthLevel={depthLevel}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link href={item.path ?? '#'}>{item.label}</Link>
      )}
    </li>
  )
}

export default MainNavigationItem
