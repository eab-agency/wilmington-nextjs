import Meta from '@/components/common/Meta'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import useIsFrontPage from '@/functions/useIsFrontPage'
import styles from './Layout.module.scss'

import { cantarell, robotoSlab } from '@/app/fonts'

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
    <div
      className={`${cantarell.variable} ${robotoSlab.variable} pageContainer`}
    >
      <Meta seo={seo} />
      <Header menu={menus?.utility_nav} />
      <div
        className={`${styles.mainContainer} ${
          isFrontPage ? 'front-page' : 'std-page'
        }`}
      >
        <MainNavigation menuItems={menus?.main_nav} enableDropdown={true} />
        <main>{children}</main>
      </div>
      <Footer
        menus={{
          FOOTER_NAV: menus?.footer_nav,
          RESOURCE_NAV: menus?.resource_nav
        }}
      />
    </div>
  )
}
