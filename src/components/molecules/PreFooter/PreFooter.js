// import { MdAndroid } from 'react-icons/md' // Icons
import * as styles from './PreFooter.module.scss'
import FooterMenuItem from './FooterMenuItem'

const PreFooter = ({ menuItems }) => {
  console.log("🚀 ~ file: PreFooter.js:6 ~ PreFooter ~ menuItems:", menuItems)

  if (!menuItems || !menuItems?.length) {
    return null
  }

  return (
    <div className={styles.preFooter}>
      <h1>hello world</h1>
      <ul className={styles.footerMenu}>
        {menuItems.map((navItem, index) => (
          <FooterMenuItem item={navItem} key={index} index={index} />
        ))}
      </ul>
    </div>
  )
}

export default PreFooter
