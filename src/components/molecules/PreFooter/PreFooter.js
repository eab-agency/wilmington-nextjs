// import { MdAndroid } from 'react-icons/md' // Icons
import * as styles from './PreFooter.module.scss'
import FooterMenuItem from './FooterMenuItem'

const PreeFooter = ({ location, menuItems }) => {
  // const items = useMenuItems(location) || menuItems
  const items = []

  return (
    <div className={styles.preFooter}>
      <ul className={styles.footerMenu}>
        {items.map((navItem, index) => (
          <FooterMenuItem item={navItem} key={index} index={index} />
        ))}
      </ul>
    </div>
  )
}

export default PreeFooter
