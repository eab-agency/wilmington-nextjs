import Meta from '@/components/common/Meta'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import { useRouter } from 'next/router'
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

  const router = useRouter()
  const isFrontPage = router.asPath === '/'

  return (
    <div className={`${cantarell.className}`}>
      <Meta seo={seo} />
      <Header
        menu={menus?.UTILITY_NAV}
        search={<AlgoliaSearch useHistory={true} usePlaceholder={true} />}
      />
      <div
        className={`${styles.mainContainer} ${isFrontPage ? 'front-page' : ''}`}
      >
        <MainNavigation menuItems={menus?.MAIN_NAV} enableDropdown={true} />
        <main>{children}</main>
      </div>
      <Footer
        menus={{
          FOOTER_NAV: menus?.FOOTER_NAV,
          RESOURCE_NAV: menus?.RESOURCE_NAV
        }}
      />
    </div>
  )
}
