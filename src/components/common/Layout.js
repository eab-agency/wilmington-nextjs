import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import useIsFrontPage from '@/functions/useIsFrontPage'
import styles from './Layout.module.scss'

import HomepageModal from '@/components/HomepageModal'
import AlertBar from '@/components/organisms/AlertBar'
import { cantarell, icomoon, museo, robotoSlab } from '@/fonts'
/**
 * Render the Layout component.
 *
 * This component provides the main layout structure for all pages, including:
 * - Site header and navigation
 * - Alert bar for site-wide notifications
 * - Main content area
 * - Site footer
 * - Homepage modal for popup notifications
 *
 * The alerts system is integrated at the layout level to ensure alerts
 * appear consistently across all pages. The AlertBar appears within the
 * main content area, while the HomepageModal renders as an overlay.
 *
 * @param  {object}  props          The component attributes as props.
 * @param  {any}     props.children Child component(s) to render.
 * @param  {object}  props.seo      Yoast SEO data from WordPress.
 * @return {Element}                The Layout component.
 */

export default function Layout({ children }) {
  const isFrontPage = useIsFrontPage()

  return (
    <div
      className={`${cantarell.variable} ${robotoSlab.variable} ${museo.variable} ${icomoon.variable} pageContainer`}
    >
      <style jsx global>{`
        :root {
          --font-museo: ${museo.style.fontFamily};
        }
      `}</style>
      <Header />
      <div
        className={`${styles.mainContainer} ${
          isFrontPage ? 'front-page' : 'std-page'
        }`}
      >
        <MainNavigation enableDropdown={true} />
        <main>
          <AlertBar />
          {children}
        </main>
      </div>
      <Footer />
      <HomepageModal />
    </div>
  )
}
