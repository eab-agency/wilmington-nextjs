import Meta from '@/components/common/Meta'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import useIsFrontPage from '@/functions/useIsFrontPage'
import formatHeirarchialMenu from '@/functions/wordpress/menus/formatHeirarchialMenu'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../../constants/menus'
import styles from './Layout.module.scss'

import { cantarell, icomoon, museo, robotoSlab } from '@/app/fonts'

/**
 * Render the Layout component.
 *
 * @param  {object}  props          The component attributes as props.
 * @param  {any}     props.children Child component(s) to render.
 * @param  {object}  props.seo      Yoast SEO data from WordPress.
 * @return {Element}                The Layout component.
 */
export default function Layout({ children }) {
  const { data } = useQuery(Layout.query, {
    variables: Layout.variables()
  })

  const isFrontPage = useIsFrontPage()
  const footerMenu = data?.footerMenuItems?.nodes ?? []
  const resourceMenu = data?.resourceMenuItems?.nodes ?? []
  const utilityMenu = data?.utilityMenuItems?.nodes ?? []
  const mainMenu = formatHeirarchialMenu(data?.mainMenuItems?.nodes ?? [])

  return (
    <div
      className={`${cantarell.variable} ${robotoSlab.variable} ${museo.variable} ${icomoon.variable} pageContainer`}
    >
      <style jsx global>{`
        :root {
          --font-museo: ${museo.style.fontFamily};
        }
      `}</style>
      <Header menu={utilityMenu} />
      <div
        className={`${styles.mainContainer} ${
          isFrontPage ? 'front-page' : 'std-page'
        }`}
      >
        <MainNavigation menuItems={mainMenu} enableDropdown={true} />
        <main>{children}</main>
      </div>
      <Footer
        menus={{
          FOOTER_NAV: footerMenu,
          RESOURCE_NAV: resourceMenu
        }}
      />
    </div>
  )
}

Layout.query = gql`
  ${MainNavigation.fragments.entry}
  query GetLayoutData(
    $resourceLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $mainLocation: MenuLocationEnum
    $utilityLocation: MenuLocationEnum
  ) {
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    resourceMenuItems: menuItems(where: { location: $resourceLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    mainMenuItems: menuItems(where: { location: $mainLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    utilityMenuItems: menuItems(
      where: { location: $utilityLocation }
      first: 100
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`

Layout.variables = (_, ctx) => {
  return {
    resourceLocation: MENUS.RESOURCE_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    mainLocation: MENUS.PRIMARY_LOCATION,
    utilityLocation: MENUS.UTILITY_LOCATION,
    asPreview: ctx?.asPreview
  }
}
