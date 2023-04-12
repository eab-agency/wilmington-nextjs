'use client'

import React from 'react';
import styles from './mainNavigation.module.scss';

import MainNavigationItem from './MainNavigationItem';
import { MdMenu, MdClose } from 'react-icons/md';

const Burger = ({ open, setOpen }) => {
  return (
    <button
      className={styles.hamburger}
      open={open}
      onClick={() => setOpen(!open)}
    >
      {open ? (<MdClose />) : (
        <>
          <MdMenu /> <span>Menu</span>
        </>
      )}
    </button>
  );
};

const MainNavigation = ({ location, menuItems, enableDropdown }) => {
  const items = menuItems;
  const [open, setOpen] = React.useState(false);
  const handleToggle = () => {
    setOpen(prev => !prev);
  };


  if (!menuItems || !menuItems?.length) {
    return null
  }

  const openCloseClasses = open
    ? styles.openMenu
    : styles.closedMenu;
  const depthLevel = 0;
  return (
    <>
      <nav aria-label="Main" className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <Burger open={open} setOpen={handleToggle} />
          <ul className={openCloseClasses}>
            {items && items.map((navItem, index) => (
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
  );
};

export default MainNavigation;
