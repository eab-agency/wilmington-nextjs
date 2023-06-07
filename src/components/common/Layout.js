import Meta from '@/components/common/Meta'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import useIsFrontPage from '@/functions/useIsFrontPage'
import styles from './Layout.module.scss'

import { Cantarell } from 'next/font/google'

const cantarell = Cantarell({
  weight: ['400', '700'],
  subsets: ['latin']
})

/**
 * Render the Layout component.
 *
 * @param  {object}  props          The component attributes as props.
 * @param  {any}     props.children Child component(s) to render.
 * @param  {object}  props.seo      Yoast SEO data from WordPress.
 * @return {Element}                The Layout component.
 */
export default function Layout({ children, seo }) {
  const { menus } = useWordPressContext()

  const isFrontPage = useIsFrontPage()

  return (
    <div className={`${cantarell.className}`}>
      <Meta seo={seo} />
      <Header menu={menus?.utilityNav} />
      <div
        className={`${styles.mainContainer} ${
          isFrontPage ? 'front-page' : 'std-page'
        }`}
      >
        <MainNavigation menuItems={menus?.mainNav} enableDropdown={true} />
        <main>{children}</main>
      </div>
      <Footer
        menus={{
          FOOTER_NAV: menus?.footerNav,
          RESOURCE_NAV: menus?.resourceNav
        }}
      />
    </div>
  )
}
