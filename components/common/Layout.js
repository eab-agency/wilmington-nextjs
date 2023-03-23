import Meta from '@/components/common/Meta'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'

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
    <>
      <Meta seo={seo} />
      <Header
        menu={menus?.UTILITY_NAV}
        search={<AlgoliaSearch useHistory={true} usePlaceholder={true} />}
      />
      <main id="page-content">{children}</main>
      <Footer />
    </>
  )
}
