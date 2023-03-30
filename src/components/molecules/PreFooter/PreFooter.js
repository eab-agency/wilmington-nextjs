// import { MdAndroid } from 'react-icons/md' // Icons
import * as styles from './PreFooter.module.scss'
import FooterMenuItem from './FooterMenuItem'

const PreFooter = ({ menuItems }) => {

  if (!menuItems || !menuItems?.length) {
    return null
  }

  return (
    <div className={styles.preFooter}>
      <ul className={styles.footerMenu}>
        {menuItems.map((navItem, index) => (
          <FooterMenuItem item={navItem} key={index} index={index} />
        ))}
      </ul>
    </div>
  )
}

export default PreFooter
