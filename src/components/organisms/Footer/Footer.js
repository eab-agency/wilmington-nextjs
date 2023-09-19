import Logo from '@/components/atoms/Logo/Logo'
import FooterMenu from '@/components/molecules/Navigation/FooterMenu'
import PreFooter from '@/components/molecules/PreFooter'
import { useCustomData, useMenuData } from '@/functions/contextProviders/'
import { useContext } from 'react'
import * as styles from './Footer.module.scss'

const currentYear = new Date().getFullYear()

const Footer = () => {
  const { customOptions } = useCustomData()
  const { data: menus } = useMenuData()
  const footerMenu = menus?.footerMenuItems?.nodes ?? []
  const resourceMenu = menus?.resourceMenuItems?.nodes ?? []

  const {
    addresslocality,
    addressregion,
    postalcode,
    streetaddress,
    telephone,
    tollfreenumber
  } = customOptions || {}

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <PreFooter
          menuItems={footerMenu}
          location="FOOTER_NAV"
          styles={styles.footerMenux}
        />
        <div className={styles.navAddrSocial}>
          <div className={styles.schoolInfo}>
            <Logo type="dark" />
            <address>
              {streetaddress}
              <br /> {addresslocality}, {addressregion} {postalcode}
            </address>
            <ul>
              <li>
                <a href={`tel:1${telephone}`} className={styles.phoneLink}>
                  <span>{telephone}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${tollfreenumber}`} className={styles.phoneLink}>
                  <span>{tollfreenumber}</span>
                </a>
              </li>
            </ul>
          </div>
          <FooterMenu menuItems={resourceMenu} menuTitle="Resources" />
          <div className={styles.socialFooter}>
            <h3>Connect</h3>
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/WilmingtonCollege"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <span className="sr-only">Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/WilmingtonColl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <span className="sr-only">Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/wilmingtoncollege/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <span className="sr-only">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@wilmingtoncollege4545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <span className="sr-only">YouTube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.legal}>
          <small>
            Wilmington College does not discriminate on the basis of age, race,
            color, religion, national or ethnic origin, sexual orientation or
            disability in the administration of educational policies, admission
            policies, financial aid, employment or any other College program or
            activity.{' '}
            <a
              href="https://www.wilmington.edu/about/disclosures/"
              target="_blank"
            >
              Disclosures
            </a>{' '}
            <span className={styles.copyright}>
              ©{currentYear} Wilmington College. All rights reserved
            </span>
          </small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
