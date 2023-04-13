import styles from '@/components/common/Layout.module.scss'
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'
import React from 'react'

import { Cantarell } from 'next/font/google'

const cantarell = Cantarell({
  weight: ['400', '700'],
  subsets: ['latin']
})

import '@/styles/styles.scss'

export const metadata = {
  title: 'Wilmington College',
  description:
    'Wilmington College offers quality hands-on education in disciplines including agriculture, athletic training, occupational therapy and more.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const mainNavMenuItems = await getMenuByLocation('MAIN_NAV')
  const utilityNavMenuItems = await getMenuByLocation('UTILITY_NAV')
  const footerNavMenuItems = await getMenuByLocation('FOOTER_NAV')
  const resourceNavMenuItems = await getMenuByLocation('UTILITY_NAV')

  return (
    <html lang="en">
      <body>
        <div className={`${cantarell.className}`}>
          <Header
            menuItems={utilityNavMenuItems}
            search={
              <AlgoliaSearch
                className=""
                useHistory={true}
                usePlaceholder={true}
              />
            }
          />
          {/* @ts-expect-error Async Server Component */}
          <MainNavigation menuItems={mainNavMenuItems} enableDropdown={true} />

          <div className={`${styles.mainContainer}`}>
            <main id="page-content">{children}</main>
          </div>
          <Footer
            menus={{
              FOOTER_NAV: footerNavMenuItems,
              RESOURCE_NAV: resourceNavMenuItems
            }}
          />
        </div>
      </body>
    </html>
  )
}
