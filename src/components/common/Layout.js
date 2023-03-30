import Meta from '@/components/common/Meta'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'

import { Roboto_Slab, Cantarell } from "next/font/google"

const robotoSlab = Roboto_Slab({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

const cantarell = Cantarell({
  weight: ['400', '700'],
  subsets: ['latin'],
});

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

  return (
    <div className={`${robotoSlab.className} ${cantarell.className}`}>
      <Meta seo={seo} />
      <Header
        menu={menus?.UTILITY_NAV}
        search={<AlgoliaSearch useHistory={true} usePlaceholder={true} />}
      />
      <MainNavigation menuItems={menus?.MAIN_NAV} enableDropdown={true} />

      <div className={'${styles.mainContainer}'} >

        <main id="page-content">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
