import styles from './TopMenu.module.scss'

import TopMenuItem from './TopMenuItem'

const TopMenu = ({ menuItems }) => {
  if (!menuItems || !menuItems?.length) {
    return null
  }
  return (
    <>
      <h1>hello world</h1>
      <ul className={styles.topMenuItems}>
        {menuItems.map((navItem, index) => (
          <TopMenuItem item={navItem} key={index} index={index} />
        ))}
      </ul>
    </>
  )
}

export default TopMenu
